---
slug: "building-teacherrank"
title: "Building TeacherRank: A Student-Driven Teacher Review Platform"
description: "Technical deep-dive into building a comprehensive teacher rating platform using React, TypeScript, and Supabase. Implementation details for full-stack development, real-time databases, and performance optimization."
date: "2025-06-15"
author: "Tayyab Manan"
category: "Web Development"
tags: ["React", "TypeScript", "Supabase", "Full-Stack", "Web Development", "Technical"]
image: "/projects/teacher-rank.png"
readTime: "10 min read"
---

# TeacherRank: A Student-Driven Teacher Review Platform

Course registration presents a common challenge for students: making informed decisions about professors with limited information. Existing platforms typically reduce educators to a single rating, which doesn't adequately capture the nuances of teaching quality, communication style, or course difficulty.

I built **TeacherRank** to address this gap by implementing a multi-dimensional rating system that provides students with structured, actionable feedback about educators.

## The Problem and Opportunity

Students often choose professors based on incomplete or outdated information. A single numerical rating fails to capture important distinctions whether a professor is challenging but effective, responsive to student questions, or maintains fair grading policies.

This presented both a practical problem worth solving and an excellent learning opportunity. As an AI Engineering student, I wanted hands-on experience building a production web application with modern tools and best practices.

## Technical Architecture and Stack Selection

I selected a tech stack that balances modern industry practices with learning opportunities, prioritizing tools commonly used in production environments:

**React 18 + TypeScript** provides the foundation with type safety that catches errors at compile time rather than runtime. TypeScript's static typing prevented numerous bugs throughout development, particularly when refactoring component interfaces.

**Vite** handles the build tooling with significantly faster performance than Create React App. Hot module replacement updates appear nearly instantly in the browser. Build times dropped from 45 seconds to under 3 seconds, substantially improving development velocity during iteration cycles.

**Supabase** manages the entire backend infrastructure, including JWT authentication with refresh token rotation, real-time database subscriptions, and row-level security policies enforced at the PostgreSQL level. This Backend-as-a-Service approach allowed me to focus on application logic rather than server configuration.

**TanStack Query** handles server state management with intelligent caching using stale-while-revalidate patterns. This makes the application feel responsive even on slower connections, with cache invalidations propagating through the UI automatically.

**React Router** handles navigation with protected routes that redirect unauthenticated users. Combined with React Hook Form and Zod schemas for validation, this provides a complete authentication flow with type-safe form handling.

**Tailwind CSS with DaisyUI** accelerates development through utility-first styling. DaisyUI provides pre-built components like cards and modals that can be customized while maintaining consistent design patterns without CSS specificity conflicts.

## Core Features Implementation

The rating system uses a four-dimensional evaluation model instead of a single numerical score:

**Teaching Quality** - Measures clarity of concept explanation and effectiveness of teaching methods.

**Communication** - Evaluates email responsiveness, assignment instruction clarity, and accessibility during office hours.

**Helpfulness** - Assesses willingness to support student success and provide constructive feedback.

**Course Difficulty** - Provides informational context about course challenge level without value judgment.

This multi-dimensional approach provides more actionable information. For example, a professor rated 4.8/5 for teaching quality but 4.5/5 for difficulty indicates a challenging course led by an effective educator context that a single rating cannot convey.

The search and filtering system leverages TanStack Query's caching capabilities for immediate responsiveness. As users type a professor's name, results update in real-time without page reloads. The caching strategy ensures that adding filters to an existing search (e.g., searching "Professor Ahmad" then filtering by "Data Structures") uses cached data for instant updates.

The advanced search panel supports combinations of filters: teacher name, subject, institution, and minimum rating thresholds for specific dimensions.

## Performance Optimization Challenges

### Addressing Performance Bottlenecks

Performance testing with a production-scale database revealed several bottlenecks. The initial page load measured 4.2 seconds, the teacher list exhibited frame drops during scrolling, and search responsiveness was suboptimal.

**Code splitting** through route-based lazy loading using React's `lazy()` and `Suspense` provided significant improvements. Rather than bundling all code into a single JavaScript file, each route loads as a separate chunk:

```typescript
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
```

This reduced the initial bundle size by exactly 60%. Users downloading the homepage now get 180KB instead of 450KB. First Contentful Paint dropped from 2.1s to 0.8s.

**Virtual scrolling** solved another critical bottleneck. The teachers list page was rendering all teacher cards to the DOM at once. On mobile devices, this caused noticeable frame drops. Using `@tanstack/react-virtual`, I implemented windowing that renders only the visible items plus a small buffer:

```typescript
const rowVirtualizer = useVirtualizer({
  count: teachers.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120,
  overscan: 5
})
```

The browser now renders approximately 15 teacher cards at a time regardless of total count, maintaining smooth scrolling performance even on older Android devices.

**Image optimization** implements lazy loading for teacher profile images with WebP format support and responsive sizing. Images load only when approaching the viewport, with the browser selecting between WebP (30% smaller) or JPEG based on support.

**Brotli compression** on Vercel deployment reduced asset sizes by 80%. A 300KB JavaScript bundle compresses to 60KB over the wire. Combined with Vite's code splitting, this significantly improved load times.

