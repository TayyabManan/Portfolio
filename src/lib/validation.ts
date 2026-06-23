import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  subject: z.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .transform(str => str.trim())
})

// Project slug validation
export const projectSlugSchema = z.string()
  .regex(/^[a-z0-9-]+$/, 'Invalid project slug')
  .max(100, 'Slug too long')

// Environment variables validation
export const envSchema = z.object({
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NTFY_TOPIC: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type ProjectSlug = z.infer<typeof projectSlugSchema>