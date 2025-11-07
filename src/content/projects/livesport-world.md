---
title: "LiveSport World - Sports Data Analytics Platform"
description: "A comprehensive sports data management platform backend built with Laravel, featuring multi-sport data tracking, real-time odds management, payment gateway integrations, and advanced analytics. Enhanced with basketball and tennis data modules, payment integrations, and admin dashboard improvements."
date: "2025-08-29"
draft: true
role: "Full-Stack Backend Developer (Laravel)"
projectOwner: "TriSquare Technology"
password: "livesport"  # Password to access this protected project
techStack: ["Laravel", "PHP 8.0+", "MySQL", "Redis", "WebSockets", "JWT Authentication", "RESTful API", "Queue System"]
---

## Overview

LiveSport World is a comprehensive sports data management platform backend that enables real-time tracking and analysis of multiple sports including football, basketball, and tennis. The platform features real-time odds tracking, advanced analytics capabilities, multiple payment gateways, and an advanced admin dashboard for managing operations.

I joined this project halfway through its lifecycle, after the initial launch. My primary responsibility was to implement new features, enhance existing functionality, and fix critical bugs to improve platform stability and user experience. The project was already handling football data, and I was tasked with expanding the platform's capabilities to include basketball and tennis data modules, integrating fiat payment gateways for multiple currencies, and building advanced analytics for the admin dashboard.

## My Role & Contribution

I joined the project as a **Full-Stack Backend Developer (Laravel)** after the initial launch. The platform was already operational with football data capabilities, but needed significant enhancements to expand its market reach and improve operational efficiency. 

**My Responsibilities:**
- **Full Backend Development**: Complete Laravel backend development, API design, and database optimization
- **Deployment & DevOps**: Server deployment on Ultahost, infrastructure management, and CI/CD pipeline setup
- **Cloud Infrastructure**: Google Cloud Tasks integration for automated data processing, AWS CloudFront for frontend CDN
- **System Optimization**: Job queue optimization, odds syncing improvements, and performance enhancements
- **Feature Development**: Expanding data capabilities to new sports (basketball and tennis)
- **Payment Integration**: Integrating fiat payment gateways for multiple currencies (MYR, CNY, EUR)
- **Analytics Development**: Building advanced analytics for the admin dashboard
- **Bug Fixes & Maintenance**: Fixing critical bugs and improving system stability

**Key Contributions:**
- **Expanding data capabilities** to new sports (basketball and tennis)
- **Integrating fiat payment gateways** for multiple currencies (MYR, CNY, EUR)
- **Building advanced analytics** for the admin dashboard
- **Optimizing job queues** and background processing systems
- **Improving odds synchronization** performance and reliability
- **Implementing Google Cloud Tasks** for automated data processing
- **Setting up deployment infrastructure** on Ultahost with AWS CloudFront
- **Fixing critical bugs** and improving system stability

## Features Implemented

### 1. Basketball Data Management System

Implemented a complete basketball data module that mirrors the football data architecture while accommodating basketball-specific requirements.

**Key Components:**
- **Data Controller** (`app/Http/Controllers/API/Basketball/BettingController.php`): Handles all basketball data operations
- **Match Management**: Integration with basketball match data from external APIs
- **Odds System**: Support for European odds, Asian handicap, and over/under calculations
- **Data Types**: Single selections, multi-selections, handicap calculations, and total points tracking
- **Real-time Updates**: WebSocket integration for live odds and match updates

**Technical Implementation:**
- Created dedicated routes in `routes/basketball.api.php`
- Implemented European single and multi-selection processing methods
- Built handicap and over/under calculation systems with proper commission calculations
- Integrated with existing user account system
- Added match validation to prevent data processing after match start
- Implemented odds change detection and validation

**Database Structure:**
- `bb_matches` table for basketball matches
- `bb_teams` table for team information
- `bb_leagues` table for league management
- Separate odds tables for European, handicap, and over/under odds

### 2. Tennis Data Management System

Developed a comprehensive tennis data system that handles the unique aspects of tennis scoring and data management.

**Key Components:**
- **Sport-based Architecture**: Integrated into the V2 sports management system
- **Data Types**: Match winner tracking, games handicap calculations, and total games (over/under)
- **Point-by-Point Tracking**: Real-time match data processing for accurate result calculation
- **Auto-processing Support**: Automated odds analysis for tennis matches
- **Match Result Processing**: Complex logic for handling tennis-specific outcomes

