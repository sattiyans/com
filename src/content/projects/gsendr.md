---
title: "GSendr - WhatsApp & Email Campaigns. One Reply Desk."
description: "Multi-channel campaign platform for organizations — Official WhatsApp Cloud API campaigns, personalised bulk email with per-recipient PDFs, and a shared reply desk that keeps every conversation tied to the campaign that started it."
date: "2026-02-25"
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
solution: "I built a full-stack multi-tenant platform that unifies Official WhatsApp Cloud API campaigns, personalised bulk email (including per-recipient PDF attachments), recipient pipelines, and a shared WhatsApp reply desk in one operational system. Teams can send on email, WhatsApp, or both from the same audience, prove delivery, and answer replies with campaign context attached — engineered for high-volume multi-org sending with verified-domain governance and engagement analytics."
metrics: ["50K+ WhatsApp messages", "10K+ recipients/campaign", "Official Cloud API"]
results:
  - "Launched Official WhatsApp Cloud API campaigns across multiple organizations — 50K+ outbound WhatsApp messages sent."
  - "Unified WhatsApp + email on one audience with Meta-approved templates, shared reply desk, and campaign-linked conversations."
  - "Engineered personalised bulk email with per-recipient HTML-to-PDF attachments, verified-domain sending, and open/click analytics."
  - "Scaled multi-tenant campaign operations with recipient validation, delivery reporting, and no daily send-cap bottlenecks."
---

## Overview

GSendr is a multi-tenant campaign platform for WhatsApp and email. Organizations upload an audience once, send on the channel that fits (or both), prove delivery, and catch WhatsApp replies in a shared inbox with the originating campaign already attached.

## Features

- **Official WhatsApp Cloud API** — Meta-approved templates, bulk WhatsApp campaigns, delivery/read tracking, and multi-org sending.
- **Shared WhatsApp reply desk** — campaign-linked conversations with free-form replies inside Meta's 24-hour customer service window.
- **Personalised bulk email** — HTML-to-PDF per recipient (invoices, statements, policies) matched to spreadsheet rows in one campaign.
- Multi-tenant organization model with scoped resources and teams.
- Campaign lifecycle from draft to schedule/send with status controls.
- Domain verification, sender identity, and deliverability governance (SPF/DKIM/DMARC-aware workflows).
- Recipient import, validation, and engagement analytics (delivered, opened, clicked, bounced, WhatsApp read/failed).

## Roadmap

Evolving GSendr into fuller multi-channel campaign infrastructure:

- **Live** — Email campaigns with verified-domain sending, personalised attachments, and engagement analytics.
- **Live** — Official WhatsApp Cloud API campaigns, templates, and shared reply desk (50K+ messages sent across organizations).
- **In development** — AI Reply that drafts on-brand WhatsApp responses from campaign + conversation context.
- **Planned** — Voice Blast, SMS, deeper audience segmentation and lifecycle automation, expanded deliverability diagnostics, and stronger org-level policy/compliance controls.
