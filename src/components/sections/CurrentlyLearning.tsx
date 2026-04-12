'use client'

import {
  BookOpenIcon,
  BeakerIcon,
  RocketLaunchIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function CurrentlyLearning() {
  const learningItems = [
    {
      icon: BookOpenIcon,
      category: "Studying",
      items: [
        "Advanced Transformer Architectures & Attention Mechanisms",
        "Multi-Agent Orchestration Patterns",
        "Deep Learning Specialization (Coursera)",
        "Distributed Training & Model Parallelism",
      ],
      color: "primary"
    },
    {
      icon: BeakerIcon,
      category: "Experimenting With",
      items: [
        "Fine-tuning Large Language Models for Domain Tasks",
        "Diffusion Models for Satellite Imagery Super-Resolution",
        "RAG Pipelines with Vector Databases",
      ],
      color: "accent"
    },
    {
      icon: BookOpenIcon,
      category: "Reading",
      items: [
        "Chip Huyen's 'AI Engineering: Building Applications with Foundation Models'",
        "Aur\u00E9lien G\u00E9ron's 'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow'"
      ],
      color: "info"
    },
    {
      icon: RocketLaunchIcon,
      category: "Next Goals",
      items: [
        "Scale multi-agent orchestration for enterprise document processing",
        "Publish geospatial forecasting research from Master's thesis",
        "Contribute to LangChain or AutoGen open-source projects",
      ],
      color: "warning"
    }
  ]

  const colorClasses = {
    primary: {
      bg: "bg-[var(--primary)]/10",
      text: "text-[var(--primary)]",
      border: "border-[var(--primary)]/20"
    },
    accent: {
      bg: "bg-[var(--accent)]/10",
      text: "text-[var(--accent)]",
      border: "border-[var(--accent)]/20"
    },
    info: {
      bg: "bg-[var(--info)]/10",
      text: "text-[var(--info)]",
      border: "border-[var(--info)]/20"
    },
    warning: {
      bg: "bg-[var(--warning)]/10",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/20"
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background)] border border-[var(--border)] mb-4">
            <SparklesIcon className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Continuous Learning</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Currently Learning & Exploring
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Actively expanding my skills and knowledge in AI/ML through courses, experiments, and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {learningItems.map((section, index) => {
            const colors = colorClasses[section.color as keyof typeof colorClasses]
            return (
              <div
                key={index}
                className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 hover:border-[var(--primary)] transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <section.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)]">
                    {section.category}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-[var(--text-secondary)] group"
                    >
                      <span className={`mt-1.5 w-2 h-2 rounded-full ${colors.text} flex-shrink-0 group-hover:scale-150 transition-transform opacity-80`} style={{ backgroundColor: 'currentColor' }} />
                      <span className="font-medium group-hover:text-[var(--text)] transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
