import { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Education from '@/components/sections/Education'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import Skills from '@/components/sections/Skills'
import CurrentlyLearning from '@/components/sections/CurrentlyLearning'
import CallToAction from '@/components/sections/CallToAction'

export const metadata: Metadata = {
  title: 'Home',
  description: 'AI Engineering graduate student specializing in Computer Vision, NLP, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow & LangChain. Portfolio showcasing machine learning projects and AI-powered solutions. Seeking Summer 2026 ML/AI internships.',
  openGraph: {
    title: 'Tayyab Manan | AI Engineering Student & ML Developer',
    description: 'AI Engineering graduate student specializing in Computer Vision, NLP, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow & LangChain. Portfolio showcasing machine learning projects and AI-powered solutions.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan - AI Engineering Student & ML Developer Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan | AI Engineering Student',
    description: 'AI Engineering student building ML systems with PyTorch, TensorFlow & LangChain. Computer Vision, NLP & Geospatial AI portfolio.',
    images: ['/images/profile-picture.webp'],
    creator: '@tayyabmanan',
  },
  alternates: {
    canonical: 'https://tayyabmanan.com',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Education />
      <FeaturedProjects />
      <Skills />
      <CurrentlyLearning />
      <CallToAction />
    </>
  )
}