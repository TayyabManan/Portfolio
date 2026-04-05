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

Course registration has a basic information problem: you're picking professors based on almost nothing. Existing platforms give you a single number, which doesn't tell you whether a professor is tough but effective, responsive to emails, or fair with grading. Those are different things, and they matter differently to different students.

I built **TeacherRank** to fix that with a multi-dimensional rating system that gives students structured, specific feedback about educators.

## The Problem and Opportunity

Students pick professors based on incomplete or outdated information. A single numerical rating can't distinguish between a professor who's challenging but teaches well and one who's just disorganized. That distinction matters a lot when you're committing to a semester.

This was also a learning opportunity for me. As an AI Engineering student, I wanted hands-on experience building a production web application with modern tools. So it was two birds, one project.

## Technical Architecture and Stack Selection

I picked a stack that reflects what's actually used in production, with some bias toward tools I wanted to learn:

**React 18 + TypeScript** is the foundation. TypeScript's static typing caught a lot of bugs during development, especially when I was refactoring component interfaces and changing prop shapes. I'm not going back to plain JavaScript for anything nontrivial.

**Vite** handles build tooling. Hot module replacement is nearly instant, and build times dropped from 45 seconds (Create React App) to under 3 seconds. That difference compounds fast when you're iterating.

**Supabase** runs the entire backend: JWT authentication with refresh token rotation, real-time database subscriptions, and row-level security policies enforced at the PostgreSQL level. Using a Backend-as-a-Service let me focus on application logic instead of configuring servers.

**TanStack Query** manages server state with stale-while-revalidate caching. This makes the app feel responsive on slower connections, and cache invalidations propagate through the UI automatically. It also made the real-time features much easier to implement.

**React Router** handles navigation with protected routes that redirect unauthenticated users. Combined with React Hook Form and Zod schemas for validation, this gives me a complete auth flow with type-safe form handling.

**Tailwind CSS with DaisyUI** speeds up styling. DaisyUI's pre-built components (cards, modals, etc.) can be customized while keeping consistent design patterns, and I never had to fight CSS specificity issues.

## Core Features Implementation

The rating system uses four dimensions instead of a single score:

**Teaching Quality** measures clarity of explanation and effectiveness of teaching methods.

**Communication** covers email responsiveness, assignment instruction clarity, and office hours accessibility.

**Helpfulness** is about willingness to support students and give constructive feedback.

**Course Difficulty** provides context about challenge level without attaching a value judgment.

This gives students much more to work with. A professor rated 4.8/5 for teaching quality but 4.5/5 for difficulty tells you something specific: hard course, good teacher. A single number can't convey that.

Search and filtering use TanStack Query's caching for immediate responsiveness. As users type a professor's name, results update without page reloads. The caching is smart enough that adding filters to an existing search (say, searching "Professor Ahmad" then filtering by "Data Structures") uses cached data and updates instantly.

The advanced search panel supports combinations of filters: teacher name, subject, institution, and minimum rating thresholds for specific dimensions.

## Performance Optimization Challenges

### Addressing Performance Bottlenecks

Performance testing with a production-scale database exposed several problems. Initial page load was 4.2 seconds. The teacher list had frame drops during scrolling. Search felt sluggish.

**Code splitting** through route-based lazy loading made the biggest difference. Instead of bundling everything into one JavaScript file, each route loads as a separate chunk:

```typescript
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
```

This cut the initial bundle from 450KB to 180KB, a 60% reduction. First Contentful Paint dropped from 2.1s to 0.8s.

**Virtual scrolling** fixed the teacher list. The page was rendering every teacher card to the DOM at once. On mobile, this caused visible frame drops. Using `@tanstack/react-virtual`, I implemented windowing that renders only the visible items plus a small buffer:

```typescript
const rowVirtualizer = useVirtualizer({
  count: teachers.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120,
  overscan: 5
})
```

The browser now renders about 15 teacher cards at a time regardless of total count. Scrolling stays smooth even on older Android phones.

**Image optimization** uses lazy loading for profile images with WebP support and responsive sizing. Images load only when approaching the viewport, with the browser picking between WebP (30% smaller) or JPEG based on support.

