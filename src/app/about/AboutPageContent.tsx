'use client'

import { motion } from 'framer-motion'
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
    <div className="relative bg-[var(--background)] py-16 min-h-screen">
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
                  interesting problems I was solving all came down to building better models, so I leaned into that fully.
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
                  Right now I&apos;m also going through AI training programs at Samsung Innovation Campus and AISkill Bridge
                  to sharpen my deep learning fundamentals. I&apos;m looking for Summer 2026 internship opportunities where
                  I can work on real ML problems with a strong engineering team, learn from experienced people, and
                  contribute meaningfully from day one.
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
            <div className="relative aspect-square w-64 mx-auto mb-8 rounded-xl overflow-hidden shadow-lg border-2 border-[var(--border)]">
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

        {/* Call to Action - Two column layout */}
        <div className="mt-16 bg-[var(--background-secondary)] rounded-2xl p-8 lg:p-12 border border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">Let&apos;s Work Together</h2>
              <p className="text-[var(--text-secondary)] mb-6 text-base sm:text-lg">
                I&apos;m always interested in discussing new opportunities, collaborating on innovative
                ML projects, or sharing insights about machine learning engineering, computer vision, and MLOps.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-all hover:scale-105 shadow-lg"
              >
                Get in Touch
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Right - SVG Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <svg className="w-full max-w-xs" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Coffee chat / collaboration illustration */}
                <g>
                  {/* Laptop */}
                  <g>
                    {/* Screen */}
                    <rect
                      x="95"
                      y="85"
                      width="70"
                      height="50"
                      rx="3"
                      fill="var(--accent)"
                      opacity="0.8"
                    />
                    {/* Screen border */}
                    <rect
                      x="98"
                      y="88"
                      width="64"
                      height="44"
                      rx="2"
                      fill="var(--background)"
                      opacity="0.3"
                    />

                    {/* Animated Code on screen */}
                    <g>
                      {[0, 1, 2, 3].map((i) => (
                        <motion.line
                          key={`code-${i}`}
                          x1="105"
                          y1={95 + i * 8}
                          x2="155"
                          y2={95 + i * 8}
                          stroke="var(--success)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.3,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                        />
                      ))}
                    </g>

                    {/* Keyboard base */}
                    <path
                      d="M 90 135 L 95 140 L 165 140 L 170 135 Z"
                      fill="var(--accent)"
                      opacity="0.8"
                    />
                  </g>

                  {/* Notebook with pen */}
                  <g>
                    {/* Notebook */}
                    <rect
                      x="50"
                      y="50"
                      width="35"
                      height="45"
                      rx="2"
                      fill="var(--warning)"
                      opacity="0.7"
                    />
                    {/* Spiral binding */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <circle
                        key={`spiral-${i}`}
                        cx="52"
                        cy={55 + i * 9}
                        r="2"
                        fill="var(--background)"
                        opacity="0.5"
                      />
                    ))}
                    {/* Lines on notebook */}
                    {[0, 1, 2, 3].map((i) => (
                      <line
                        key={`line-${i}`}
                        x1="58"
                        y1={60 + i * 8}
                        x2="80"
                        y2={60 + i * 8}
                        stroke="var(--background)"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}

                    {/* Animated Pen */}
                    <motion.g
                      animate={{
                        y: [0, -3, 0],
                        rotate: [0, -2, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <rect
                        x="75"
                        y="65"
                        width="4"
                        height="25"
                        fill="var(--info)"
                        opacity="0.8"
                        transform="rotate(-45 77 77)"
                      />
                      <path
                        d="M 88 52 L 90 50 L 92 52 Z"
                        fill="var(--text)"
                        opacity="0.7"
                      />
                    </motion.g>
                  </g>

                  {/* Animated Floating idea icons */}
                  {[
                    { x: 140, y: 50, icon: 'lightbulb', delay: 0 },
                    { x: 170, y: 70, icon: 'star', delay: 0.5 },
                    { x: 45, y: 30, icon: 'checkmark', delay: 1 }
                  ].map((item, i) => (
                    <motion.g
                      key={`icon-${i}`}
                      animate={{
                        y: [0, -5, 0],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.icon === 'lightbulb' && (
                        <>
                          <circle cx={item.x} cy={item.y} r="6" fill="var(--warning)" opacity="0.7" />
                          <rect x={item.x - 2} y={item.y + 6} width="4" height="4" fill="var(--warning)" opacity="0.7" />
                        </>
                      )}
                      {item.icon === 'star' && (
                        <motion.path
                          d={`M ${item.x} ${item.y - 6} L ${item.x + 2} ${item.y} L ${item.x + 6} ${item.y + 2} L ${item.x + 2} ${item.y + 4} L ${item.x} ${item.y + 8} L ${item.x - 2} ${item.y + 4} L ${item.x - 6} ${item.y + 2} L ${item.x - 2} ${item.y} Z`}
                          fill="var(--success)"
                          opacity="0.7"
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}
                      {item.icon === 'checkmark' && (
                        <motion.path
                          d={`M ${item.x - 4} ${item.y} L ${item.x - 1} ${item.y + 4} L ${item.x + 4} ${item.y - 4}`}
                          stroke="var(--success)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                          opacity="0.7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                        />
                      )}
                    </motion.g>
                  ))}

                  {/* Animated Chat bubbles */}
                  <motion.g
                    animate={{
                      y: [0, -3, 0],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Bubble 1 */}
                    <rect x="115" y="160" width="30" height="20" rx="8" fill="var(--primary)" opacity="0.6" />
                    <path d="M 120 180 L 125 185 L 130 180" fill="var(--primary)" opacity="0.6" />
                  </motion.g>

                  <motion.g
                    animate={{
                      y: [0, -3, 0],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Bubble 2 */}
                    <rect x="55" y="165" width="25" height="18" rx="7" fill="var(--accent)" opacity="0.6" />
                    <path d="M 60 183 L 64 187 L 68 183" fill="var(--accent)" opacity="0.6" />
                  </motion.g>

                  {/* Animated Connecting dots showing collaboration */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                      key={`dot-${i}`}
                      cx={60 + i * 20}
                      cy={155}
                      r="2"
                      fill="var(--info)"
                      opacity="0.4"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}