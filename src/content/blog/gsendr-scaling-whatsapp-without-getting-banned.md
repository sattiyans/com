---
title: "Scaling GSendr to 10K WhatsApp messages a day without getting banned"
description: "What changed in GSendr since August: batched sends, template guardrails, deploy-safe campaigns, PDPA encryption, and the production lessons that came with running a multi-org WhatsApp platform."
date: "2026-10-08"
draft: false
project: "gsendr"
---

In August I wrote about [why we left Evolution API](/blog/why-we-left-evolution-api-for-official-whatsapp) for Meta's Official WhatsApp Cloud API. The short version: unofficial routes got our numbers banned, and no amount of pacing fixed it.

Moving to the official API solved the existential problem. It did not make sending easy. Most of the work since that post answers one question: how do you push around **10K WhatsApp messages a day** across multiple organizations without Meta pulling the plug?

Here's what shipped, grouped by the problem it solves.

## 1. Official doesn't mean unbannable

Templates get rated by Meta. Bad ratings get templates paused, then disabled, and a weak number gets its messaging limits cut. On the official API, the ban risk moves from "your number dies" to "your template or quality rating dies." Still painful in the middle of a campaign.

So the first big theme was **seeing what Meta sees, before it acts**:

- **Template health from Meta webhooks.** Live template status, quality rating and category, straight from Meta. Number quality and messaging-limit changes trigger notifications, and an audit screen shows every Meta event we receive.
- **Quality guardrails.** A warning when a template drops to Yellow, and an automatic halt before Meta bans it. We'd rather stop a campaign ourselves than have Meta stop it for us.
- **Risky-wording checks.** A check flags risky template wording before it costs you a quality rating.
- **Meta's real reason.** When a template is paused, the UI shows Meta's actual reason instead of a generic "paused."

## 2. Sending fast, but not too fast

Volume is where bans come from. The fix was batching, not throttling everything into the ground:

- **Batched campaign sends.** A campaign sends N messages, then pauses on its own. It spreads load the way Meta's quality system likes to see it.
- **Faster where it's safe.** Up to 6 messages in parallel per number and 15 overall, so batching doesn't make big campaigns crawl.
- **Smarter failures.** A per-error breakdown on every campaign. Retry skips failures that can never succeed. "Content too long" failures can be resent with a different template that uses the same variables. Billing-blocked messages pause instead of looping, and transient Meta API errors retry on their own.
- **Message dedupe** so the same recipient doesn't get the same message twice.

The lesson: **retries are a product decision, not a loop.** Retrying a permanent failure burns credits and quality signal. Not retrying a transient one loses a customer's message.

## 3. Campaigns that survive deploys

We ship often. Campaigns run for a long time. Those two facts fight each other.

- If a deploy cuts off a campaign while it's queuing, the campaign **resumes**, and a **Send to remaining** button covers anything left over.
- A campaign whose final status update got lost now finishes instead of hanging in "sending" forever.
- Scheduled campaigns no longer re-send on every scheduler tick. (That one was exactly as fun as it sounds.)
- PDF generation also resumes automatically after a deploy.

None of this is visible when it works. All of it is very visible when it doesn't.

## 4. Onboarding a number without a support ticket

**Embedded Signup** lets an org onboard a WhatsApp number through Meta's own flow. The number is registered automatically once it's verified, and a wrong App Secret is caught at verify time. Before that check, a bad secret would silently drop every inbound reply, which is the worst kind of bug: everything looks fine until a customer asks why nobody answered.

Admins can now disable a number, and platform admins can retire or remove numbers entirely. Existing Cloud templates can be edited in place, and there's a beta for creating a template by pasting plain text.

## 5. Billing that matches Meta's

Meta changed service-message pricing from 1 October. GSendr now charges automatically, gives every number **1,000 free service messages a month**, and labels them "Meta free" in the inbox. The change was announced in-app before it went live.

On the other side of the ledger:

