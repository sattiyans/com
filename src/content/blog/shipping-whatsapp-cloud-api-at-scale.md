---
title: "How we built GSendr to run WhatsApp + email campaigns across orgs"
description: "Inside GSendr’s multi-tenant campaign engine — Official WhatsApp Cloud API, personalised bulk email, and a shared reply desk. ~10 orgs; ~10K+ WhatsApp and 10K+ emails daily."
date: "2026-05-18"
draft: false
project: "gsendr"
---

When we started GSendr at [G6 Labs Asia](https://www.g6labs.asia), the brief wasn’t “add WhatsApp to an email tool.” It was: give organizations one place to run **Official WhatsApp Cloud API** campaigns and **personalised bulk email**, prove delivery, and answer replies with the campaign still attached.

That sounds tidy on a slide. In production it means Meta templates, 24-hour customer-service windows, verified sending domains, spreadsheet → per-recipient PDFs, multi-tenant isolation, and a reply desk that doesn’t lose context when five teams are sending at once.

## The problem we actually had

Most “omnichannel” tools treat WhatsApp as a bolt-on:

- Email and WhatsApp audiences drift apart — ops ends up maintaining two lists.
- Replies land in a generic inbox with no link back to the campaign that started the thread.
- Bulk email personalisation stops at merge tags; finance/ops still need **per-recipient PDFs** (statements, invoices, policies).
- Multi-org SaaS needs hard tenancy: templates, domains, numbers, and analytics scoped per organization — not a shared free-for-all.

We needed a system that treated both channels as first-class, and treated **conversation** as part of the campaign lifecycle — not an afterthought.

## What GSendr is

GSendr is a multi-tenant campaign platform. An org uploads an audience once, sends on WhatsApp, email, or both, tracks delivery/engagement, and handles WhatsApp replies in a **shared reply desk** with the originating campaign already attached.

I built it full-stack: **Next.js (App Router) + TypeScript** on the front, **Express.js + PostgreSQL** on the API, **WhatsApp Cloud API** for Meta-approved template sends, **Resend** for verified-domain email, plus Chart.js for engagement views and Zod across validation boundaries.

## How we approached the hard parts

### Official WhatsApp Cloud API

Campaign sending goes through Meta’s Official Cloud API with approved templates:

- Template governance per org (what’s approved, what’s sendable)
- Bulk send pipelines that respect API realities (throughput, retries, failure states)
- Delivery / read / failed signals fed back into campaign reporting
- A real 24-hour customer-service window for free-form replies after the user responds

The product promise is boring on purpose: **reliable, attributable outbound** — not “blast and pray.”

### One audience, two channels

The same recipient pipeline feeds WhatsApp and email. Import, validation, and campaign targeting sit in one place; channel choice is a send decision, not a data-model fork.

### Personalised bulk email with per-recipient PDFs

For campaigns that need attachments (statements, invoices, policies), we generate **HTML → PDF per recipient** matched to spreadsheet rows, then send via verified-domain flows (SPF/DKIM/DMARC-aware). Opens, clicks, and bounces land back on the campaign.

### Shared reply desk with campaign context

WhatsApp replies open Meta’s 24-hour window. The desk keeps conversations tied to the campaign that started them, so agents aren’t guessing which blast a customer is responding to.

### Multi-tenant by default

Organizations, teams, domains, templates, and analytics are scoped. Concurrent campaigns across orgs without leaking audiences or credentials.

## Where it is now

GSendr is live with roughly **10 organizations**. On a busy day they collectively send on the order of **10K+ WhatsApp messages** and **10K+ emails** — sustained daily volume, not a launch spike.

That scale only works if the boring infrastructure holds: recipient validation, delivery reporting, template/domain governance, and a reply desk that still makes sense when multiple campaigns are in flight.

## What’s next

- **In development** — AI Reply that drafts on-brand WhatsApp responses from campaign + conversation context  
- **Planned** — Voice Blast, SMS, deeper segmentation / lifecycle automation, stronger deliverability diagnostics

## Takeaway

Shipping Official WhatsApp Cloud API at multi-org scale isn’t a single integration call. It’s product + architecture: tenancy, templates, audiences, attachments, delivery proof, and replies as one operational loop.

Full case study: [GSendr](/projects/gsendr).  
How we got to Official Cloud API (and what unofficial cost us): [Why we left Evolution API](/blog/why-we-left-evolution-api-for-official-whatsapp).
