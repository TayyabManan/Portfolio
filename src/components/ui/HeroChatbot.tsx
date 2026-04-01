'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function HeroChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Tayyab's AI assistant. Ask me anything about his experience, skills, or projects."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  const quickQuestions = [
    "What's your experience?",
    "Top skills?",
    "Recent projects?",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        const assistantId = Date.now().toString() + '-assistant'

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]

            if (lastMessage?.id === assistantId) {
              lastMessage.content = assistantMessage
            } else {
              newMessages.push({
                id: assistantId,
                role: 'assistant',
                content: assistantMessage
              })
            }

            return newMessages
          })
        }
      }
    } catch {
      setError('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => {
      const form = document.getElementById('hero-chat-form') as HTMLFormElement
      if (form) form.requestSubmit()
    }, 10)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] overflow-hidden flex flex-col h-[480px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="relative">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-[var(--primary)]" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Ask my AI assistant</h3>
          <p className="text-[10px] text-[var(--text-tertiary)]">Powered by my resume data</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} data-lenis-prevent className="flex-1 min-h-0 overflow-y-scroll px-4 py-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background)] text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 text-red-500 rounded-lg px-3 py-1.5 text-xs">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-[11px] px-2.5 py-1 bg-[var(--background)] text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form id="hero-chat-form" onSubmit={handleSubmit} className="px-3 py-3 border-t border-[var(--border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my experience..."
            className="flex-1 px-3 py-2 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-xs placeholder:text-[var(--text-tertiary)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
