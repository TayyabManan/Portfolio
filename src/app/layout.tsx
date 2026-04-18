import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ProgressBarProvider } from '@/components/ProgressBar'
import ClientLayout from '@/components/ClientLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { themes } from '@/lib/themes'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import './globals.css'


const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tayyabmanan.com'),
  applicationName: 'Tayyab Manan',
  title: {
    default: 'Tayyab Manan — AI/ML Engineer',
    template: '%s | Tayyab Manan'
  },
  description: 'AI/ML Engineer building production ML systems, computer vision solutions, and multi-agent workflows. PyTorch, TensorFlow, LangChain. Portfolio showcasing deployed machine learning projects and AI-powered applications.',
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
    title: 'Tayyab Manan — AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems, computer vision solutions, and multi-agent workflows. PyTorch, TensorFlow, LangChain.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan — AI/ML Engineer Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan — AI/ML Engineer',
    description: 'AI/ML Engineer building production ML systems with PyTorch, TensorFlow & LangChain. Computer Vision, Multi-Agent Systems & Geospatial AI.',
    images: ['/images/profile-picture.webp'],
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
        color: '#3b82f6',
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
      width: 1200,
      height: 630,
      caption: 'Tayyab Manan — AI/ML Engineer'
    },
    sameAs: [
      'https://www.linkedin.com/in/tayyabmanan',
      'https://github.com/TayyabManan',
      'https://twitter.com/tayyabmanan'
    ],
    jobTitle: 'AI/ML Engineer',
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
    description: 'AI/ML Engineer building production machine learning systems with PyTorch, TensorFlow, and LangChain. Specializing in Computer Vision, Multi-Agent Systems, and Geospatial AI. Experienced in deploying ML models for computer vision tasks, multi-agent workflows, time-series forecasting, and geospatial analysis. Proficient in Python, deep learning frameworks, MLOps, model deployment, and AI system architecture.',
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
      'Predictive Analytics',
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
    alternateName: ['Tayyab Manan Portfolio', 'Tayyab Manan — AI/ML Engineer'],
    description: 'AI/ML Engineer portfolio showcasing production machine learning systems, computer vision applications, multi-agent workflows, and geospatial AI solutions built with PyTorch, TensorFlow, and LangChain.',
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
    description: 'Professional portfolio and profile of Tayyab Manan, AI/ML Engineer specializing in Computer Vision, Multi-Agent Systems, and Production ML.',
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
        description: 'About Tayyab Manan — AI/ML Engineer',
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
        description: 'AI/ML Engineering Insights & Tutorials',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var themes = ${JSON.stringify(themes)};
                  var saved = localStorage.getItem('theme');
                  var key = (saved === 'dark' || saved === 'light') ? saved :
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  var t = themes[key];
                  var r = document.documentElement;
                  r.setAttribute('data-theme', key);
                  Object.entries(t).forEach(function(e) {
                    r.style.setProperty('--' + e[0].replace(/([A-Z])/g, '-$1').toLowerCase(), e[1]);
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Font optimization - preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className={`${inter.variable} ${bricolageGrotesque.variable} ${inter.className}`} suppressHydrationWarning>
        {/* Page transition progress bar */}
        <ProgressBarProvider />
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
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