### Real-Time Data Synchronization

The platform requires real-time updates so that when a user submits a review, other users viewing that teacher's profile see the new review immediately.

Supabase provides real-time subscriptions, which integrate with TanStack Query's caching system:

```typescript
// Subscribe to real-time updates
const subscription = supabase
  .from('reviews')
  .on('INSERT', payload => {
    queryClient.invalidateQueries(['teacher', teacherId])
  })
  .subscribe()
```

When a new review is inserted, the relevant query cache is invalidated, triggering a background refetch. TanStack Query then updates the UI automatically without disrupting the user experience.

### Form Validation Implementation

The validation system needed to maintain data quality while remaining user-friendly. React Hook Form combined with Zod schemas provides type-safe, runtime-validated form handling:

```typescript
const reviewSchema = z.object({
  teacherId: z.string().uuid(),
  rating: z.object({
    teaching: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    helpfulness: z.number().min(1).max(5),
    difficulty: z.number().min(1).max(5),
  }),
  comment: z.string().min(50).max(1000),
})
```

The minimum comment length of 50 characters ensures reviews are thoughtful and detailed, not just "good prof" or "terrible." The maximum of 1000 characters keeps feedback focused. Every constraint serves a purpose.

## Key Learnings and Implementation Details

### Database Schema Design

The initial database schema had significant issues: duplicated teacher names in the reviews table, scattered institution data, and missing foreign key constraints. Updating a teacher's name required changes in multiple locations, leading to data inconsistencies that necessitated a complete refactoring.

I redesigned the schema around four core tables:

**Teachers Table** - Stores comprehensive educator profiles with department, contact information, and a reference to their institution. Each teacher has a unique ID (UUID) that other tables reference.

**Reviews Table** - Contains student feedback with the four dimensional ratings (teaching, communication, helpfulness, difficulty), written comments, timestamps, and foreign keys to both the teacher and the user who wrote it.

**Institutions Table** - Educational organizations with hierarchical structure. Teachers belong to institutions, allowing queries like "show me all teachers at COMSATS."

**Users Table** - Secure user profiles with role-based access control. Regular students can write reviews, but admins can moderate content and manage teachers.

I learned to use foreign keys properly with `ON DELETE CASCADE`. When a teacher is removed, PostgreSQL automatically deletes all their reviews. When a user deletes their account, their reviews are removed too. The database maintains referential integrity automatically.

Indexes transformed performance. Adding a GIN index on teacher names for full-text search reduced query times from 400ms to 12ms. Composite indexes on `(institution_id, subject)` made filtered searches instant.

Row-level security policies in Supabase were eye-opening. I wrote policies in SQL that enforce business logic at the database level:

```sql
-- Users can only update their own reviews
CREATE POLICY "Users update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Anyone can read approved reviews
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');
```

Security isn't handled in application code that can be bypassed; it's enforced by PostgreSQL itself.

### User Experience Trumps Technical Complexity

I spent weeks perfecting the real-time synchronization system, but you know what users noticed most? The loading states. Those simple skeleton screens that shimmer while data loads built more trust than any sophisticated caching strategy ever could.

I implemented error boundaries to gracefully handle failures. When something goes wrong, instead of showing a white screen or cryptic error message, users see a friendly "Something went wrong" message with a button to retry or go back. In production, these errors are automatically sent to Sentry for monitoring, but users aren't subjected to stack traces.

The mobile-first design became critical when I checked the analytics. The split wasn't just mobile-heavy; over 60% of TeacherRank sessions happen on phones. Students are checking ratings between classes, on the bus, while walking to the library. The app had to work flawlessly on a 5-inch screen first, then scale up to desktop.

Dark mode wasn't optional; it was expected. DaisyUI's theme system made implementation straightforward, but I still had to ensure proper color contrast ratios for accessibility. The system-aware theme switching means the app respects the user's OS preference by default.

Accessibility shaped every decision. WCAG 2.1 compliance meant keyboard navigation had to work flawlessly. Every interactive element needed visible focus states. Screen readers needed proper ARIA labels and semantic HTML. Color couldn't be the only way to convey information. These constraints didn't limit the design; they made it better for everyone.

### Security Can Never Be an Afterthought

Building an app where users submit potentially sensitive reviews meant security had to be rock solid from day one.

**Authentication** uses Supabase Auth with JWT-based authentication and refresh token rotation. When a user logs in, they receive a short-lived access token (1 hour) and a long-lived refresh token (30 days). The app automatically requests new tokens before expiration, providing seamless security without constant re-authentication.

Email verification is mandatory. Users can't submit reviews until they've confirmed their email address. This simple requirement dramatically reduced spam and fake accounts during testing.

**Input sanitization** protects against XSS attacks. Every user-submitted review goes through validation that strips potentially dangerous HTML while preserving safe formatting. I use DOMPurify for sanitization and Zod for schema validation before data ever reaches the database.

**Rate limiting** prevents abuse. The API throttles requests to prevent spam submissions. A user can't submit more than 5 reviews per hour or 20 per day. This stops bad actors without impacting legitimate users.

