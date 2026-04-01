import { Metadata } from 'next'
import ResumePageContent from './ResumePageContent'

export const metadata: Metadata = {
  title: 'Resume - Tayyab Manan | AI/ML Engineer',
  description: 'AI/ML Engineer resume. Building production ML systems with PyTorch, TensorFlow & LangChain. Expertise in Computer Vision, Multi-Agent Systems, and Geospatial AI. MS in AI Engineering at COMSATS.',
  keywords: [
    'AI ML engineer resume',
    'machine learning engineer CV',
    'computer vision engineer resume',
    'PyTorch developer CV',
    'TensorFlow engineer resume',
    'AI engineering COMSATS',
    'Tayyab Manan resume',
    'AI engineering resume',
    'ML engineer Pakistan'
  ],
  openGraph: {
    title: 'Resume - Tayyab Manan | AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems with PyTorch, TensorFlow & LangChain. Computer Vision, Multi-Agent Systems & Geospatial AI.',
    url: 'https://tayyabmanan.com/resume',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan - AI/ML Engineer Resume',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume - Tayyab Manan | AI/ML Engineer',
    description: 'AI/ML Engineer. Computer Vision, Multi-Agent Systems & Geospatial AI. PyTorch, TensorFlow & LangChain.',
    images: ['/images/profile-picture.webp'],
  },
  alternates: {
    canonical: 'https://tayyabmanan.com/resume',
  },
}

export default function ResumePage() {
  return <ResumePageContent />
}