- **Meta billing receipts** are read automatically and shown per WhatsApp Business account (charge, SST and total). Each receipt email is verified with our own DKIM check before we trust it.
- **Dated price history.** Analytics price each send at the rate on the day it went out, not today's rate. Otherwise every price change quietly rewrites last month's reports.
- **Subscriptions** renew on the 1st or 15th, with reminders, a grace period and suspension.
- **Credits** show in the sidebar, and inbox replies that fail to deliver are refunded.

## 6. PDPA: encrypting what we hold

Some campaigns need national ID numbers, for example to password-protect a statement. That data shouldn't live in our database any longer than it has to. Over four phases:

- ID numbers are **encrypted at rest** with AES-256-GCM, with key rotation.
- Each recipient's PDF is **password-protected** with qpdf.
- IDs are **purged automatically after 24 hours**, with a check on every campaign to catch leaks.

## 7. Partner webhooks and API

Some organizations want campaign conversations in their own systems. Over five phases we built **HMAC-signed webhooks**: a bulk push when a campaign completes, real-time two-way pushes, delivery history with re-send for admins, and partner API docs.

Alongside it, bill-statement campaigns got sturdier: multiple integration configs per org, bills that are found and relinked across folders, automatic re-downloads for missing bills, and a Skipped tab with "Retry download & send."

## 8. An inbox that doesn't melt

The inbox polls for new messages. With enough conversations and enough open tabs, that polling became the busiest thing in the database.

- A **summary table** so loading the conversation list no longer reads every message.
- The 8-second refresh is staggered, with a cheap "anything new?" check before any full reload.
- Identical queries are shared per org.
- **Only one browser tab refreshes**, and hidden tabs pause.

Customer service can also see the credit balance, failed replies with their reason, and template headers, footers and quick-reply buttons in previews.

## 9. Operating it: lessons from production

This is the part that doesn't show up in a changelog but takes the most time. A few incidents we worked through, written as the lessons we'd pass on:

- **Memory limits are connection limits.** When the backend ran out of memory, it exhausted database connections. Fix the memory, and the "database problem" goes away.
- **Postgres JIT isn't free.** For our short, frequent queries, JIT compilation cost more than it saved. We disabled it for the app.
- **DNS is part of your database path.** Slow lookups starved the connection pool. It looked like a database issue until we traced it.
- **Not every CORS error is CORS.** A proxy rejecting requests showed up in the browser as CORS. Read the proxy logs first.
- **Backups aren't done until they're off the box.** Daily database backups now go off-site, with a maintenance window for the work that needs one.
- **Observability has a budget too.** Sentry covers errors and performance, and tuning the sampling took traces from about 14M a month to 2.5M without losing the signal.

We also added an applied-migration tracker, an orphan-file sweep, and a prompt that asks users to reload stale tabs after a deploy.

## 10. The rest

- **Email:** per-org validation credits, real-time checks on small lists, automatic retries for transient sending errors, per-org sending keys and domains, and an email analytics dashboard with export. Email-only campaigns no longer need a PDF.
- **Admin and security:** multiple platform admins, a user audit log, a sessions page with live devices, an optional one-session-per-user switch, signature checks on every incoming webhook, and org-scoped imports.
- **Polish:** one table component across the whole app with sortable headers, animated how-to guides per campaign type, a WhatsApp preview with a recipient picker, and branded error pages and share images.

## Takeaway

Getting onto the Official WhatsApp Cloud API was the decision. Staying there at volume is the work: watching template quality before Meta does, batching instead of blasting, making every campaign survive a deploy, and treating retries, billing and personal data as product features rather than plumbing.

The most valuable changes are the ones nobody notices.

More on GSendr: [How we built it](/blog/shipping-whatsapp-cloud-api-at-scale) · [Why we left Evolution API](/blog/why-we-left-evolution-api-for-official-whatsapp) · [Case study](/projects/gsendr).