**Content Security Policy** headers prevent unauthorized script execution. I configured strict CSP rules that only allow scripts from trusted sources. This protection happens at the HTTP header level, before browsers even execute code.

**HTTPS with HSTS** ensures all connections are encrypted. Vercel handles this automatically, but I configured HSTS headers to tell browsers to always use HTTPS, even if someone types http:// in the address bar.

Protected routes check authentication status before rendering sensitive pages. The admin dashboard and review submission forms are only accessible to authenticated users with proper permissions.

### Performance Optimization Never Ends

Lighthouse scoring became my obsession. The initial score of 65 felt embarrassing, especially for a platform meant to serve students on potentially slow university WiFi.

Through iterative optimization, I pushed it above 95:

- **Service workers** enable offline functionality using Workbox. Once the app loads, core features work even without internet
- **PWA features** let students "install" TeacherRank to their phone's home screen for app-like experience
- **Tree-shaking** with Vite eliminated dead code, reducing bundle sizes
- **Font optimization** using font-display: swap prevented text from being invisible during font loading
- **Vercel Analytics** and **Speed Insights** provide real-time Core Web Vitals monitoring

Every optimization taught me something new about how browsers prioritize resources, how users perceive performance, and how small changes compound into dramatic improvements.

## What TeacherRank Looks Like Today

The platform is now live at [teacherrank.vercel.app](https://teacherrank.vercel.app/), serving students making critical decisions about their education.

The core features working in production:

**Comprehensive teacher profiles** with four-dimensional ratings, aggregated statistics, and chronological review feeds. Each profile shows the average for teaching quality, communication, helpfulness, and difficulty, along with the distribution of ratings across each dimension.

**Advanced search and filtering** that updates in real-time as you type. Students can search by teacher name, filter by institution, narrow by subject area, and set minimum rating thresholds for specific dimensions.

**Secure authentication system** with email verification, password recovery, and protected routes. Only verified students can submit reviews, and users can only edit or delete their own submissions.

**Admin dashboard** for content moderation, teacher profile management, and platform analytics. Admins can approve or remove reviews, manage teacher listings, and handle user reports.

**Institution management** allows browsing teachers organized by educational institutions with hierarchical structure support.

**Real-time synchronization** ensures when someone submits a review, it appears immediately for other users viewing that teacher's profile.

**Mobile-first responsive design** that works flawlessly on phones, tablets, and desktops with full dark mode support.

Most importantly, it's useful. The feedback I've received confirms that students genuinely find value in the nuanced, multi-dimensional ratings compared to single-number systems.

## Planned AI/ML Enhancements

As I continue my AI Engineering studies at, I'm planning several machine learning enhancements that align with the platform's core mission of providing informed decision-making tools for students.

**AI-Powered Sentiment Analysis** - NLP models will automatically analyze review text to detect sentiment and emotion patterns. This enables identification of nuanced insights not captured by numeric ratings alone, such as professors who excel at teaching but maintain strict grading policies.

**ML Recommendation Engine** - Collaborative filtering algorithms will suggest professors based on review history and rating patterns, recommending educators with similar teaching styles to those previously rated highly by the user.

**Anomaly Detection** - ML algorithms will identify suspicious patterns indicating fake or biased reviews, such as clusters of reviews from new accounts posted within short timeframes, unusually extreme language, or rating patterns inconsistent with reviewer history.

**NLP Text Classification** - Automatic categorization of reviews by topic (teaching style, grading fairness, course workload, exam difficulty, communication responsiveness) will enable students to filter reviews by specific aspects.

**Predictive Analytics** - Time-series models will forecast teacher performance trends, identifying educators whose ratings are improving or declining over time. This provides institutions with data for targeted support and gives students forward-looking information for decision-making.

**LLM Integration with RAG** - A natural language interface using Retrieval-Augmented Generation will allow students to ask questions like "Which Data Structures professors have high ratings with manageable workload?" The system will query the database and synthesize responses from actual review data.

These AI enhancements will build on the solid foundation of real-time data synchronization, secure authentication, and performance-optimized architecture that TeacherRank already has.

## Key Takeaways

Building TeacherRank provided hands-on experience with production-grade web development practices:

**Problem-First Development** - Starting with a genuine user need provided clear requirements and motivation throughout the development process.

**Technology Selection** - Choosing widely-adopted, industry-standard tools (React, TypeScript, Supabase, TanStack Query) provided practical experience with technologies commonly used in professional settings.

**User Experience Priority** - Technical sophistication means little if users find the application confusing or slow. Prioritizing UX from the beginning proved more valuable than optimizing technical implementation after the fact.

**Security and Performance** - Building security and performance considerations into the architecture from the start proved more effective than treating them as later additions.

**User Feedback Integration** - Regular feedback from actual users revealed assumptions that differed from real-world usage patterns.

## Project Links

- **Live Platform**: [teacherrank.vercel.app](https://teacherrank.vercel.app/)
- **Source Code**: [GitHub Repository](https://github.com/TayyabManan/TeacherRank)
- **Detailed Documentation**: [Project Page](/projects/teacher-rank)

For questions or discussions about the technical implementation, feel free to [reach out](/contact).
