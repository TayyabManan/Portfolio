'use client'

import { CheckCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { MapPinIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import { resumeData, formatDate } from '@/lib/resume-data'
import Link from 'next/link'
import Image from 'next/image'

const skills = [
  'Machine Learning & Deep Learning (PyTorch, TensorFlow)',
  'Computer Vision & Image Processing',
  'Natural Language Processing (NLP)',
  'MLOps & Model Deployment',
  'Geospatial AI & Remote Sensing',
  'Multi-Agent AI Systems (LangChain, AutoGen, CrewAI)',
  'Python Programming & Data Engineering',
  'Full Stack Development (React, Next.js, FastAPI)'
]

const education = [
  {
    degree: 'Bachelor of Science in Geographic Information Systems(GIS)',
    school: 'University of the Punjab, Lahore',
    year: '2025',
    description: 'Developing GIS solutions using Python, QGIS, and Google Earth Engine to transform satellite data into actionable insights.'
  },
  {
    degree: 'Masters in Artificial Intelligence Engineering',
    school: 'COMSATS Islamabad',
    year: '2027 (Expected)',
    description: 'Graduate student specializing in computer vision, deep learning architectures, and practical AI system deployment.'
  }
]

const experience = [
  {
    role: 'Project Experience',
    company: 'WaterTrace Pakistan',
    period: '2024 - 2025',
    description: 'Built ML-powered groundwater prediction system using 22 years of satellite data. Achieved R²=0.89 through feature engineering and model optimization. Deployed full-stack application with React and Flask.'
  },
  {
    role: 'Academic Projects',
    company: 'University Coursework',
    period: '2023 - Present',
    description: 'Developing ML solutions for coursework including computer vision applications, NLP systems, and geospatial analysis projects. Building hands-on experience with PyTorch, TensorFlow, and modern ML frameworks.'
  }
]

export default function AboutPage() {
  return (
    <div className="relative bg-[var(--background)] py-16 sm:py-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned */}
        <div className="mb-16 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">About Me</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            AI Engineering graduate student building machine learning systems with focus
            on Computer Vision, NLP, and Geospatial AI. Seeking Summer 2026 internships.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Bio & Skills - Left side on desktop, order-1 on mobile */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <section>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4">About My Journey</h2>
              <div className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                <p>
                  I got into AI through an unusual path: geography. During my Bachelor&apos;s in GIS at Punjab University,
                  I spent a lot of time working with satellite imagery and spatial data. At some point I realized the most
                  interesting problems I was solving all came down to building better models, so I leaned into that.
                  Now I&apos;m doing my Master&apos;s in AI Engineering at COMSATS University, Islamabad.
                </p>
                <p>
                  Alongside my studies, I work as a Junior AI Developer at Cointegration, where I build production ML models
                  and multi-agent systems with LangChain, AutoGen, and the Model Context Protocol. On the side, I take on
                  freelance projects. One example is WaterTrace, where I used 22 years of satellite data to predict groundwater
                  levels across 145 districts in Pakistan. I like working across the full stack, from training models in
                  PyTorch to deploying them behind Flask APIs with React frontends.
                </p>
                <p>
                  I&apos;m also going through AI training programs at Samsung Innovation Campus and AISkill Bridge
                  to fill gaps in my deep learning knowledge. I&apos;m looking for Summer 2026 internship opportunities where
                  I can work on real ML problems with a strong engineering team and learn from experienced people.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Core Competencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                    <span className="text-[var(--text-secondary)]">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Profile - Right side on desktop, order-1 on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="relative aspect-square w-64 mx-auto mb-8 rounded-xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(28,25,23,0.12)]">
              <Image
                src="/images/profile-picture.webp"
                alt="Tayyab Manan - ML Engineer and AI Developer specializing in Computer Vision, NLP, and Geospatial AI"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 256px"
                priority
              />
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
                <MapPinIcon className="h-5 w-5" />
                <span>Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
                <BriefcaseIcon className="h-5 w-5" />
                <span>Available for Remote Work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <AcademicCapIcon className="h-6 w-6 text-[var(--primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text)]">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-[var(--primary-light)] pl-6 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text)]">{edu.degree}</h3>
                    <span className="text-sm text-[var(--primary)] font-medium">{edu.year}</span>
                  </div>
                  <p className="text-[var(--primary)] font-medium mb-2">{edu.school}</p>
                  <p className="text-[var(--text-secondary)]">{edu.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BriefcaseIcon className="h-6 w-6 text-[var(--primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text)]">Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-[var(--primary-light)] pl-6 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text)]">{exp.role}</h3>
                    <span className="text-sm text-[var(--primary)] font-medium">{exp.period}</span>
                  </div>
                  <p className="text-[var(--primary)] font-medium mb-2">{exp.company}</p>
                  <p className="text-[var(--text-secondary)]">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Certifications */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckBadgeIcon className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold text-[var(--text)]">Certifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="border-l-2 border-[var(--primary-light)] pl-6">
                {cert.credentialUrl ? (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors mb-1 block">
                    {cert.name}
                  </a>
                ) : (
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-1">{cert.name}</h3>
                )}
                <p className="text-[var(--primary)] font-medium mb-1">{cert.issuer}</p>
                <p className="text-sm text-[var(--text-secondary)]">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-16 bg-[var(--background-secondary)] rounded-2xl p-8 lg:p-12 border border-[var(--border)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">Let&apos;s Work Together</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-base sm:text-lg max-w-2xl">
            I&apos;m always interested in discussing new opportunities, collaborating on innovative
            ML projects, or sharing insights about machine learning engineering, computer vision, and MLOps.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-all duration-200"
          >
            Get in Touch
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}