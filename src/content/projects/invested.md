---
title: "InvestED Portal - Backend API & Admin Dashboard"
description: "A robust backend application management system with RESTful API and comprehensive admin dashboard for InvestED's leadership and foundation programmes, featuring automated workflows, role-based access control, and seamless WordPress integration."
date: "2024-04-29"
draft: false
role: "Backend Developer"
client: "InvestED"
projectOwner: "TriSquare Technology"
projectURL: "https://invested.my"
techStack: ["Laravel 10", "PHP 8.1", "Filament 3.2", "Livewire", "MySQL", "Laravel Sanctum", "RESTful API", "WordPress Integration"]
featuredImage: "invested.png"
screenshots: ["invested1.png", "invested2.png", "invested3.png", "invested4.png", "invested5.png"]
---

## Overview

InvestED Portal is a backend application management system built to streamline the recruitment and selection process for InvestED's leadership and foundation programmes. This project focuses on the **backend infrastructure** - a RESTful API that receives application submissions from a WordPress frontend form (built by another developer) and a comprehensive admin dashboard for managing the entire application lifecycle.

The system was architected as a headless backend solution, separating concerns between the public-facing WordPress application form and the administrative backend. The platform addresses the critical need for an efficient, scalable solution to manage hundreds of applications, track candidate progress through multiple stages, and provide powerful administrative tools for processing applications.

**Architecture**: The WordPress frontend form submits applications to the Laravel API endpoint (`/api/application/create`), which processes the data, creates user accounts, handles document storage, and triggers notifications. Administrators then manage these applications through the Filament-based admin dashboard, which provides real-time updates, filtering, and workflow management.

## Features

### RESTful API
- **Application Submission Endpoint**: Secure API endpoint (`POST /api/application/create`) that receives application data from the WordPress frontend form
- **Document URL Processing**: Handles document submissions via URLs (from WordPress form) - validates, fetches, and stores PDF documents securely
- **Automated User Creation**: Automatically creates user accounts for new applicants with secure password generation and password reset email delivery
- **Duplicate Detection**: Intelligent system that detects existing applications by NRIC (National Registration Identity Card) and either updates existing records or prevents duplicate submissions
- **Multi-Programme Support**: Supports multiple programme applications (Foundation, Leadership) with separate tracking for applied vs. processing programmes
- **Comprehensive Data Validation**: Validates all incoming data including personal details, education history, qualifications, English proficiency test scores, and supporting documents
- **Error Handling**: Robust error handling with clear, developer-friendly error messages for WordPress integration

### Admin Dashboard
- **Real-time Statistics**: Dashboard widgets showing total applications, new applications, shortlisted candidates, and approved applicants with daily trend indicators
- **Advanced Filtering**: Filter applications by programme type, status, date range, and custom criteria
- **Bulk Operations**: Archive, unarchive, and manage multiple applications simultaneously
- **Status Workflow Management**: Track applications through stages: New → Shortlisted → Interviewed → Approved → Employed, with support for KIV (Keep In View) and Rejected statuses
- **Activity Logging**: Complete audit trail of all system actions using Spatie Activity Log

### Candidate Portal
- **Self-Service Portal**: Candidates can view and update their application details through a dedicated "My Details" page
- **Document Management**: Upload and update resumes (PDF format) with preview capabilities
- **Video Submission**: Support for multiple video formats including direct uploads (max 5MB), YouTube links, TikTok links, and other video platforms
- **Status Tracking**: Real-time visibility into application status with email notifications for status changes
- **Programme Information**: View applied and processing programme assignments

### Security & Access Control
- **Role-Based Access Control (RBAC)**: Three-tier permission system (Super Admin, Admin, Candidate) using Filament Shield and Spatie Permissions
- **Two-Factor Authentication**: Optional 2FA support via Filament Breezy for enhanced security
- **API Authentication**: Secure API endpoints using Laravel Sanctum for external integrations
- **Soft Deletes**: Applications can be archived and restored without permanent data loss

