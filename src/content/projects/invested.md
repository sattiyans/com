---
title: "InvestED Portal - Backend API & Admin Dashboard"
description: "A robust backend application management system with RESTful API and comprehensive admin dashboard for InvestED's leadership and foundation programmes, featuring automated workflows, role-based access control, and seamless WordPress integration."
date: "2024-09-29"
draft: false
role: "Backend Developer"
client: "InvestED"
projectOwner: "TriSquare Technology"
projectURL: "https://invested.my"
techStack: ["Laravel 10", "PHP 8.1", "Filament 3.2", "Livewire", "MySQL", "Laravel Sanctum", "RESTful API", "WordPress Integration"]
featuredImage: "invested.png"
screenshots: ["invested1.png", "invested2.png", "invested3.png", "invested4.png", "invested5.png"]
problem: "The admissions workflow depended on manual handling across form submissions, candidate records, document checks, and reviewer updates, which created bottlenecks and inconsistent decision trails. Teams struggled to keep application state accurate at scale, especially when multiple reviewers and status transitions were involved."
solution: "I built a structured Laravel backend with API intake from WordPress and a centralized admin workflow for status management, document handling, and reviewer actions. The system enforces cleaner state transitions and identity checks so processing is faster, auditable, and easier to operate as application volume increases."
results:
  - "Standardized application lifecycle from submission to final review."
  - "Improved admin efficiency with filtering, bulk actions, and status workflows."
  - "Reduced duplicate/inconsistent records through NRIC-based checks."
---

## Overview

InvestED Portal is a headless backend system for programme applications. A WordPress frontend sends submissions to Laravel APIs, and internal teams process everything in a Filament dashboard with role-based access and audit visibility.

## Features

- API endpoint for WordPress submissions with strong validation and error handling.
- Duplicate detection and safe update logic based on applicant identity.
- Admin dashboard for review workflows, bulk actions, and status transitions.
- Candidate-facing updates for profile, document, and application progress.
- Audit logging and role-based permissions for governance and accountability.

## Future Improvements

- Add SLA tracking and reviewer workload balancing.
- Introduce richer scoring/ranking support for shortlisting.
- Expand automation for reminders and incomplete applications.