**Technical Implementation:**
- Created tennis-specific data processing in `app/Console/Commands/SyncV2UserBetCommand.php`
- Implemented games difference calculation for handicap calculations
- Built total games calculation for over/under calculations
- Added support for partial refunds on quarter-point handicaps
- Integrated with SportDevs API for match data
- Created auto-processing jobs (`TennisAutoBetScanning.php`, `TennisArbGameJobV2.php`)

**Unique Challenges:**
- Tennis uses "games" instead of "goals" for scoring
- Handicap calculations require different calculation logic
- Point-by-point data processing for accurate result calculation
- Integration with existing football/basketball architecture

### 3. Fiat Payment Gateways

Integrated multiple fiat payment gateways to support different regional markets and currencies.

#### Spayz Payment Gateway (MYR - Malaysian Ringgit)
- **Multi-country Support**: Thailand, Malaysia, South Korea, India, Bangladesh, Indonesia, Vietnam, Pakistan, Japan, Kazakhstan, Uzbekistan
- **Payment Methods**: Online banking, QR codes, DuitNow, TNG, P2P, UPI, IMPS, Nagad, Bkash, OVO, MoMo, ZaloPay, ViettelPay, Jazz Cash, EasyPaisa
- **Implementation**: `app/Http/Controllers/SpayzController.php` and `app/Services/SpayzService.php`
- **Features**: Deposit and withdrawal support, webhook processing, admin approval workflow

#### China FPX Payment Gateway (CNY - Chinese Yuan)
- **Channel-based System**: Different channels for different amount ranges (200-500 CNY and 500-10000 CNY)
- **Implementation**: `app/Http/Controllers/ChinaFpxController.php` and `app/Services/ChinaFpxService.php`
- **Features**: Secure signature-based authentication, deposit and withdrawal support, channel routing based on amount
- **Security**: MD5 signature verification for all transactions

#### RAMP Payment Gateway (EUR - Euro)
- **European Market Focus**: Supports European countries using EUR currency
- **Payment Methods**: Visa/MasterCard, Apple Pay, Google Pay, Neteller, Skrill
- **Implementation**: Integrated into AmoPay system with RAMP provider
- **Merchant Flow**: Onramp (fiat to crypto) and offramp (crypto to fiat) support
- **Features**: JWT-based authentication, webhook processing, merchant wallet integration

**Common Features Across All Gateways:**
- Webhook processing for payment status updates
- Admin approval workflow for withdrawals
- Transaction logging and audit trails
- Error handling and retry mechanisms
- Integration with existing deposit/withdrawal system

### 4. Advanced Analytics in Admin Dashboard

Built comprehensive analytics features to help administrators monitor platform performance and make data-driven decisions.

**Key Analytics Features:**

#### Commission Analytics
- **Daily/Monthly Commission Tracking**: Real-time commission calculations
- **Commission by Transaction Type**: Breakdown of commissions by single, multi, and analysis transactions
- **Top Sports by Commission**: Identify most profitable sports
- **Commission Trends**: Historical data visualization over time periods

#### Transaction Statistics
- **Sport-specific Analytics**: Detailed statistics for football, basketball, and tennis
- **Transaction Volume Tracking**: Total transactions processed, amounts processed, payouts distributed
- **User Activity Metrics**: Active users, transaction frequency, average transaction size
- **Performance Ratios**: Track platform performance across different transaction types

#### Risk Management
- **High-Risk Transaction Detection**: Identify unusually large amounts or high-odds transactions
- **Risk Alerts**: Automated alerts for suspicious transaction patterns
- **Sport-specific Risk Management**: Tailored risk controls for each sport
- **User Risk Profiling**: Track user transaction behavior and patterns

**Implementation:**
- `app/Http/Controllers/Admin/BettingManagementController.php`: Main analytics controller
- `app/Http/Controllers/Admin/HomeController.php`: Dashboard statistics
- `app/Http/Controllers/Admin/AnalyticsController.php`: Analytics page controller
- Real-time data aggregation using Laravel's query builder
- Efficient database queries with proper indexing

### 5. Job Queue & Background Processing Optimization

Optimized the entire job queue system to handle high-volume background processing efficiently.

**Key Optimizations:**

#### Job Architecture Improvements
- **Batched Processing**: Implemented chunking for large datasets (90 matches per batch)
- **Queue Prioritization**: Created separate queues for different job types (default, match_arb_log, high-priority)
- **Job Timeout Management**: Set appropriate timeouts (1 hour for heavy jobs, 5 minutes for light jobs)
- **Retry Logic**: Implemented exponential backoff for failed jobs
- **Unique Job Constraints**: Used `ShouldBeUnique` interface to prevent duplicate job execution
- **Job Batching**: Created `SyncMatchOddsBatchedJob` for efficient odds synchronization

