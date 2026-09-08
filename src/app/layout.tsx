import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ClientLayout from '@/components/ClientLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { themeColor } from '@/lib/themes'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import './globals.css'


// Display voice. Variable font with the opsz axis loaded: Bricolage carries
// three optical cuts (12-96), so the hero's 10rem headline gets the tightened
// display cut and small headings the readable text cut - no manual tracking
// heroics needed (typography pass, Aug 2026).
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

// Body voice: warm humanist grotesque (replaced Geist - Vercel's brand font
// read as borrowed identity to the design-literate, and its cool Swiss tone
// fought the warm stone palette). Full italics for prose emphasis.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

// Annotation voice: eyebrows, doodle captions, cover metrics, code blocks
// (replaced Geist Mono in the same pass as the body swap - the Geist pair is
// the recognizable Vercel signature; Plex Mono carries genuine engineering-
// document lineage that suits the lab-notebook identity). Variable is
// --font-plex-mono (NOT --font-mono): the Tailwind @theme key --font-mono
// maps to it, and naming both the same would make the emitted default
// self-referential. preload: false - all mono usage sits below the fold.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false,
  fallback: ['Consolas', 'Monaco', 'monospace'],
  adjustFontFallback: true,
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Address-bar color = page surface (paper/stone). Media-queried for first
  // paint; after hydration ThemeContext rewrites both tags whenever the site
  // toggle diverges from the OS scheme.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: themeColor.dark },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tayyabmanan.com'),
  applicationName: 'Tayyab Manan',
  title: {
    default: 'Tayyab Manan - AI/ML Engineer',
    template: '%s | Tayyab Manan'
  },
  description: 'AI/ML Engineer shipping production ML, computer vision & multi-agent systems. Seven deployed projects with live demos in PyTorch, TensorFlow & LangChain.',
  keywords: [
    'AI ML Engineer',
    'Machine Learning Engineer',
    'Computer Vision Engineer',
    'Multi-Agent Systems',
    'Geospatial AI',
    'PyTorch Developer',
    'TensorFlow Developer',
    'LangChain Developer',
    'Production ML Systems',
    'Deep Learning',
    'MLOps',
    'Python AI Developer',
    'Tayyab Manan',
    'AI Engineering COMSATS',
    'Satellite Imagery Analysis',
    'NLP Engineer',
  ],
  authors: [{ name: 'Tayyab Manan' }],
  creator: 'Tayyab Manan',
  publisher: 'Tayyab Manan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: 'Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML engineer shipping production ML, computer vision, and multi-agent systems. Seven deployed projects with live demos.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    locale: 'en_US',
    type: 'profile',
    // OG/Twitter image is supplied by the app/opengraph-image.tsx branded card.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan - AI/ML Engineer',
    description: 'AI/ML engineer shipping production ML, computer vision, and multi-agent systems. Seven deployed projects with live demos.',
    creator: '@tayyabmanan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      // Theme-aware mark: embedded prefers-color-scheme style flips the fill
      // with the OS theme (modern browsers pick the SVG over the PNGs).
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.svg',
        // Brand ink (deepest), matching logo.svg/manifest - deliberately NOT
        // themes.light.primary, which is the softened UI ink (#292524).
        color: '#1c1917',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://tayyabmanan.com',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://tayyabmanan.com/#person',
    name: 'Tayyab Manan',
    alternateName: 'Muhammad Tayyab Manan',
    givenName: 'Tayyab',
    familyName: 'Manan',
    url: 'https://tayyabmanan.com',
    mainEntityOfPage: 'https://tayyabmanan.com',
    image: {
      '@type': 'ImageObject',
      url: 'https://tayyabmanan.com/images/profile-picture.webp',
      width: 1024,
      height: 1024,
      caption: 'Tayyab Manan - AI/ML Engineer'
    },
    sameAs: [
      'https://www.linkedin.com/in/tayyabmanan',
      'https://github.com/TayyabManan',
      'https://twitter.com/tayyabmanan'
    ],
    jobTitle: 'AI/ML Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Cointegration',
      url: 'https://cointegration.ai/'
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of the Punjab',
        location: 'Lahore, Pakistan'
      }
    ],
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'COMSATS University Islamabad',
      location: 'Islamabad, Pakistan'
    },
    description: 'AI/ML engineer building production machine learning systems with PyTorch, TensorFlow, and LangChain, across computer vision, multi-agent workflows, time-series forecasting, and geospatial analysis.',
    knowsAbout: [
      'Machine Learning',
      'Artificial Intelligence',
      'Computer Vision',
      'Natural Language Processing (NLP)',
      'Deep Learning',
      'PyTorch',
      'TensorFlow',
      'Scikit-learn',
      'Keras',
      'LangChain',
      'Hugging Face Transformers',
      'OpenAI GPT',
      'Neural Networks',
      'Convolutional Neural Networks (CNN)',
      'Recurrent Neural Networks (RNN)',
      'Transformer Models',
      'BERT',
      'GPT',
      'Object Detection',
      'Image Classification',
      'Semantic Segmentation',
      'Text Classification',
      'Named Entity Recognition',
      'Sentiment Analysis',
      'MLOps',
      'Model Deployment',
      'FastAPI',
      'Flask',
      'Docker',
      'Time Series Forecasting',
      'Geospatial AI',
      'Google Earth Engine',
      'Satellite Imagery Analysis',
      'Remote Sensing',
      'GeoPandas',
      'Python Programming',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn',
      'Data Science',
      'Feature Engineering',
      'Model Optimization',
      'Hyperparameter Tuning',
      'Cross Validation',
      'Data Visualization',
      'Jupyter Notebooks',
      'Git',
      'GitHub',
      'Multi-agent Systems',
      'AutoGen',
      'CrewAI',
      'Reinforcement Learning',
      'Transfer Learning',
      'Model Fine-tuning'
    ],
    email: 'm.tayyab.manan@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Islamabad',
      addressCountry: 'Pakistan'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://tayyabmanan.com/#website',
    url: 'https://tayyabmanan.com',
    name: 'Tayyab Manan',
    alternateName: ['Tayyab Manan Portfolio', 'Tayyab Manan - AI/ML Engineer'],
    description: 'Projects, writing, and résumé of Tayyab Manan, AI/ML engineer.',
    about: {
      '@id': 'https://tayyabmanan.com/#person'
    },
    publisher: {
      '@id': 'https://tayyabmanan.com/#person'
    },
    author: {
      '@id': 'https://tayyabmanan.com/#person'
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tayyabmanan.com/projects?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://tayyabmanan.com/#profilepage',
    url: 'https://tayyabmanan.com',
    name: 'Tayyab Manan',
    description: 'Tayyab Manan, AI/ML engineer in Islamabad.',
    mainEntity: {
      '@id': 'https://tayyabmanan.com/#person'
    },
    inLanguage: 'en-US',
    isPartOf: {
      '@id': 'https://tayyabmanan.com/#website'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': 'https://tayyabmanan.com/#navigation',
    name: 'Main Navigation',
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'About',
        description: 'About Tayyab Manan - AI/ML Engineer',
        url: 'https://tayyabmanan.com/about'
      },
      {
        '@type': 'WebPage',
        name: 'Projects',
        description: 'ML & AI Projects Portfolio',
        url: 'https://tayyabmanan.com/projects'
      },
      {
        '@type': 'WebPage',
        name: 'Blog',
        description: 'Write-ups on building ML systems',
        url: 'https://tayyabmanan.com/blog'
      },
      {
        '@type': 'WebPage',
        name: 'Resume',
        description: 'AI/ML Engineer Resume',
        url: 'https://tayyabmanan.com/resume'
      },
      {
        '@type': 'WebPage',
        name: 'Contact',
        description: 'Get in touch for collaboration',
        url: 'https://tayyabmanan.com/contact'
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': 'https://tayyabmanan.com/#education',
    name: 'MS Artificial Intelligence Engineering',
    credentialCategory: 'degree',
    educationalLevel: 'Master\'s Degree',
    competencyRequired: [
      'Machine Learning',
      'Computer Vision',
      'Natural Language Processing',
      'Deep Learning',
      'PyTorch',
      'TensorFlow',
      'Python Programming'
    ],
    recognizedBy: {
      '@type': 'CollegeOrUniversity',
      name: 'COMSATS University Islamabad',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressCountry: 'Pakistan'
      }
    }
  }
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-paint theme resolution: only sets data-theme; the token values
            live in globals.css (:root = light, [data-theme="dark"] = dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const key = (saved === 'dark' || saved === 'light') ? saved :
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', key);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className={`${hankenGrotesk.variable} ${bricolageGrotesque.variable} ${plexMono.variable} ${hankenGrotesk.className}`} suppressHydrationWarning>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-[var(--on-primary)] focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
        >
          Skip to main content
        </a>
        <GoogleAnalytics />
        <ErrorBoundary>
          <ThemeProvider>
            <SmoothScrollProvider>
              <ClientLayout>
                {children}
                <Analytics />
              </ClientLayout>
            </SmoothScrollProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <SpeedInsights/>
      </body>
    </html>
  )
}