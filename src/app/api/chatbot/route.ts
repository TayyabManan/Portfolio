import { OpenAI } from 'openai'
import { resumeData } from '@/lib/resume-data'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Input validation schema
const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(2000, 'Message too long')
  })).min(1).max(50, 'Too many messages in history')
})

// Configure API route
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout

// Initialize OpenAI client only when API key is available
let openai: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

function getResumeContext() {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData
  
  return `You are an AI assistant representing ${personalInfo.name}, a ${personalInfo.title}. 
You have access to their complete resume information and should answer questions as if you are representing them professionally.

PERSONAL INFORMATION:
- Name: ${personalInfo.name}
- Title: ${personalInfo.title}
- Email: ${personalInfo.email}
- Location: ${personalInfo.location}
- Website: ${personalInfo.website}
- Summary: ${personalInfo.summary}

EXPERIENCE:
${experience.map(job => `
- ${job.title} at ${job.company} (${job.startDate} - ${job.endDate})
  Location: ${job.location}
  ${job.description.join('\n  ')}
  Technologies: ${job.technologies.join(', ')}
`).join('\n')}

EDUCATION:
${education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate})
  GPA: ${edu.gpa || 'N/A'}
  ${edu.achievements ? edu.achievements.join(', ') : ''}
`).join('\n')}

SKILLS:
${skills.map(skill => `
- ${skill.category}: ${skill.items.join(', ')}
`).join('\n')}

PROJECTS:
${projects.map(project => `
- ${project.name}: ${project.description}
  Technologies: ${project.technologies.join(', ')}
  ${project.highlights.join(' ')}
`).join('\n')}

CERTIFICATIONS:
${certifications.map(cert => `
- ${cert.name} by ${cert.issuer} (${cert.date})
`).join('\n')}

INSTRUCTIONS:
1. Answer in first person as if you are ${personalInfo.name}
2. Be professional but conversational
3. Highlight relevant experience and skills based on the question
4. Keep responses concise and focused (max 500 tokens)
5. ONLY answer questions about ${personalInfo.name}'s resume, experience, skills, projects, education, and qualifications. If asked about anything unrelated (general knowledge, trivia, coding help, etc.), respond with: "I can only answer questions about Tayyab's professional background. Try asking about his experience, skills, or projects!"
6. Encourage the user to reach out via email (${personalInfo.email}) for opportunities or detailed discussions
7. Do not share personal contact information beyond what's already provided
8. Be helpful but maintain professional boundaries
9. NEVER use markdown formatting in responses — no asterisks, no bold, no headers, no bullet markers. Use plain text only. Use dashes (-) for lists and line breaks for structure.`
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 10 requests per minute per IP
    const rateLimitResult = await rateLimit(req, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10 // 10 requests per minute
    })
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait a moment before sending another message.',
          retryAfter: rateLimitResult.reset 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000))
          }
        }
      )
    }

    // Check API key configuration
    if (!process.env.OPENAI_API_KEY || !openai) {
      return NextResponse.json(
        { error: 'Chat service not configured. Please contact the administrator.' },
        { status: 503 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    
    // Validate input
    let validatedData
    try {
      validatedData = chatMessageSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        // Log detailed validation errors server-side only
        console.error('Chatbot validation error:', validationError.errors);
        return NextResponse.json(
          { error: 'Invalid request format. Please check your message and try again.' },
          { status: 400 }
        )
      }
      throw validationError
    }

    // Additional security check - prevent prompt injection
    const suspiciousPatterns = [
      /ignore.*previous.*instructions/i,
      /forget.*everything/i,
      /system.*prompt/i,
      /reveal.*instructions/i,
      /show.*system.*message/i
    ]
    
    const lastUserMessage = validatedData.messages[validatedData.messages.length - 1]
    if (lastUserMessage?.role === 'user') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(lastUserMessage.content)) {
          return NextResponse.json(
            { error: 'Invalid message content detected.' },
            { status: 400 }
          )
        }
      }
    }
    
    // Create OpenAI chat completion with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: getResumeContext()
        },
        ...validatedData.messages
      ],
    })
    
    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    // Log detailed error information server-side
    console.error('Chatbot error:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Check if it's an OpenAI API error
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string }
      console.error('OpenAI API error:', apiError);

      if (apiError.status === 401) {
        return NextResponse.json(
          { error: 'Chat service authentication failed.' },
          { status: 503 }
        )
      }
      if (apiError.status === 429) {
        return NextResponse.json(
          { error: 'AI service is currently overloaded. Please try again later.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}