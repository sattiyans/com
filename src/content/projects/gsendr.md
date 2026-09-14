---
title: "GSendr - WhatsApp & Email Campaigns. One Reply Desk."
description: "Multi-tenant campaign platform — Official WhatsApp Cloud API, personalised bulk email with per-recipient PDFs, and a shared Inbox that carries campaign context. ~10 orgs live; ~10K+ WhatsApp and 10K+ emails daily."
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
    "Chart.js",
    "Zod",
  ]
featuredImage: "gsendr.png"
screenshots: ["gsendr1.png", "gsendr2.png", "gsendr3.png", "gsendr4.png"]
problem: "Organizations needed to run email and WhatsApp campaigns across teams with stronger control over domains, templates, recipient handling, deliverability, and reply handling — but most tools treated channels as bolt-ons and left WhatsApp replies disconnected from the campaign that started them."
solution: "I built a full-stack multi-tenant platform that unifies Official WhatsApp Cloud API campaigns, personalised bulk email (including per-recipient PDF attachments), recipient pipelines, and a shared WhatsApp Inbox that carries campaign context in one operational system. Teams send on email, WhatsApp, or both from the same audience, prove delivery, and answer replies without losing track of what prompted them — now ~10 organizations with daily volume on the order of 10K+ WhatsApp and 10K+ emails."
metrics: ["~10 orgs live", "250K+ WhatsApp sent", "10K+ WhatsApp / day", "10K+ emails / day"]
results:
  - "Running Official WhatsApp Cloud API + email campaigns across ~10 organizations in production."
  - "250K+ WhatsApp messages sent through the Official Cloud API to date, at a sustained daily pace of 10K+ WhatsApp and 10K+ emails."
  - "Unified WhatsApp + email on one audience with Meta-approved templates and a shared Inbox that auto-tags conversations with campaign context."
  - "Personalised bulk email with per-recipient HTML-to-PDF attachments, verified-domain sending, and open/click analytics."
  - "Multi-tenant campaign ops with recipient validation, delivery reporting, and no artificial daily send-cap bottlenecks."
---

## Overview