### Notification System
- **Email Notifications**: Automated emails for application status changes, password resets, video uploads, and new application submissions
- **In-App Notifications**: Real-time notifications within the Filament admin panel
- **Smart Notifications**: Different notification types for existing users submitting new applications vs. first-time applicants

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface built with Filament's responsive components
- **Real-time Updates**: Live polling on application tables (10-second intervals) for instant status updates
- **Intuitive Forms**: Tabbed interface organizing information into logical sections (Profile, Education, Document, Video)
- **Search Functionality**: Quick search by name or NRIC with search-on-blur optimization
- **Custom Branding**: InvestED branding with custom logo, colors, and favicon

## Tech Stack

### Backend Framework
- **Laravel 10**: Chosen for its robust ecosystem, excellent documentation, and built-in features like queues, notifications, and file storage
- **PHP 8.1+**: Leveraging modern PHP features for better performance and type safety

### Admin Panel
- **Filament 3.2**: Selected for rapid development of admin interfaces without writing custom frontend code. Filament provides:
  - Pre-built form components with validation
  - Table management with sorting, filtering, and pagination
  - Built-in authentication and authorization
  - Responsive design out of the box
  - Livewire integration for reactive components

### Admin Dashboard Frontend
- **Livewire**: Server-side reactive components that eliminate the need for separate JavaScript frameworks while providing real-time interactivity in the admin panel
- **Vite**: Modern build tool for fast development and optimized production builds of admin dashboard assets
- **Tailwind CSS**: Utility-first CSS framework used by Filament for consistent, customizable styling in the admin interface

**Note**: The public-facing application form is built in WordPress by another developer. This project focuses solely on the backend API and admin dashboard.

### Authentication & Security
- **Laravel Sanctum**: Lightweight API authentication for secure external integrations
- **Filament Shield**: Role and permission management specifically designed for Filament panels
- **Spatie Permissions**: Robust permission system with role-based access control
- **Filament Breezy**: Two-factor authentication and enhanced security features

### Data Management
- **MySQL**: Relational database for structured application data
- **Spatie Activity Log**: Comprehensive logging of all user actions and system events
- **Laravel Soft Deletes**: Non-destructive deletion for data recovery and audit purposes

### Additional Packages
- **Filament Phone Input**: International phone number input with country code support
- **Filament Country Field**: Country selection component with flag icons
- **Filament Apex Charts**: Data visualization for dashboard statistics
- **Filament Logger**: Enhanced logging interface within the admin panel

## Challenges & Solutions

### Challenge 1: Handling Duplicate Applications
**Problem**: Applicants might submit multiple applications using different email addresses but the same NRIC, leading to duplicate records and data inconsistency.

**Solution**: Implemented intelligent duplicate detection logic in the API controller that:
- Checks for existing applications by NRIC before creating new records
- Updates existing applications when the same NRIC applies to a different programme
- Sends appropriate notifications to existing users when new applications are detected
- Maintains a single source of truth per applicant while supporting multiple programme applications

### Challenge 2: Document Management from WordPress Integration
**Problem**: The WordPress frontend form submits document URLs rather than direct file uploads, requiring the backend API to securely fetch and store remote files from WordPress media library or external sources.

**Solution**: 
- Implemented URL validation and file fetching using PHP's `file_get_contents()` with proper error handling
- Added comprehensive error handling for inaccessible URLs with developer-friendly error messages for WordPress integration
- Generated unique filenames with timestamps to prevent conflicts and ensure data integrity
- Stored documents in Laravel's storage system with proper path management and access control
- Created a robust system that handles various URL formats and edge cases from WordPress submissions

### Challenge 3: Complex Application Status Workflow
**Problem**: Applications move through multiple status stages with different rules and notifications for each transition.

**Solution**:
- Created an `ApplicationStatus` enum using ArchTech Enums for type-safe status management
- Implemented status-specific business logic and validation
- Built notification system that triggers appropriate emails based on status changes
- Used Filament's badge components to visually distinguish statuses in the admin interface

