---
title: "lapar.la - Viral Recipe Platform for Malaysia"
description: "A bilingual, mobile-first recipe platform that ingests creator content from Instagram, converts it into structured recipes, and serves it through a fast PWA experience."
date: "2026-03-04"
draft: false
role: "Full-Stack Developer"
projectURL: "https://lapar.la"
projectOwner: "Dotkod Solutions" 
featuredImage: "lapar-la.png"
screenshots: ["lapar-la-1.png"]
techStack:
  - "Next.js 16 (App Router)"
  - "React 19"
  - "TypeScript"
  - "Tailwind CSS v4"
  - "Framer Motion"
  - "Drizzle ORM + Drizzle Kit"
  - "PostgreSQL (pg)"
  - "Instagram URL Direct"
  - "OpenAI API (Whisper + gpt-4o-mini, optional)"
  - "PWA (Web App Manifest + Service Worker)"
  - "VPS Deployment (Nginx reverse proxy + Node.js runtime + PostgreSQL)"
problem: "Recipe discovery from Malaysian creators is fragmented across social platforms, with unstructured captions/videos, inconsistent metadata, and no central bilingual experience for users who want quick, practical cooking decisions."
solution: "Built lapar.la as a production-ready Next.js platform with a PostgreSQL-backed recipe domain model, an ingestion/admin workflow that transforms Instagram posts into structured recipe records, and a high-performance bilingual UI focused on mobile usability and repeat engagement."
results:
  - "Delivered an end-to-end ingestion-to-publish workflow (manual URL and scheduled creator-handle ingestion) with dedupe, retries, and dead-letter logging."
  - "Shipped a usable production app with recipe discovery, detail interactions (try/report), creator curation, and weekly meal-planning features."
---

## Overview

lapar.la is a Malaysian food platform focused on viral creator recipes, designed for users deciding what to cook quickly ("lapar" moments). The app combines a polished, animated frontend with a structured backend ingestion pipeline so social media content can be normalized into searchable, bilingual recipe data.  
The system currently emphasizes recipe browsing, quality feedback loops, and admin-assisted content operations, while keeping the original "Makan Out vs Masak In" product vision and navigation structure.

## Features

### User-facing product

- Bilingual language system (`en`/`ms`) with browser-locale detection, localStorage persistence, and localized UI copy.
- Fast recipe discovery homepage with search, creator filters, local-pick filters (sahur, berbuka, budget, quick), and infinite scroll.
- Rich recipe detail pages with ingredient checklists (auto-saved), step tracking, nutrition/cost heuristics, shopping list copy, and creator/source deep links.
- Community feedback loop: "tried it" scoring (thumbs up/down) plus issue reporting with rate limiting and admin status handling.
- 7-day meal planner mode (Puasa/Normal) with local persistence and generated shopping list output.
- PWA behavior: web manifest, service worker caching strategy, install prompt, and push notification hooks.

### Admin and content operations

- Password-gated admin dashboard with secure session cookie handling.
- Manual ingestion modes: single Instagram URL, multi-URL batch, and creator-handle ingestion.
- Scheduled ingestion via cron-compatible Node script targeting `/api/ingest`.
- Creator management tools (avatar curation/upload), recipe CRUD/editing, and report moderation workflow.
- Backfill and localization endpoints for operational data hygiene.

### Data and ingestion architecture

- Relational schema in PostgreSQL for recipes, creators, tags, ingestion sources, user try signals, and issue reports.
- Drizzle ORM repository layer and migrations via Drizzle Kit.
- Ingestion pipeline steps:
  1. Discover/fetch Instagram content (URL or handle timeline)
  2. Optionally transcribe media audio (OpenAI Whisper, with ffmpeg fallback/chunking)
  3. Parse structured recipe fields (OpenAI chat parsing with deterministic fallback parser)
  4. Persist with dedupe protection (unique source URL/hash/platform post IDs)
  5. Store failures into `.ingest-failures` dead-letter JSON for traceability

## Tech Stack

### Frontend

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 design system with custom Malaysian color palette tokens
- Framer Motion for transitions, micro-interactions, and animated UI states
- Lucide icons and optimized Next image rendering patterns

### Backend and data

- Next.js Route Handlers for API endpoints and admin backend surface
- PostgreSQL as primary datastore
- Drizzle ORM + Drizzle Kit for schema, queries, and migration lifecycle
- `pg` Node driver for Postgres connectivity

### Ingestion and AI workflow

- `instagram-url-direct` provider plus Instagram web/oEmbed fallback logic
- Optional OpenAI integrations:
  - Whisper transcription for video/audio ingestion
  - `gpt-4o-mini` structured extraction for recipe parsing and visual hinting
- ffmpeg-assisted compression/chunking for large media transcription reliability

### Platform and deployment

- Deployed on VPS with Node.js runtime
- Nginx as reverse proxy in front of the Next.js application
- PostgreSQL hosted for persistent production data
- Cron-based scheduled ingestion job for creator handle sync
- Google Analytics tag integration for traffic instrumentation

### Quality and developer workflow

- ESLint configuration for code quality checks
- Type-safe domain models and API payloads across UI and backend

## Future Improvements

- Complete the original "Makan Out" geolocation restaurant roulette and social group-vote flow currently stubbed in navigation.
- Add full observability stack (structured logs, alerting, dashboard metrics) for ingestion success rate and API health.
- Introduce queue-based ingestion workers for higher throughput and better retry isolation under larger creator sets.
- Add automated tests (unit + integration + API contract) for parser logic, admin actions, and critical route handlers.
- Expand recommendation quality with personalized signals from try/report data and stronger nutrition estimation models.

