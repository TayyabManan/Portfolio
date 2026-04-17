"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Github, Linkedin } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Anti-spam field
}

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: "Email",
    value: null,
    href: null,
    obfuscated: true,
  },
  {
    icon: MapPinIcon,
    label: "Location",
    value: "Islamabad, Pakistan",
    href: null,
  },
];

export default function ContactPageContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    mode: 'onBlur',
  });

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => setSubmitStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setSubmitStatus("success");
      toast.success("Message sent", "I'll get back to you within 24 hours.");
      reset();
    } catch {
      setSubmitStatus("error");
      toast.error("Couldn't send your message", "Try again or email me directly at m.tayyab.manan@gmail.com");
    } finally {
      clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--background)] py-16 sm:py-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned */}
        <div className="mb-16 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            I&apos;m always interested in discussing new opportunities,
            collaborating on projects, or sharing insights about machine learning,
            AI development, and geospatial intelligence. Let&apos;s connect!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-6">
              Contact Information
            </h2>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {item.label}
                    </p>
                    {'obfuscated' in item && item.obfuscated ? (
                      <ObfuscatedEmail className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" />
                    ) : item.href ? (
                      <a
                        href={item.href}
                        className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[var(--text-secondary)]">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
                Connect Online
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/tayyabmanan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-[border-color,color] text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  aria-label="LinkedIn (opens in new window)"
                >
                  <Linkedin className="h-6 w-6" />
                  <ArrowTopRightOnSquareIcon className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--background)] rounded" />
                </a>
                <a
                  href="https://github.com/TayyabManan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-[border-color,color] text-[var(--text)] hover:text-[var(--text-secondary)]"
                  aria-label="GitHub (opens in new window)"
                >
                  <Github className="h-6 w-6" />
                  <ArrowTopRightOnSquareIcon className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--background)] rounded" />
                </a>
                <a
                  href="https://www.upwork.com/users/~0155edcc7d42fc5b51"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-[border-color,color] text-[var(--success)] hover:text-[var(--success)]/80"
                  aria-label="Upwork (opens in new window)"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                  </svg>
                  <ArrowTopRightOnSquareIcon className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--background)] rounded" />
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-8 p-6 bg-[var(--background-secondary)] rounded-lg">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                Availability
              </h3>
              <p className="text-[var(--text-secondary)]">
                Currently available for full-time positions, consulting
                projects, and collaborative opportunities. I typically respond
                to messages within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-[var(--background-secondary)] p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-6">
                Send a Message
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
                  <p className="text-[var(--success)]">
                    Message sent — I&apos;ll reply within 24 hours.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-lg">
                  <p className="text-[var(--error)]">
                    Couldn&apos;t send your message. Try again or email me directly at m.tayyab.manan@gmail.com.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text)]"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1 text-sm text-[var(--error)]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text)]"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1 text-sm text-[var(--error)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 2,
                        message: "Subject must be at least 2 characters long"
                      }
                    })}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text)]"
                    placeholder="Project collaboration, job opportunity..."
                    aria-required="true"
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <p id="subject-error" role="alert" className="mt-1 text-sm text-[var(--error)]">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters long"
                      }
                    })}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text)]"
                    placeholder="Tell me about your project, opportunity, or question..."
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`${
                      (watch('message')?.length || 0) >= 10
                        ? 'text-[var(--success)]'
                        : 'text-[var(--text-tertiary)]'
                    }`}>
                      {watch('message')?.length || 0} / 10 minimum
                    </span>
                  </div>
                  {errors.message && (
                    <p id="message-error" role="alert" className="mt-1 text-sm text-[var(--error)]">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  {...register("honeypot")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 active:scale-[0.98] transition-[colors,transform]"
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
