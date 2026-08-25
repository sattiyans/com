---
title: "Why we left Evolution API for Official WhatsApp Cloud API"
description: "GSendr started on Evolution API. Working hours, daily caps, and delays still weren’t enough — numbers got banned fast. Here’s why we moved to Meta’s Official Cloud API."
date: "2026-08-25"
draft: false
project: "gsendr"
---

GSendr didn’t start on Official WhatsApp Cloud API.

To ship WhatsApp campaigns quickly, we wired **Evolution API** — an unofficial stack. Connect a number, send, iterate. On a demo it looks fine. In production with real orgs, it didn’t hold.

## What broke

Numbers got **banned fast**.

We weren’t blasting blindly. We put the usual safeguards in place:

- Working-hour send windows
- Daily send caps
- Per-message delays / jitter
- Throttling and careful pacing

It slowed the bleeding. It didn’t stop it.

Unofficial routes sit outside Meta’s business rules. You’re always one spam or quality signal away from a dead number. For a multi-tenant product, that isn’t a “ops will rotate SIMs” problem — it’s a **customer-trust failure**. An org that wakes up to a banned sender loses campaigns, reply context, and confidence in the platform.

## The real cost

Every ban burned:

- Time reconnecting / replacing numbers
- Campaign history and operational continuity
- Trust with orgs that expected WhatsApp to just work

Limits and delays are table stakes. They don’t make an unofficial channel durable.

**Speed of integration isn’t worth fragile deliverability.**

## What we moved to

We migrated GSendr to Meta’s **Official WhatsApp Cloud API**:

- Meta-approved templates and per-org template governance
- Bulk pipelines with retries, failure states, and delivery / read / failed reporting
- A real 24-hour customer-service window for free-form replies after the user responds

Boring on purpose: attributable outbound you can run across organizations without playing ban roulette.

## Where that left us

Today GSendr runs Official Cloud API + email for roughly **10 organizations**, with daily volume on the order of **10K+ WhatsApp** and **10K+ emails**. That volume only makes sense on a path Meta won’t randomly kill under you.

## Takeaway

If you’re building WhatsApp into a product — especially multi-org SaaS — treat unofficial APIs as a prototype, not a foundation. We learned that the expensive way on Evolution API.

How the full platform is shaped (audiences, PDFs, reply desk, tenancy): [How we built GSendr](/blog/shipping-whatsapp-cloud-api-at-scale) · [Case study](/projects/gsendr).