#### Performance Improvements
- **Database Query Optimization**: Reduced N+1 queries in job processing
- **Memory Management**: Optimized memory usage for large data processing
- **Concurrent Processing**: Enabled parallel job execution where safe
- **Queue Worker Scaling**: Configured multiple queue workers for different job types

**Job Types Optimized:**
- `SyncOddsJob`: Optimized odds synchronization with batching
- `SyncMatchOddsBatchedJob`: Batched odds processing for better performance
- `ArbGameJobV2`: Optimized odds analysis scanning
- `TennisAutoBetScanning`: Efficient tennis auto-processing job
- `AutoBetMatchScanning`: Football/basketball auto-processing optimization
- `SyncMatchesJob`: Match synchronization with pagination
- `SyncLeaguesJob`, `SyncTeamsJob`: League and team sync optimization

### 6. Odds Synchronization Optimization

Significantly improved the odds synchronization system for better performance and reliability.

**Optimization Strategies:**

#### Batching & Chunking
- **Match Chunking**: Process matches in chunks of 90 to avoid memory issues
- **API Rate Limiting**: Implemented intelligent rate limiting to respect external API limits
- **Incremental Updates**: Only sync changed odds instead of full refresh
- **Selective Syncing**: Sync only active matches within configurable date range

#### Performance Enhancements
- **Database Indexing**: Added proper indexes on match_id, company_id, and odds_type
- **Bulk Operations**: Used `updateOrCreate` for efficient database operations
- **Caching Strategy**: Implemented Redis caching for frequently accessed odds
- **Parallel Processing**: Enabled concurrent odds sync for different match sets

#### Real-time Updates
- **WebSocket Broadcasting**: Real-time odds updates via WebSocket events
- **Event-Driven Architecture**: Odds changes trigger events for immediate frontend updates
- **Change Detection**: Only broadcast when odds actually change
- **Debouncing**: Prevent excessive updates during rapid odds changes

**Technical Implementation:**
- `app/Jobs/SyncOdds.php`: Main odds synchronization job
- `app/Jobs/SportDevs/SyncMatchOddsJob.php`: Single match odds sync
- `app/Jobs/SportDevs/SyncMatchOddsBatchedJob.php`: Batched odds sync
- `app/Http/Controllers/APIController.php`: Odds sync controller with optimization
- `app/Services/SportDevsService.php`: Service layer for odds processing

### 7. Google Cloud Tasks Integration

Implemented Google Cloud Tasks for reliable, scalable automated data processing.

**Implementation Details:**
- **Cloud Task Helper**: Created `app/CloudTaskLibrary/CloudTaskHelper.php` for task management
- **Auto-Processing**: Automated odds analysis processing via Cloud Tasks
- **Task Queue**: Configured `livesport-world-autobet-queue` in Google Cloud
- **Worker Integration**: Tasks dispatched to worker endpoints for data execution
- **Error Handling**: Comprehensive error handling and retry mechanisms
- **Task Management**: Task creation, deletion, and monitoring capabilities

**Use Cases:**
- **Tennis Auto-Processing**: Automated tennis odds analysis processing
- **Football/Basketball Auto-Processing**: Automated data scanning and processing
- **Scheduled Tasks**: Time-based processing for optimal odds

**Technical Features:**
- JWT-based authentication for worker endpoints
- Task ID tracking for monitoring
- Automatic retry on failure
- Task scheduling with configurable delays
- Queue monitoring and management

### 8. Deployment & Infrastructure

Managed complete deployment and infrastructure setup for the platform.

#### Ultahost Server Deployment
- **Server Configuration**: Set up and configured Laravel application on Ultahost
- **Database Setup**: MySQL database configuration and optimization
- **Queue Workers**: Configured multiple queue workers for background job processing
- **Cron Jobs**: Set up scheduled tasks for data synchronization
- **SSL Configuration**: HTTPS setup and certificate management
- **Environment Management**: Production, staging, and development environment configuration

#### AWS CloudFront Integration
- **Frontend CDN**: Configured AWS CloudFront for frontend asset delivery
- **Caching Strategy**: Optimized cache policies for static assets
- **Global Distribution**: Improved load times for international users
- **SSL/TLS**: Secure content delivery with CloudFront certificates

