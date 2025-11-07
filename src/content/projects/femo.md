---
title: "FEMO - Influencer Marketing Platform"
description: "A comprehensive influencer marketing system connecting brands with content creators. Features job posting, bidding, social media integration, payment processing, and real-time messaging."
date: "2025-06-10"
draft: false
client: "Femo Malaysia"
projectOwner: "TriSquare Technology" 
role: "Full-Stack Developer"
techStack: ["Laravel 11", "PHP 8.2", "Filament 3.2", "Firebase", "JWT Auth", "Chip Payment Gateway", "OpenAI API", "TikTok API", "Instagram API", "Google Cloud Storage", "Laravel Reverb", "Tailwind CSS", "MySQL"]
projectURL: "https://apps.apple.com/my/app/femo-collab-create-dominate/id6743617250"
featuredImage: "femo.png"
screenshots: ["femo1.png", "femo2.png", "femo3.png", "femo4.png", "femo5.png"]
---

## Overview

FEMO is a comprehensive influencer marketing platform designed to bridge the gap between brands and content creators. The system facilitates seamless collaboration through job posting, bidding, social media integration, secure payment processing, and real-time communication. 

I collaborated on the full project lifecycle, handling project planning, backend architecture, API development, and deployment. The platform includes both a mobile application (developed by a collaborator) and a web-based admin panel built with Filament that replicates mobile app functionality for administrative purposes.

The platform addresses key challenges in influencer marketing:
- **Discovery**: Brands can easily discover influencers based on niche, engagement rates, and social media metrics
- **Collaboration**: Streamlined job posting, bidding, and proposal submission process
- **Verification**: Social media account integration for authentic profile verification
- **Payment Security**: Integrated payment gateway ensuring secure transactions
- **Communication**: Real-time messaging system for seamless brand-influencer communication

## Features

### User Management & Profiles
- **Dual User Types**: Separate profile systems for Influencers and Brands with role-based access
- **Profile Completion**: Comprehensive profile setup with validation and completion tracking
- **Social Media Integration**: Connect TikTok and Instagram accounts for profile verification
- **Analytics Dashboard**: Profile insights, engagement rates, and social media metrics tracking
- **Reviews & Ratings**: Two-way review system for both brands and influencers

### Job Management System
- **Job Posting**: Brands can create detailed job posts with budgets, deadlines, and content requirements
- **Job Items**: Break down jobs into multiple deliverables with individual budgets
- **Bidding System**: Influencers can submit competitive bids for open jobs
- **Proposal System**: Detailed proposal submission with AI-generated descriptions
- **Hire Management**: Direct hiring and collaboration request system
- **Job Tracking**: Complete activity logs, extensions, disputes, and status management
- **Private Jobs**: Support for private collaboration requests between brands and influencers

### Social Media Integration
- **TikTok OAuth**: Secure authentication and account linking
- **Instagram OAuth**: Facebook-based Instagram Business API integration
- **Video Syncing**: Automated synchronization of TikTok and Instagram videos
- **Social Insights**: Daily tracking of likes, comments, views, and engagement metrics
- **Analytics API**: Real-time social media analytics for profile verification

### Payment System
- **Chip Payment Gateway**: Integrated payment processing for both brands and influencers
- **Chip Collect**: Brands pay for jobs through multiple payment methods
- **Chip Send**: Automated bank transfers to influencers upon job completion
- **Payment Tracking**: Complete transaction history and payment status management
- **Platform Fees**: Configurable platform fees with automatic calculation
- **Escrow System**: Secure payment holding until job completion and approval

### Communication & Messaging
- **Real-time Messaging**: Firebase-powered messaging system between brands and influencers
- **File Attachments**: Support for media and document sharing in conversations
- **Push Notifications**: Firebase Cloud Messaging for instant notifications
- **Unread Counts**: Message notification tracking and management
- **Contact Management**: Suggested contacts and conversation history

### AI-Powered Features
- **Bio Generation**: OpenAI-powered bio generation with multiple style options
- **Job Description Generator**: AI-assisted job description creation
- **Proposal Generator**: Intelligent proposal description generation based on job requirements

### Admin Panel (Filament)
- **User Management**: Complete user administration with profile management
- **Job Oversight**: Monitor all jobs, bids, proposals, and hires
- **Transaction Management**: Track all payments and financial transactions
- **Content Management**: Manage FAQs, help support, announcements, and settings
- **Report Management**: Handle user reports and profile deletion requests
- **Analytics Dashboard**: System-wide analytics and insights

### Additional Features
- **Search & Discovery**: Advanced filtering by niche, industry, location, and engagement metrics
- **Favorites System**: Save favorite brands/influencers for quick access
- **Activity Logging**: Comprehensive activity tracking for profiles and jobs
- **Scheduled Jobs**: Automated tasks for video syncing, insights fetching, and payment releases
- **Document Templates**: Reusable document templates for agreements and deliverables
- **Postcode Integration**: Location-based services with postcode lookup

## Tech Stack

### Backend Framework
- **Laravel 11**: Modern PHP framework providing robust architecture, ORM, and built-in features
- **PHP 8.2**: Latest PHP version for optimal performance and modern language features

### Admin Panel
- **Filament 3.2**: Rapid admin panel development with beautiful UI components, reducing development time significantly while maintaining consistency with mobile app functionality

