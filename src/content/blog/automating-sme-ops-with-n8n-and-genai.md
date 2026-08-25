---
title: "Automating SME ops with n8n and GenAI — without boiling the ocean"
description: "What I automate for startups and SMEs via Dotkod — n8n workflows, GenAI where it earns its keep, and the boring glue that actually saves hours."
date: "2026-08-01"
draft: false
---

Most SME “AI projects” fail the same way: a chatbot demo, no owner for the workflow, and a spreadsheet that still runs the business.

At [Dotkod Solutions](https://dotkod.com) I take the opposite bet. Start from a painful, repeating ops job. Automate the glue. Add GenAI only where draft-quality text or classification beats a human on speed — then hand the result back into a system someone already trusts.

## The pattern that works

1. **Name the job** — “chase unpaid invoices,” “triage inbound leads,” “summarise support threads into a CRM note.”
2. **Map the triggers** — email, webhook, form, schedule, spreadsheet row.
3. **Automate the path in n8n** (or similar) — fetch → transform → decide → write back.
4. **Drop GenAI on one step** — draft reply, extract fields, classify intent — with a human or rule gate when money or reputation is on the line.
5. **Log failures** — retries, dead letters, a Slack/email ping. Silent automation is worse than no automation.

You’re not building a platform. You’re removing hours from a week.

## Where GenAI earns its seat

GenAI is useful when the input is messy language and the output is a draft or structured guess:

- Lead emails → CRM fields + suggested next action  
- Support threads → short internal summary  
- Product blurbs / FAQ drafts from a brief  
- Review or feedback clustering for a weekly digest  

It’s a liability when you need deterministic money movement, exact tax figures, or “always send this template or don’t send at all.” For those, use rules, APIs, and official channels — same lesson we learned the hard way on WhatsApp elsewhere.

## Where n8n (and friends) earn their seat

The value is usually the **plumbing**:

- Webhooks from payment gateways or forms  
- Nightly syncs between tools that refuse to talk  
- Approvals: draft → human click → send  
- Retries when a third-party API flakes at 2am  

SMEs don’t need another dashboard. They need the existing ones to stay in sync without copy-paste.

## What I refuse to automate first

- Anything without a clear owner when it breaks  
- Anything where a wrong send costs more than a wrong skip  
- “AI for everything” roadmaps before one workflow is live for 30 days  

Ship one boring win. Measure hours saved. Then expand.

## Takeaway

GenAI without workflow design is theatre. Workflow design without failure handling is a future outage. For startups and SMEs, the win is narrow: **n8n (or equivalent) for glue, GenAI for drafts and extraction, humans for judgment.**

If you’re scoping an automation or custom web build, [hire me](/hire) or email [hey@sattiyans.com](mailto:hey@sattiyans.com).
