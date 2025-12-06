import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Enable React strict mode for better error handling
  reactStrictMode: true,
  
  // Image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tayyabmanan.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tayyabmanan.com',
      },
      {
        protocol: 'https',
        hostname: 'tayyabmanan.vercel.app',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress output for better performance
  compress: true,
  
  // Security: Limit request body size
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', // Limit server action body size
    },
  },
  
  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            // Note: 'unsafe-inline' is needed for inline styles and Next.js hydration
            // 'unsafe-eval' is conditionally added in development for React Fast Refresh
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com data:;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://ntfy.sh https://api.openai.com;
              media-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              frame-src 'none';
              worker-src 'self' blob:;
              manifest-src 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://tayyabmanan.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
    ]
  },
  
  // Redirects for better SEO (if needed)
  async redirects() {
    return []
  },
};

export default nextConfig;
