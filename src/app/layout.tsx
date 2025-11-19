import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
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
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-bricolage-grotesque',
  display: 'swap', // Ensures text is visible during font load
  preload: true, // Preload font files for faster loading
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'], // Fallback fonts
  adjustFontFallback: true, // Reduce layout shift by adjusting fallback font metrics
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
    default: 'Tayyab Manan | AI Engineering Student & ML Developer',
    template: '%s | Tayyab Manan'
  },
  description: 'AI Engineering graduate student specializing in Computer Vision, NLP, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow, and LangChain. Portfolio showcasing machine learning projects, deep learning applications, and AI-powered solutions. Seeking Summer 2026 ML/AI internships.',
  keywords: [
    // Primary AI/ML Keywords
    'AI Engineering Student',
    'Machine Learning Student',
    'Computer Vision Student',
    'AI Graduate Student',
    'ML Engineering Student',
    'Deep Learning Student',
    'AI Student Portfolio',
    'ML Student Portfolio',

    // Technical Skills - Frameworks
    'PyTorch Developer',
    'TensorFlow Developer',
    'Scikit-learn',
    'LangChain Developer',
    'Keras',
    'Hugging Face Transformers',

    // Technical Skills - Domains
    'Computer Vision',
    'Natural Language Processing',
    'NLP Student',
    'Geospatial AI',
    'MLOps',
    'Model Deployment',
    'Deep Learning',
    'Neural Networks',
    'Time Series Forecasting',
    'Predictive Analytics',

    // GIS & Geospatial (Secondary)
    'Geospatial Machine Learning',
    'Google Earth Engine',
    'Remote Sensing AI',
    'Satellite Imagery Analysis',
    'GIS Python',
    'GeoPandas',

    // Programming & Tools
    'Python Machine Learning',
    'Python AI Developer',
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Data Science',
    'FastAPI',
    'Flask ML API',

    // Project Types
    'ML Projects',
    'AI Applications',
    'Computer Vision Projects',
    'NLP Projects',
    'Geospatial AI Projects',
    'ML Portfolio Projects',

    // Career & Location
    'Tayyab Manan',
    'ML Internship 2026',
    'AI Internship Summer 2026',
    'ML Student Pakistan',
    'AI Engineering COMSATS',
    'Remote ML Internship',
    'ML Engineer Entry Level',

    // Education
    'AI Engineering Masters',
    'MS AI Engineering',
    'COMSATS University',
    'AI Graduate Program'
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
    title: 'Tayyab Manan | AI Engineering Student & ML Developer',
    description: 'AI Engineering graduate student specializing in Computer Vision, NLP, and Geospatial AI. Building production ML systems with PyTorch, TensorFlow & LangChain. Portfolio showcasing innovative machine learning projects and AI-powered applications. Seeking Summer 2026 ML/AI internships.',
    url: 'https://tayyabmanan.com',
    siteName: 'Tayyab Manan',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: '/images/profile-picture.webp',
        width: 1200,
        height: 630,
        alt: 'Tayyab Manan - AI Engineering Student Portfolio - Machine Learning & Computer Vision Projects',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayyab Manan | AI Engineering Student',
    description: 'AI Engineering graduate student building ML systems with PyTorch, TensorFlow & LangChain. Specializing in Computer Vision, NLP & Geospatial AI. View portfolio of ML projects.',
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
      caption: 'Tayyab Manan - AI Engineering Student & ML Developer'
    },
    sameAs: [
      'https://www.linkedin.com/in/muhammad-tayyab-3962a2373',
      'https://github.com/TayyabManan',
      'https://twitter.com/tayyabmanan'
    ],
    jobTitle: 'AI Engineering Graduate Student',
    seeks: {
      '@type': 'JobPosting',
      title: 'Machine Learning Internship',
      datePosted: '2025-01-01',
      validThrough: '2026-08-31',
      description: 'Seeking Summer 2026 Machine Learning internship position to apply skills in Computer Vision, Natural Language Processing, and Deep Learning. Interested in opportunities to work with production ML systems, model deployment, MLOps, and cutting-edge AI technologies. Experienced with PyTorch, TensorFlow, LangChain, and building end-to-end ML solutions. Open to roles in ML Engineering, Computer Vision, NLP, or Geospatial AI.',
      jobStartDate: '2026-05',
      employmentType: 'INTERN',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Seeking Opportunities',
        url: 'https://tayyabmanan.com'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Remote or Islamabad',
          addressRegion: 'Islamabad Capital Territory',
          addressCountry: 'Pakistan'
        }
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitText: 'HOUR'
        }
      },
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'Worldwide (Remote Work Available)'
      },
      jobLocationType: 'TELECOMMUTE'
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
    description: 'AI Engineering graduate student specializing in Computer Vision, Natural Language Processing, and Geospatial AI. Building production machine learning systems with PyTorch, TensorFlow, and LangChain. Experienced in developing ML models for computer vision tasks, NLP applications, time-series forecasting, and geospatial analysis. Proficient in Python, deep learning frameworks, MLOps, model deployment, and AI system architecture. Portfolio showcases projects in groundwater prediction, satellite imagery analysis, multi-agent systems, and intelligent applications.',
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
    name: 'Tayyab Manan | AI Engineering Student & ML Developer',
    alternateName: 'Tayyab Manan Portfolio',
    description: 'AI Engineering graduate student portfolio showcasing machine learning projects, computer vision applications, NLP systems, deep learning implementations, and geospatial AI solutions built with PyTorch, TensorFlow, and LangChain.',
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
    name: 'Tayyab Manan | AI Engineering Student & ML Developer',
    description: 'Professional portfolio and profile of Tayyab Manan, AI Engineering graduate student specializing in Machine Learning, Computer Vision, and Natural Language Processing.',
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
    '@type': 'ItemList',
    '@id': 'https://tayyabmanan.com/#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tayyabmanan.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://tayyabmanan.com/about'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Projects',
        item: 'https://tayyabmanan.com/projects'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Resume',
        item: 'https://tayyabmanan.com/resume'
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: 'https://tayyabmanan.com/contact'
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': 'https://tayyabmanan.com/#education',
    name: 'AI Engineering Graduate Student',
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
                  const savedTheme = localStorage.getItem('theme') || 'system';
                  const themes = ${JSON.stringify({
                    light: themes.light,
                    dark: themes.dark
                  })};

                  const getActualTheme = (themeMode) => {
                    if (themeMode === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeMode;
                  };

                  const actualTheme = getActualTheme(savedTheme);
                  const selectedTheme = themes[actualTheme] || themes.light;
                  const root = document.documentElement;

                  Object.entries(selectedTheme).forEach(([key, value]) => {
                    const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    root.style.setProperty(cssVarName, value);
                  });

                  root.setAttribute('data-theme', actualTheme);
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
      <body className={bricolageGrotesque.className} suppressHydrationWarning>
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