### Authentication & Security
- **JWT Auth**: Stateless authentication for mobile API using `php-open-source-saver/jwt-auth`
- **Laravel Socialite**: OAuth integration for social media platforms
- **Apple Sign-In**: Native Apple authentication support

### Real-time & Messaging
- **Firebase Realtime Database**: Real-time messaging infrastructure
- **Firebase Cloud Messaging**: Push notification service for mobile apps
- **Laravel Reverb**: WebSocket support for real-time features

### Payment Processing
- **Chip Payment Gateway**: Malaysian payment gateway supporting multiple payment methods (credit cards, e-wallets, bank transfers)
- **Chip Collect SDK**: For receiving payments from brands
- **Chip Send API**: For automated bank transfers to influencers

### AI Integration
- **OpenAI API**: GPT-powered content generation for bios, job descriptions, and proposals

### Social Media APIs
- **TikTok Open API**: User authentication, video listing, and analytics
- **Instagram Business API**: Media management, insights, and content publishing

### Storage & Infrastructure
- **Google Cloud Storage**: Scalable file storage for media and documents
- **MySQL**: Relational database for structured data
- **Laravel Queue**: Background job processing for async operations

### Frontend Technologies
- **Tailwind CSS**: Utility-first CSS framework for Filament admin panel
- **Alpine.js**: Lightweight JavaScript framework for interactive components
- **Vite**: Modern build tool for asset compilation

## Challenges & Solutions

### Challenge 1: Complex Job Workflow Management
**Problem**: Managing the lifecycle of jobs with multiple items, bids, proposals, hires, and submissions required complex state management.

**Solution**: Implemented a comprehensive job system with separate models for each stage (Job, JobItem, JobBid, JobProposal, JobHire, JobItemSubmission) and used Laravel's Eloquent relationships to maintain data integrity. Created activity logging system to track all job-related events.

### Challenge 2: Real-time Messaging Across Platforms
**Problem**: Ensuring seamless messaging between mobile app and web admin panel while maintaining real-time capabilities.

**Solution**: Integrated Firebase Realtime Database for messaging infrastructure, allowing both mobile and web clients to access the same data. Implemented Laravel-based message storage for persistence and added Firebase Cloud Messaging for push notifications.

### Challenge 3: Social Media API Rate Limits & Token Management
**Problem**: TikTok and Instagram APIs have strict rate limits and token expiration policies, requiring careful management.

**Solution**: Implemented background job queues for video syncing and insights fetching. Created token refresh mechanisms and stored access tokens securely. Added error handling and retry logic for API failures.

### Challenge 4: Payment Flow Complexity
**Problem**: Managing two-way payment flows (brands paying platform, platform paying influencers) with different fee structures and approval workflows.

**Solution**: Integrated Chip Collect for incoming payments and Chip Send for outgoing transfers. Created a comprehensive payment tracking system with status management. Implemented automated payment release jobs with approval workflows.

### Challenge 5: Admin Panel Feature Parity
**Problem**: Ensuring the Filament admin panel replicates all mobile app functionality for administrative purposes.

**Solution**: Built comprehensive Filament resources with relation managers for complex relationships. Created custom pages and widgets to match mobile app workflows. Implemented proper authorization and role-based access control.

### Challenge 6: Scalability & Performance
**Problem**: Handling large datasets for user discovery, job listings, and analytics without performance degradation.

**Solution**: Implemented database indexing on frequently queried fields. Used Laravel's query optimization techniques, eager loading to prevent N+1 queries, and caching for expensive operations like suggested contacts and trending lists.

## Key Learnings

1. **API Design**: Learned to design RESTful APIs that serve both mobile and web clients efficiently, ensuring consistent data structures and error handling.

2. **Third-party Integration**: Gained extensive experience integrating multiple third-party services (payment gateways, social media APIs, Firebase, OpenAI) and handling their unique authentication and error handling requirements.

3. **Real-time Systems**: Deepened understanding of real-time messaging architectures using Firebase, balancing between real-time updates and data persistence.

4. **Payment Processing**: Acquired knowledge of payment gateway integration, escrow systems, fee calculations, and automated payment workflows.

5. **Background Jobs**: Mastered Laravel's queue system for handling time-consuming tasks like video syncing, analytics fetching, and payment processing without blocking user requests.

6. **Admin Panel Development**: Learned to leverage Filament for rapid admin panel development while maintaining flexibility for custom requirements.

7. **Project Planning**: Gained experience in full project lifecycle management, from planning and architecture to deployment, collaborating with mobile developers to ensure seamless integration.

8. **Security Best Practices**: Implemented JWT authentication, OAuth flows, input validation, and secure file storage practices throughout the application.

## Conclusion

FEMO represents a comprehensive solution to the challenges in influencer marketing, providing a complete ecosystem for brands and creators to connect, collaborate, and transact securely. The project showcased the power of modern Laravel development combined with strategic third-party integrations to build a scalable, feature-rich platform.

The dual-platform approach (mobile app + web admin) required careful API design and consistent data structures, while the integration of multiple external services (payment gateways, social media APIs, Firebase, OpenAI) demonstrated the importance of robust error handling and asynchronous processing.

Key achievements include:
- Successfully deployed production-ready system handling real transactions
- Seamless integration between mobile app and backend APIs
- Comprehensive admin panel replicating mobile functionality
- Secure payment processing with automated workflows
- Real-time messaging and notification system
- Social media integration with automated content syncing