GSendr is a multi-tenant campaign platform built at [G6 Labs Asia](https://www.g6labs.asia) for organizations that need **Official WhatsApp Cloud API** and **personalised bulk email** in one place — not as bolt-ons.

An org uploads an audience once, sends on WhatsApp, email, or both, proves delivery, and handles replies in a shared **Inbox** that automatically carries the originating campaign's context. Today roughly **10 organizations** run on the platform, collectively sending on the order of **10K+ WhatsApp messages** and **10K+ emails** on a busy day.

Underneath the campaign flow sits a full multi-tenant operation: a platform-level admin console separate from each org's own admins, a partner API with webhook delivery, per-org quotas and storage limits, and PII-aware retention for recipient data. It's built to run concurrent campaigns for unrelated organizations without leaking audiences, credentials, or send capacity between them.

I owned the full stack: **Next.js (App Router) + TypeScript** on the front, **Express.js + PostgreSQL** on the API, Meta's **WhatsApp Cloud API** for template campaigns, a **verified-domain email provider** for delivery, Chart.js for engagement views, and Zod across validation boundaries.

## The problem

Most "omnichannel" tools treat WhatsApp as an afterthought:

- Email and WhatsApp audiences diverge — ops ends up maintaining two lists.
- Replies land in a generic inbox with no link back to the campaign that started the thread.
- Bulk email personalisation stops at merge tags; finance and ops still need **per-recipient PDFs** (statements, invoices, policies).
- Multi-org SaaS needs hard tenancy: templates, domains, numbers, and analytics scoped per organization.
- Support needs a way to see what a customer's org is doing without a second login, and a way to prove they didn't overstep when they did.

GSendr treats both channels as first-class, treats **conversation** as part of the campaign lifecycle, and treats the operational surface — admin, quotas, audit — as a product feature, not an afterthought bolted on for one customer.

## What I built

### Official WhatsApp Cloud API

We didn't start here. Early GSendr sent via **Evolution API** (unofficial). Even with working-hour windows, daily caps, and send delays, numbers were getting banned fast — a non-starter for multi-org customers. We migrated to Meta's **Official Cloud API**: embedded signup (Meta OAuth) so orgs onboard their own numbers, approved-template governance per org, bulk send pipelines with retries and failure states, and delivery / read / failed signals in campaign reporting. Reliable, attributable outbound — not a grey-route blast.

### One audience, two channels

The same recipient pipeline feeds WhatsApp and email. Multi-sheet Excel/CSV import with custom field mapping, validation, and targeting sit in one place; channel choice is a send decision, not a data-model fork. Teams don't maintain parallel lists just because the channel changed.

### Personalised bulk email + PDFs

For campaigns that need attachments, GSendr generates **HTML → PDF per recipient** matched to spreadsheet rows, with attachment-size guardrails before a send is allowed to queue. Sending itself runs through verified-domain flows (SPF/DKIM/DMARC-aware), with signed webhook ingestion for delivery events. Bulk address validation — syntax, MX, and hygiene checks, metered by credits — runs before anything goes out, and a sandbox/testing mode lets teams dry-run a send without it touching real recipients. Opens, clicks, and bounces land back on the campaign so ops can see what actually happened.

### Inbox

The Inbox is GSendr's customer-service surface — every inbound WhatsApp conversation lands there, whether it started from a campaign or came in cold. When a contact was reached by a recent campaign, that conversation is automatically tagged with it, so agents aren't guessing which blast a customer is responding to. Free-form replies stay inside Meta's 24-hour service window, conversations can be exported, and an **AI Reply** feature — currently in development — will draft on-brand responses from the campaign and conversation context where one exists.

### Multi-tenant by default

Organizations, teams, domains, templates, and analytics are scoped per tenant. Auth runs on JWT with optional 2FA and magic-link sign-in; support can impersonate a customer's account to help them, with every impersonation session written to a full audit trail. Each org gets its own send quotas per channel, storage limits, and sits behind a global rate limiter — so one organization's volume can't starve another's.

### Platform operations

Running ~10 orgs concurrently needs its own control surface, separate from any single customer's admin panel. GSendr has a platform-level admin console with dashboard stats and an active-campaign monitor, a support-ticket system, and a changelog that gets curated and shipped to customers. Maintenance windows are schedulable with user-facing status, campaign concurrency is controlled with stuck-job recovery for anything that hangs mid-send, and AI usage cost is tracked across the whole platform rather than guessed at.

### Partner integrations & data handling

A partner API exposes webhook delivery — bulk and realtime, with retry scheduling — for organizations that need to react to campaign events in their own systems. Enterprise clients get dedicated integration pipelines with custom field mapping and status polling rather than forcing every customer through the same generic import. Recipient data gets PII-aware handling with configurable retention (for fields like national ID numbers), and campaigns themselves archive on a scheduler with per-org retention rules — so "how long do we keep this" is a setting, not a manual cleanup job.

## Features

- **Official WhatsApp Cloud API** — embedded signup, Meta-approved templates, bulk campaigns, delivery/read tracking, multi-org sending
- **Shared WhatsApp Inbox** — campaign-tagged conversations, 24-hour window handling, conversation export, AI Reply (in development)
- **Personalised bulk email** — HTML-to-PDF per recipient matched to spreadsheet rows, verified-domain sending, sandbox/testing mode
- **Bulk address validation** — syntax, MX, and hygiene checks metered by credits, ahead of every send
- **Multi-tenant core** — organizations and teams with role-scoped access, JWT + 2FA + magic-link auth, audited impersonation
- **Per-org quotas and storage limits**, plus a global send rate limiter across channels
- **Platform admin console** — separate from org admins, with support tickets, changelog curation, and maintenance windows
- **Partner API** — bulk and realtime webhook delivery with retries, dedicated integration pipelines for enterprise clients
- **PII-aware retention** on recipient data, with scheduled campaign archiving per organization
- Domain verification, sender identity, and deliverability governance
- Recipient import, validation, and engagement analytics (delivered, opened, clicked, bounced, WhatsApp read/failed)

## Results

In production across ~**10 organizations**:

- **250K+ WhatsApp messages** sent through the Official Cloud API to date, at a sustained daily pace of **10K+ WhatsApp** and **10K+ emails**
- Unified WhatsApp + email on one audience with a shared Inbox that auto-tags campaign context
- Personalised attachments and verified-domain sending with engagement analytics
- Multi-tenant ops without artificial daily send-cap bottlenecks

## Roadmap

- **Live** — Email campaigns with verified-domain sending, personalised attachments, and engagement analytics
- **Live** — Official WhatsApp Cloud API campaigns, templates, and shared Inbox at current multi-org volume
- **In development** — AI Reply that drafts on-brand WhatsApp responses from campaign + conversation context
- **Planned** — Voice Blast, SMS, deeper audience segmentation and lifecycle automation, expanded deliverability diagnostics, stronger org-level policy/compliance controls

## Related

- [How we built GSendr](/blog/shipping-whatsapp-cloud-api-at-scale) — architecture, audiences, PDFs, Inbox, tenancy  
- [Why we left Evolution API](/blog/why-we-left-evolution-api-for-official-whatsapp) — unofficial WhatsApp, bans, and the move to Official Cloud API
