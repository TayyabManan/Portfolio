---
slug: "teacher-rank"
title: "TeacherRank"
subtitle: "Student-Driven Teacher Review Platform"
description: "A teacher rating and review platform that lets students share structured feedback about educators across multiple dimensions, helping others make more informed decisions during course registration. Built with React, TypeScript, and Supabase."
category: "Web Application"
techStack: ["React", "TypeScript", "Supabase", "TanStack Query", "React Router", "Tailwind CSS", "DaisyUI", "Vite", "React Hook Form", "Zod"]
image: "/projects/teacher-rank.png"
demoUrl: "https://teacherrank.vercel.app/"
githubUrl: "https://github.com/TayyabManan/TeacherRank"
featured: true
date: "2025-01-06"
---

# TeacherRank

## Overview
TeacherRank is a web app that lets students rate and review their teachers across multiple dimensions instead of reducing them to a single number. The platform supports ratings for teaching quality, communication, helpfulness, and course difficulty, with real-time data sync and a responsive interface. The goal is to help students make better decisions during course registration while giving institutions useful feedback.

**[Read the full technical deep-dive →](/blog/building-teacherrank)**

## Key Features
- **Multi-Dimensional Ratings**: Separate scores for teaching quality, communication, helpfulness, and course difficulty
- **Search & Filtering**: Find teachers by name, subject, institution, or rating with real-time results
- **User Authentication**: Login with email verification and password recovery via Supabase
- **Teacher Profiles**: Detailed pages with ratings breakdown, student reviews, and teaching statistics
- **Institution Management**: Browse teachers organized by educational institution
- **Admin Dashboard**: Admin panel for managing teachers, reviews, and user reports
- **Real-time Updates**: Live data sync using Supabase subscriptions with TanStack Query cache invalidation
- **Mobile-First Design**: Responsive interface that works on phones first, desktops second

## Technical Architecture
Built with React 18 and TypeScript, using Vite for fast builds and hot module replacement. Supabase handles the backend: authentication, real-time database, and row-level security at the PostgreSQL level. TanStack Query manages server state with stale-while-revalidate caching. The UI uses Tailwind CSS and DaisyUI components.

## Performance Optimizations

| Optimization | Impact |
|-------------|--------|
| Code Splitting | Route-based lazy loading cuts initial bundle size by 60% |
| Virtual Scrolling | Renders only visible teacher cards using @tanstack/react-virtual |
| Image Optimization | Lazy loading with WebP support and responsive sizing |
| Caching Strategy | Stale-while-revalidate pattern via TanStack Query |
| Bundle Compression | Brotli compression reducing asset sizes by up to 80% |
| PWA Features | Service worker for offline functionality |

## User Experience

| Feature | Description |
|---------|-------------|
| Protected Routes | Auth-gated access for review submission and admin features |
| Form Validation | React Hook Form with Zod schemas for type-safe validation |
| Error Boundaries | Friendly error states with retry options instead of white screens |
| SEO | Dynamic meta tags with React Helmet |
| Accessibility | WCAG 2.1 compliant with keyboard navigation and screen reader support |
| Dark Mode | Respects OS theme preference by default |

## Database Design

| Table | Purpose |
|-------|---------|
| Teachers | Educator profiles with department and contact info |
| Reviews | Student feedback with four-dimensional ratings and timestamps |
| Institutions | Educational organizations with hierarchical structure |
| Users | Profiles with role-based access (student vs admin) |
| Row-Level Security | PostgreSQL policies enforcing permissions at the data layer |

## Security

| Feature | Description |
|---------|-------------|
| Authentication | JWT tokens with refresh token rotation (1hr access, 30-day refresh) |
| Input Sanitization | DOMPurify for XSS protection, Zod for schema validation |
| Rate Limiting | Max 5 reviews/hour, 20/day per user |
| HTTPS + HSTS | Enforced encrypted connections |
| Content Security Policy | Strict CSP headers for script execution control |

## Monitoring

| Tool | Purpose |
|------|---------|
| Vercel Analytics | Traffic and performance metrics |
| Speed Insights | Core Web Vitals monitoring |
| Sentry | Error tracking and performance monitoring in production |

## Future Enhancements
Planned additions include sentiment analysis on review text to surface patterns that numeric ratings miss, collaborative filtering to recommend professors based on similar students' preferences, and anomaly detection to flag suspicious review clusters. I'd also like to add automatic topic classification (teaching style, grading, workload) so students can filter reviews by what they care about, and eventually a natural language query interface using RAG so students can ask questions like "Which Data Structures professors have high ratings with manageable workload?"