#### Infrastructure Management
- **Monitoring**: Set up application and server monitoring
- **Logging**: Centralized logging system for debugging and monitoring
- **Backup Strategy**: Database and file backup procedures
- **Security**: Server hardening and security best practices
- **Scalability**: Infrastructure designed for horizontal scaling

### 9. Bug Fixes & System Improvements

Addressed numerous critical bugs and performance issues throughout the development process:

- **Result Processing Issues**: Fixed incorrect result processing logic for various transaction types
- **Payment Gateway Errors**: Resolved webhook processing issues and transaction failures
- **Odds Synchronization**: Fixed real-time odds update problems and improved sync reliability
- **Database Performance**: Optimized queries and added proper indexing
- **API Rate Limiting**: Implemented rate limiting to prevent abuse
- **Error Handling**: Improved error handling and logging across the system
- **Security Fixes**: Addressed security vulnerabilities in authentication and payment processing
- **Job Failures**: Fixed job queue failures and improved retry mechanisms
- **Memory Leaks**: Resolved memory issues in long-running jobs

## Tech Stack

### Backend Framework
- **Laravel 9.x**: Modern PHP framework providing robust architecture
- **PHP 8.0+**: Latest PHP features for better performance
- **MySQL**: Relational database for structured data storage
- **Redis**: Caching and session management

### Key Libraries & Services
- **JWT Authentication** (`tymon/jwt-auth`): Secure API authentication
- **WebSockets** (`beyondcode/laravel-websockets`): Real-time communication
- **Queue System**: Background job processing for heavy operations
- **Google Cloud Tasks** (`google/cloud-tasks`): Reliable task scheduling and execution
- **Guzzle HTTP**: External API integration
- **Laravel Auditing** (`owen-it/laravel-auditing`): Activity logging
- **DomPDF**: PDF generation for reports
- **PhpSpreadsheet**: Excel file processing

### Infrastructure & Deployment
- **Ultahost**: Production server hosting and management
- **AWS CloudFront**: CDN for frontend asset delivery
- **Google Cloud Platform**: Cloud Tasks for automated data processing
- **MySQL**: Primary database with optimized configuration
- **Redis**: Caching and session management
- **Queue Workers**: Multiple workers for different job types

### Architecture Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Event-Driven**: Real-time updates via events and broadcasts
- **RESTful API**: Standard API design for frontend integration
- **Job Queue**: Asynchronous processing for heavy tasks

## Challenges & Solutions

### Challenge 1: Integrating Multiple Sports with Different Rules
**Problem**: Basketball and tennis have different scoring systems and data management rules compared to football. Tennis uses "games" instead of "goals," and basketball has different match structures.

**Solution**: 
- Created sport-specific models and controllers while maintaining a unified data interface
- Implemented sport-specific calculation methods for result processing
- Used polymorphism in the UserBets model to handle different sport types
- Created a flexible odds system that adapts to each sport's requirements

### Challenge 2: Payment Gateway Integration Complexity
**Problem**: Each payment gateway (Spayz, China FPX, RAMP) had different APIs, authentication methods, and webhook formats. Some required signature verification, others used JWT tokens.

**Solution**:
- Created separate service classes for each gateway (`SpayzService`, `ChinaFpxService`, `AmoPayService`)
- Implemented a unified interface for deposit/withdrawal operations
- Built robust webhook processing with proper signature verification
- Created comprehensive error handling and retry mechanisms
- Implemented admin approval workflows for security

### Challenge 3: Real-time Odds Synchronization
**Problem**: Odds change frequently during live matches, and users could process transactions on outdated odds, leading to disputes.

**Solution**:
- Implemented odds validation before transaction processing
- Added timestamp checks to prevent processing after match start
- Created odds change detection mechanisms
- Built WebSocket broadcasting for real-time odds updates
- Implemented odds locking during transaction processing

### Challenge 4: Performance Optimization for Analytics
**Problem**: Generating analytics reports was slow due to large datasets and complex queries.

**Solution**:
- Optimized database queries with proper indexing
- Implemented query result caching using Redis
- Used Laravel's query builder efficiently with selectRaw for aggregations
- Created scheduled jobs for pre-calculating common statistics
- Implemented pagination for large result sets

### Challenge 5: Handling Odds Analysis Logic
**Problem**: Odds analysis requires complex calculations to ensure accurate predictions, and odds can change during the calculation process.

**Solution**:
- Implemented atomic transaction processing with database transactions
- Created validation mechanisms before transaction acceptance
- Built odds snapshot mechanism to lock odds during calculation
- Implemented commission calculations that maintain profitability
- Added rate limiting to prevent abuse