**Brotli compression** on Vercel reduced asset sizes by 80%. A 300KB JavaScript bundle compresses to 60KB over the wire.

### Real-Time Data Synchronization

When a user submits a review, other users viewing that teacher's profile should see it immediately. Supabase's real-time subscriptions integrate with TanStack Query's cache:

```typescript
// Subscribe to real-time updates
const subscription = supabase
  .from('reviews')
  .on('INSERT', payload => {
    queryClient.invalidateQueries(['teacher', teacherId])
  })
  .subscribe()
```

When a new review is inserted, the relevant query cache is invalidated, triggering a background refetch. TanStack Query updates the UI automatically without disrupting anything the user is doing.

### Form Validation Implementation

Validation needed to keep data quality high without being annoying. React Hook Form combined with Zod schemas handles this:

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

The minimum comment length of 50 characters is there to prevent "good prof" drive-by reviews. The maximum of 1000 keeps feedback focused. Every constraint exists for a reason.

## Key Learnings and Implementation Details

### Database Schema Design

My first database schema was a mess. Teacher names were duplicated in the reviews table, institution data was scattered around, and foreign key constraints were missing. Updating a teacher's name meant changing it in multiple places, which led to inconsistencies. I had to refactor the whole thing.

The redesigned schema has four core tables:

**Teachers Table** stores educator profiles with department, contact info, and a reference to their institution. Each teacher gets a UUID that other tables reference.

**Reviews Table** holds student feedback with the four dimensional ratings (teaching, communication, helpfulness, difficulty), written comments, timestamps, and foreign keys to both the teacher and the reviewing user.

**Institutions Table** contains educational organizations with hierarchical structure, so I can run queries like "show me all teachers at COMSATS."

**Users Table** handles secure profiles with role-based access. Regular students can write reviews; admins can moderate content and manage teachers.

Learning to use foreign keys properly with `ON DELETE CASCADE` was one of those "why wasn't I doing this before" moments. When a teacher is removed, PostgreSQL automatically deletes all their reviews. When a user deletes their account, their reviews go too. The database maintains referential integrity on its own.

Indexes made a huge difference. Adding a GIN index on teacher names for full-text search dropped query times from 400ms to 12ms. Composite indexes on `(institution_id, subject)` made filtered searches instant.

Row-level security policies in Supabase were new to me. I wrote policies in SQL that enforce business logic at the database level:

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

Security isn't in application code that can be bypassed. It's enforced by PostgreSQL itself. This was eye-opening.

### User Experience Over Technical Complexity

I spent weeks on the real-time synchronization system. You know what users actually noticed? The loading states. Those simple skeleton screens that shimmer while data loads built more trust than any caching strategy. I should have started there.

Error boundaries handle failures gracefully. When something breaks, users see a friendly "Something went wrong" message with a retry button instead of a white screen or a stack trace. Errors still go to Sentry for monitoring, but users don't need to see that.

Mobile-first design became non-negotiable once I checked the analytics. Over 60% of TeacherRank sessions happen on phones. Students check ratings between classes, on the bus, walking to the library. The app had to work on a 5-inch screen first and scale up from there.

Dark mode wasn't a nice-to-have; students expected it. DaisyUI's theme system made implementation straightforward, but I still had to check color contrast ratios for accessibility. The app respects the user's OS theme preference by default.

Accessibility shaped every decision. WCAG 2.1 compliance means keyboard navigation works throughout, every interactive element has visible focus states, screen readers get proper ARIA labels and semantic HTML, and color is never the only way to convey information. These constraints made the design better for everyone, not just users with accessibility needs.

### Security From Day One

Building an app where users submit reviews about real people meant security couldn't be bolted on later.

**Authentication** uses Supabase Auth with JWT tokens and refresh token rotation. Users get a short-lived access token (1 hour) and a long-lived refresh token (30 days). The app requests new tokens before expiration automatically, so users stay logged in without compromising security.

Email verification is mandatory. Users can't submit reviews until they confirm their email. This one requirement cut spam and fake accounts significantly during testing.