### Challenge 4: Video Link Formatting and Storage
**Problem**: Supporting multiple video platforms (YouTube, TikTok, direct uploads) with different storage requirements and validation rules.

**Solution**:
- Created a flexible JSON structure to store video links with type metadata
- Implemented automatic platform detection based on URL patterns
- Added file size limits (5MB) for direct uploads with helpful hints to use external platforms for larger files
- Created a repeater component in Filament for managing multiple video links per application

### Challenge 5: Role-Based Data Access
**Problem**: Different user roles need different views and permissions (candidates see only their data, admins see filtered views, super admins see everything).

**Solution**:
- Implemented comprehensive RBAC using Filament Shield and Spatie Permissions
- Created custom query scopes to filter data based on user roles
- Built role-specific pages (e.g., "My Details" for candidates only)
- Used Filament's authorization hooks to control access to resources and actions

### Challenge 6: Real-time Updates Without Performance Impact
**Problem**: Admin users need to see application updates in real-time, but constant polling can impact server performance.

**Solution**:
- Implemented smart polling (10-second intervals) only on the applications list page
- Used Laravel's query optimization to ensure efficient database queries
- Implemented proper indexing on frequently queried columns (status, created_at, nric)
- Added caching where appropriate for static data like university lists

## Key Learnings

### Filament Framework Mastery
This project provided deep experience with Filament, a powerful but relatively new admin panel framework. Key learnings include:
- Understanding Livewire's reactive component model and how it integrates with Filament
- Mastering Filament's form builder for complex, conditional forms
- Learning to extend Filament with custom components and actions
- Implementing proper authorization patterns within Filament's ecosystem

### API Design and WordPress Integration
Building a backend API that integrates with a WordPress frontend taught valuable lessons:
- Designing RESTful APIs that are both secure and developer-friendly for cross-platform integration
- Handling file uploads via URLs from WordPress media library vs. direct uploads
- Implementing proper error handling and validation for external integrations with clear, actionable error messages
- Balancing flexibility (accepting various data formats from WordPress) with strict data integrity requirements
- Creating API contracts that allow frontend developers to work independently while maintaining data consistency
- Understanding the challenges of headless architecture and ensuring seamless data flow between WordPress and Laravel

### Complex Business Logic
The application submission workflow with duplicate detection and status management required:
- Careful consideration of edge cases (same NRIC, different emails, multiple programmes)
- Designing data models that support complex relationships while maintaining referential integrity
- Implementing state machines for application status transitions
- Creating audit trails for compliance and debugging

### User Experience in Admin Panels
Building an admin panel that serves both technical and non-technical users:
- Creating intuitive interfaces that don't require training
- Implementing helpful tooltips and validation messages
- Designing workflows that prevent user errors (e.g., disabling certain fields based on status)
- Balancing feature richness with simplicity

### Performance Optimization
Managing a system that could handle hundreds of applications:
- Understanding database query optimization and N+1 problem prevention
- Implementing efficient filtering and search functionality
- Using Laravel's eager loading to reduce database queries
- Balancing real-time updates with server load

## Conclusion

The InvestED Portal successfully transformed a manual, error-prone application management process into an automated, scalable backend system. The platform handles the complete application lifecycle from API submission (via WordPress) to employment status tracking, providing value to all stakeholders: candidates benefit from seamless WordPress form integration, administrators have powerful tools to manage applications efficiently through the admin dashboard, and the organization benefits from data consistency and comprehensive audit trails.

The headless architecture - separating the WordPress frontend from the Laravel backend - proved to be an excellent design decision. This separation of concerns allowed frontend and backend developers to work independently while maintaining a clean API contract. The choice of Laravel for the backend and Filament for the admin dashboard proved ideal for rapid development while maintaining code quality and extensibility. The modular architecture allows for easy feature additions, and the comprehensive notification system ensures all parties stay informed throughout the process.

**Key Achievement**: Successfully built a robust backend system that seamlessly integrates with WordPress while providing a powerful, user-friendly admin dashboard for application management - all without requiring custom frontend development for the public-facing application form.