### Challenge 6: Job Queue Performance & Scalability
**Problem**: Background jobs were taking too long, causing delays in odds synchronization and transaction processing. Some jobs were timing out or failing due to memory issues.

**Solution**:
- Implemented job batching and chunking for large datasets
- Created separate queues for different job priorities
- Optimized database queries within jobs to reduce execution time
- Added proper indexing for frequently queried tables
- Implemented job timeout management and retry logic
- Used Google Cloud Tasks for critical auto-processing operations
- Optimized memory usage by processing data in smaller chunks

### Challenge 7: Odds Synchronization Performance
**Problem**: Odds synchronization was slow and sometimes missed updates, leading to stale odds data and user complaints.

**Solution**:
- Implemented batched odds synchronization (`SyncMatchOddsBatchedJob`)
- Created incremental update mechanism to only sync changed odds
- Added intelligent rate limiting to respect external API limits
- Implemented parallel processing where safe
- Added proper database indexing for faster queries
- Created WebSocket broadcasting for real-time odds updates
- Implemented change detection to avoid unnecessary updates

### Challenge 8: Deployment & Infrastructure Management
**Problem**: Managing deployments, server configuration, and ensuring high availability across different environments.

**Solution**:
- Set up structured deployment process on Ultahost
- Configured multiple queue workers for different job types
- Implemented AWS CloudFront for frontend CDN to improve global performance
- Set up monitoring and logging systems
- Created backup and recovery procedures
- Configured environment-specific settings
- Implemented Google Cloud Tasks for reliable task execution

## Key Learnings

### Technical Learnings

1. **Multi-Sport Architecture**: Learned how to design flexible systems that can accommodate different sports with varying rules while maintaining code reusability.

2. **Payment Gateway Integration**: Gained deep understanding of integrating multiple payment providers, handling webhooks, signature verification, and managing transaction states.

3. **Real-time Systems**: Learned to implement real-time features using WebSockets, event broadcasting, and queue systems for handling high-frequency updates.

4. **Database Optimization**: Improved skills in query optimization, indexing strategies, and handling large datasets efficiently.

5. **API Design**: Enhanced understanding of RESTful API design, authentication patterns, and versioning strategies.

6. **Job Queue Optimization**: Learned advanced techniques for optimizing background job processing, including batching, chunking, and queue prioritization.

7. **Cloud Infrastructure**: Gained experience with Google Cloud Tasks for reliable task execution and AWS CloudFront for CDN management.

8. **Deployment & DevOps**: Learned server management, deployment strategies, and infrastructure setup on Ultahost and cloud platforms.

9. **Performance Optimization**: Improved skills in identifying and resolving performance bottlenecks in high-traffic applications.

### Process Learnings

1. **Working with Legacy Code**: Learned to navigate and enhance existing codebases while maintaining backward compatibility.

2. **Incremental Development**: Understood the importance of implementing features incrementally and testing thoroughly at each stage.

3. **Documentation**: Recognized the value of comprehensive documentation, especially when working with complex integrations like payment gateways.

4. **Error Handling**: Improved error handling strategies, logging, and debugging techniques for production systems.

5. **Security Best Practices**: Gained experience implementing security measures for financial transactions and user data protection.

## Technical Highlights

### Code Quality
- Followed Laravel best practices and PSR standards
- Implemented comprehensive error handling
- Created reusable service classes
- Maintained clean code architecture

### Scalability
- Designed for horizontal scaling with queue workers
- Implemented caching strategies for performance
- Optimized database queries for large datasets
- Used efficient data structures and algorithms
- Google Cloud Tasks for distributed task execution
- AWS CloudFront for global content delivery
- Multiple queue workers for parallel processing
- Job batching and chunking for efficient resource usage

### Security
- JWT-based authentication
- Webhook signature verification
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on sensitive endpoints

## Conclusion

Working on LiveSport World was a challenging and rewarding experience. I successfully expanded the platform's capabilities by adding basketball and tennis data modules, integrated multiple fiat payment gateways, and built comprehensive analytics features. The project taught me valuable lessons about working with complex systems, integrating third-party services, and building scalable backend architectures.

The platform now supports three major sports, multiple payment methods across different currencies, and provides administrators with powerful analytics tools to monitor and optimize operations. All features were implemented with a focus on security, performance, and maintainability.

---

**Project Status**: ✅ Production-ready with continuous improvements
**My Contribution**: Full backend development (Laravel), feature implementation, job optimization, odds syncing improvements, deployment management (Ultahost), Google Cloud Tasks integration, AWS CloudFront setup, bug fixes, and system optimization
