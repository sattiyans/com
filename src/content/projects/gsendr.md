---
title: "GSendr - Enterprise Email Infrastructure. Built for Control & Deliverability."
description: "The email campaign platform for organizations and teams requiring reliable delivery, integrated validation, and structured communication at scale."
date: "2026-02-25"
draft: true
role: "Full-Stack Developer"
password: ""
client: "GSendr"
projectOwner: "Trisquare Technology"
projectURL: "https://gsendr.com/"
techStack:
  [
    "Next.js (App Router)",
    "TypeScript",
    "Tailwind CSS",
    "ShadCN UI",
    "Express.js",
    "PostgreSQL",
    "Resend",
    "Chart.js",
    "Zod",
  ]
featuredImage: "gsendr.png"
screenshots: ["gsendr1.png", "gsendr2.png", "gsendr3.png", "gsendr4.png"]
---

## Overview

GSendr is a production-oriented email campaign system built as a monorepo with a modern frontend and a modular backend API. The main goal was to provide teams with a centralized platform to manage domains, templates, recipients, and campaign execution while keeping analytics and operational visibility in one place.

The product evolved from a UI-first prototype into a multi-tenant system where organizations can manage shared resources and control feature flags such as IWK integration and email validation.

## Features

- Multi-tenant organization architecture with team member management.
- Campaign lifecycle management from draft to configured, scheduled, sending, and sent.
- CSV and PDF-based recipient import with recipient review and variable mapping.
- Rich template management with categories, dynamic variables, attachments, and preview.
- Domain setup and verification flow, including Resend domain integration.
- Configurable sending via verified domains and domain-level from-address management.
- Open and click tracking with pixel and redirect endpoints.
- Analytics dashboard with campaign, template, domain, and activity-level insights.
- Notification center and support ticket system for operational workflows.
- Testing mode using temporary inbox generation and message retrieval.
- IWK Excel processing module with upload, progress tracking, status refresh, and record inspection.
- Email validation workflow with cache and organization-level controls.
- Admin surface for organization/user operations and platform-level metrics.

## Tech Stack

- Frontend: Next.js App Router + TypeScript for a scalable route-based UI architecture.
- UI System: Tailwind + ShadCN for fast, consistent, and accessible interface development.
- Backend: Express + TypeScript for explicit API composition and service-layer separation.
- Database: PostgreSQL with raw SQL (`pg`) to keep query behavior transparent and controllable.
- Validation: Zod for schema-safe request parsing and predictable API errors.
- Email Delivery: Resend for outbound email, webhook ingestion, and analytics enrichment.
- Visualization: Chart.js for engagement and performance charting across multiple dashboard surfaces.

These choices favored maintainability, strong typing across boundaries, and rapid iteration without hiding domain logic behind heavy abstraction layers.

## Challenges & Solutions

1. Multi-tenant data isolation
- Challenge: ensuring all resource access is correctly scoped by organization.
- Solution: updated services and queries to enforce organization-aware filtering and ownership checks.

2. Campaign orchestration complexity
- Challenge: campaign states, imports, scheduling, retries, and send progress needed consistent behavior.
- Solution: formalized status transitions, centralized send logic in services, and added polling-aware UI states.

3. Domain and sender reliability
- Challenge: preventing sends from unverified or misconfigured domains.
- Solution: enforced verification checks before send and introduced managed per-domain sender emails.

4. Deliverability and engagement insights
- Challenge: collecting actionable metrics beyond basic send counts.
- Solution: combined tracking pixel/click events with webhook-driven status updates and aggregated analytics endpoints.

5. Operational tooling for edge workflows
- Challenge: advanced workflows (testing inboxes, IWK imports, admin operations) can bloat core modules.
- Solution: implemented dedicated pages and service modules for specialized workflows while keeping shared primitives reusable.

## Key Learnings

- A clear services-first backend structure makes feature growth manageable in a fast-moving product.
- UI-first development is effective when paired with a robust API contract and realistic state modeling.
- Multi-tenant boundaries should be designed early, not retrofitted late.
- Operational features (admin, support, testing, migration safety) are as important as customer-facing screens.
- Real-world email systems require deep attention to deliverability, verification, and observability.

## Conclusion

GSendr demonstrates a full-stack, production-style implementation of an email campaign platform with strong modularity across frontend, backend, and database layers. Beyond basic campaign sending, the platform includes operational and governance capabilities that support scaling across teams and organizations.

Future improvements include advanced audience management (contacts/lists), stronger admin-side authorization hardening, and deeper automation around campaign optimization and engagement workflows.