**Input sanitization** protects against XSS. Every review goes through DOMPurify for sanitization and Zod for schema validation before it reaches the database.

**Rate limiting** prevents abuse. Users can't submit more than 5 reviews per hour or 20 per day. Enough for legitimate use, tight enough to stop bad actors.

**Content Security Policy** headers prevent unauthorized script execution. I configured strict CSP rules that only allow scripts from trusted sources.

**HTTPS with HSTS** ensures encrypted connections. Vercel handles this automatically, but I added HSTS headers so browsers always use HTTPS even if someone types http:// manually.

Protected routes check authentication before rendering sensitive pages. The admin dashboard and review submission forms require proper permissions.

### Performance Optimization Never Stops

My initial Lighthouse score was 65, which felt embarrassing for a platform meant to serve students on potentially slow university WiFi.

Through iterative optimization, I pushed it above 95. Service workers (via Workbox) enable offline functionality so core features work without internet. PWA features let students "install" TeacherRank to their home screen. Tree-shaking with Vite eliminated dead code. Font optimization using `font-display: swap` prevents invisible text during loading. Vercel Analytics and Speed Insights provide real-time Core Web Vitals monitoring.

Each of these optimizations taught me something about how browsers prioritize resources and how users perceive speed.

## What TeacherRank Looks Like Today

The platform is live at [teacherrank.vercel.app](https://teacherrank.vercel.app/), and students are using it.

In production, the core features include: teacher profiles with four-dimensional ratings, aggregated statistics, and chronological review feeds. Advanced search and filtering updates as you type, with options to narrow by institution, subject, or minimum rating thresholds. Authentication is handled with email verification, password recovery, and protected routes. Only verified students can submit reviews, and you can only edit or delete your own.

There's an admin dashboard for content moderation, teacher profile management, and platform analytics. Institution management lets you browse teachers organized by school. Real-time sync means new reviews appear immediately for everyone. And the mobile-first responsive design with dark mode works across phones, tablets, and desktops.

The feedback I've gotten confirms the multi-dimensional ratings are more useful than a single number. Students actually say they use the distinction between teaching quality and difficulty when deciding on courses, which was the whole point.

## Planned AI/ML Enhancements

As I continue my AI Engineering studies, I'm planning several ML features for the platform.

**Sentiment analysis** on review text would detect patterns that numeric ratings miss, like professors who get praised for teaching but criticized for grading. **Collaborative filtering** could recommend professors based on what similar students rated highly. **Anomaly detection** would flag suspicious review clusters (new accounts, short timeframes, extreme language) that suggest fake or coordinated reviews.

I'm also interested in **automatic topic classification** so students can filter reviews by specific aspects like teaching style, grading fairness, or workload. **Time-series models** could track whether a professor's ratings are trending up or down. And eventually, **RAG-based natural language queries** would let students ask things like "Which Data Structures professors have high ratings with manageable workload?" and get answers synthesized from actual review data.

These would all build on the existing real-time data sync, auth system, and performance-optimized architecture.

## Key Takeaways

**Start with the user problem.** Having a real need to solve gave me clear requirements and kept me motivated when the database schema fell apart for the second time.

**Use boring, well-adopted tools.** React, TypeScript, Supabase, TanStack Query are widely used in industry for good reasons. I learned patterns I can take directly to a job, not framework-specific tricks.

**Users care about how it feels, not how it works.** I spent weeks on real-time sync; they noticed loading states. Technical sophistication that doesn't show up in the user experience doesn't count for much.

**Build security in from the start.** Retrofitting security is painful and leaves gaps. Row-level security in Supabase taught me that the best security is enforced at the data layer, not in application code.

**Talk to actual users.** Regular feedback revealed assumptions that didn't match real-world usage. More than half my users are on phones, and I almost designed desktop-first.

## Project Links

- **Live Platform**: [teacherrank.vercel.app](https://teacherrank.vercel.app/)
- **Source Code**: [GitHub Repository](https://github.com/TayyabManan/TeacherRank)
- **Detailed Documentation**: [Project Page](/projects/teacher-rank)

For questions about the implementation, feel free to [reach out](/contact).