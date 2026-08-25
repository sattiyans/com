---
title: "GSendr - WhatsApp & Email Campaigns. One Reply Desk."
description: "Multi-tenant campaign platform — Official WhatsApp Cloud API, personalised bulk email with per-recipient PDFs, and a shared reply desk. ~10 orgs live; ~10K+ WhatsApp and 10K+ emails daily."
date: "2026-08-25"
draft: false
role: "Full-Stack Developer"
password: ""
client: "GSendr"
projectOwner: "G6 Labs Asia"
projectURL: "https://gsendr.com/"
techStack:
  [
    "Next.js (App Router)",
    "TypeScript",
    "Tailwind CSS",
    "ShadCN UI",
    "Express.js",
    "PostgreSQL",
    "WhatsApp Cloud API",
    "Resend",
    "Chart.js",
    "Zod",
  ]
featuredImage: "gsendr.png"
screenshots: ["gsendr1.png", "gsendr2.png", "gsendr3.png", "gsendr4.png"]
problem: "Organizations needed to run email and WhatsApp campaigns across teams with stronger control over domains, templates, recipient handling, deliverability, and reply handling — but most tools treated channels as bolt-ons and left WhatsApp replies disconnected from the campaign that started them."
solution: "I built a full-stack multi-tenant platform that unifies Official WhatsApp Cloud API campaigns, personalised bulk email (including per-recipient PDF attachments), recipient pipelines, and a shared WhatsApp reply desk in one operational system. Teams send on email, WhatsApp, or both from the same audience, prove delivery, and answer replies with campaign context — now ~10 organizations with daily volume on the order of 10K+ WhatsApp and 10K+ emails."
metrics: ["~10 orgs live", "10K+ WhatsApp / day", "10K+ emails / day"]
results:
  - "Running Official WhatsApp Cloud API + email campaigns across ~10 organizations in production."
  - "Sustained daily volume on the order of 10K+ WhatsApp messages and 10K+ emails across the platform."
  - "Unified WhatsApp + email on one audience with Meta-approved templates, shared reply desk, and campaign-linked conversations."
  - "Personalised bulk email with per-recipient HTML-to-PDF attachments, verified-domain sending, and open/click analytics."
  - "Multi-tenant campaign ops with recipient validation, delivery reporting, and no artificial daily send-cap bottlenecks."
---

## Overview

GSendr is a multi-tenant campaign platform built at [G6 Labs Asia](https://www.g6labs.asia) for organizations that need **Official WhatsApp Cloud API** and **personalised bulk email** in one place — not as bolt-ons.

An org uploads an audience once, sends on WhatsApp, email, or both, proves delivery, and catches WhatsApp replies in a **shared reply desk** with the originating campaign already attached. Today roughly **10 organizations** run on the platform, collectively sending on the order of **10K+ WhatsApp messages** and **10K+ emails** on a busy day.

I owned the full stack: **Next.js (App Router) + TypeScript** on the front, **Express.js + PostgreSQL** on the API, Meta’s **WhatsApp Cloud API** for template campaigns, **Resend** for verified-domain email, Chart.js for engagement views, and Zod across validation boundaries.

## The problem

Most “omnichannel” tools treat WhatsApp as an afterthought:

- Email and WhatsApp audiences diverge — ops ends up maintaining two lists.
- Replies land in a generic inbox with no link back to the campaign that started the thread.
- Bulk email personalisation stops at merge tags; finance and ops still need **per-recipient PDFs** (statements, invoices, policies).
- Multi-org SaaS needs hard tenancy: templates, domains, numbers, and analytics scoped per organization.

GSendr treats both channels as first-class, and treats **conversation** as part of the campaign lifecycle.

## What I built

### Official WhatsApp Cloud API

We didn’t start here. Early GSendr sent via **Evolution API** (unofficial). Even with working-hour windows, daily caps, and send delays, numbers were getting banned fast — a non-starter for multi-org customers. We migrated to Meta’s **Official Cloud API** with approved templates: template governance per org, bulk pipelines with retries and failure states, and delivery / read / failed signals in campaign reporting. Reliable, attributable outbound — not a grey-route blast.

### One audience, two channels

The same recipient pipeline feeds WhatsApp and email. Import, validation, and targeting sit in one place; channel choice is a send decision, not a data-model fork. Teams don’t maintain parallel lists just because the channel changed.

### Personalised bulk email + PDFs

For campaigns that need attachments, GSendr generates **HTML → PDF per recipient** matched to spreadsheet rows, then sends via verified-domain flows (SPF/DKIM/DMARC-aware). Opens, clicks, and bounces land back on the campaign so ops can see what actually happened.

### Shared reply desk

WhatsApp replies open Meta’s 24-hour customer-service window. The desk keeps conversations tied to the campaign that started them, so agents aren’t guessing which blast a customer is responding to. Free-form replies stay inside that window; campaign context stays intact.

### Multi-tenant by default

Organizations, teams, domains, templates, and analytics are scoped. That matters once you’re not one company with one number — you’re a platform running concurrent campaigns for different orgs without leaking audiences or credentials.

## Features

- **Official WhatsApp Cloud API** — Meta-approved templates, bulk WhatsApp campaigns, delivery/read tracking, multi-org sending
- **Shared WhatsApp reply desk** — campaign-linked conversations with free-form replies inside the 24-hour window
- **Personalised bulk email** — HTML-to-PDF per recipient matched to spreadsheet rows in one campaign
- Multi-tenant organization model with scoped resources and teams
- Campaign lifecycle from draft to schedule/send with status controls
- Domain verification, sender identity, and deliverability governance
- Recipient import, validation, and engagement analytics (delivered, opened, clicked, bounced, WhatsApp read/failed)

## Results

In production across ~**10 organizations**:

- Sustained daily volume on the order of **10K+ WhatsApp** and **10K+ emails**
- Unified WhatsApp + email on one audience with campaign-linked reply handling
- Personalised attachments and verified-domain sending with engagement analytics
- Multi-tenant ops without artificial daily send-cap bottlenecks

## Roadmap

- **Live** — Email campaigns with verified-domain sending, personalised attachments, and engagement analytics
- **Live** — Official WhatsApp Cloud API campaigns, templates, and shared reply desk at current multi-org volume
- **In development** — AI Reply that drafts on-brand WhatsApp responses from campaign + conversation context
- **Planned** — Voice Blast, SMS, deeper audience segmentation and lifecycle automation, expanded deliverability diagnostics, stronger org-level policy/compliance controls

## Related

- [How we built GSendr](/blog/shipping-whatsapp-cloud-api-at-scale) — architecture, audiences, PDFs, reply desk, tenancy  
- [Why we left Evolution API](/blog/why-we-left-evolution-api-for-official-whatsapp) — unofficial WhatsApp, bans, and the move to Official Cloud API
