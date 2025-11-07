---
title: "TNB Subsidiary Management Dashboard (SMD) - UI Redesign & Integration"
description: "Comprehensive UI rework and backend integration for TNB's Subsidiary Management Dashboard, transforming the interface based on modern Figma designs while maintaining robust data management capabilities."
date: "2025-06-19"
draft: false
role: "Full-Stack Developer"
client: "Universiti Tenaga Nasional (UNITEN)"
projectOwner: "TriSquare Technology"
techStack: ["Laravel 11", "PHP 8.2", "Blade Templates", "Bootstrap 5", "Chart.js", "Vite", "JavaScript", "SCSS", "MySQL"]
featuredImage: "tnb-smd.png"
---

## Overview

The TNB Subsidiary Management Dashboard (SMD) is a comprehensive enterprise application designed to manage and monitor subsidiaries, financial performance, ESG metrics, risk management, HSE (Health, Safety, Environment) data, and governance oversight for Tenaga Nasional Berhad. This project involved a complete UI redesign based on modern Figma designs provided by the design team, followed by extensive backend controller updates and seamless integration with the new Blade UI components.

The application serves as a centralized platform for tracking subsidiary performance, board governance, financial metrics, ESG compliance, and operational oversight across TNB's portfolio of companies. The redesign focused on improving user experience, data visualization, and overall interface aesthetics while maintaining the robust functionality required for enterprise-level data management.

## Project Scope

### Primary Focus Areas

1. **UI/UX Redesign**: Complete transformation of the user interface based on Figma design specifications
2. **Controller Method Updates**: Refactoring and updating backend controllers to support new UI components and data flows
3. **Blade Template Integration**: Seamless integration of new Blade UI components with existing Laravel architecture
4. **Dashboard Modernization**: Redesign of multiple dashboard views including visual, workbench, and data entry interfaces

## Features

### Dashboard Modules

- **Home Dashboard**: Comprehensive overview with financial metrics, board governance, HSE data, greenhouse gas emissions, and oversight timeline
- **TNB Dashboard**: High-level organizational overview
- **Subsidiaries Dashboard**: 
  - Visual representation of subsidiary relationships
  - Workbench for detailed subsidiary management
  - Tree view for hierarchical structure visualization
  - Matrix view for cross-referencing data
- **Financial Performance Dashboard**: Visual and workbench views for financial data analysis
- **ESG Dashboard**: 
  - Visual dashboard for ESG metrics
  - Workbench for detailed ESG data entry and analysis
  - Data maturity tracking
  - CO₂ equivalent calculations
  - Internal MSCI equivalent metrics
  - One-pager summary views
- **Risk Management Dashboard**: Visual and workbench interfaces for risk tracking and management
- **HSE Dashboard**: Health, Safety, and Environment metrics visualization and management
- **Oversight Dashboard**: Governance and oversight tracking with visual and workbench views

### Data Entry Modules

- **Subsidiary Management**: Create, edit, and manage subsidiary information with tree and matrix views
- **Directorship Management**: Track directors and their appointments across subsidiaries
- **Financial Year Management**: Manage financial periods and associated data
- **ESG Data Entry**: 
  - Materiality assessment and tracking
  - ESG elements management (active year and all-year views)
- **HSE Data Entry**: Health, safety, and environment incident tracking
- **Risk Management**: Active risk tracking and management
- **Oversight Management**: Assurance and audit oversight tracking
- **User & Role Management**: Comprehensive user administration with role-based permissions

### Key Functionalities

- **Role-Based Access Control**: Implemented using Spatie Laravel Permission package
- **Audit Logging**: Complete audit trail using Laravel Auditing package
- **Data Export**: PDF and Excel export capabilities for reports and matrices
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Interactive Charts**: Chart.js integration for data visualization
- **Real-time Data Filtering**: Year-based and cluster-based filtering across dashboards

## Tech Stack

### Backend
- **Laravel 11**: Modern PHP framework providing robust MVC architecture
- **PHP 8.2**: Latest PHP version for optimal performance
- **MySQL**: Relational database for data persistence
- **Spatie Laravel Permission**: Role and permission management
- **Laravel Auditing**: Comprehensive audit trail functionality
- **Maatwebsite Excel**: Excel import/export capabilities
- **DomPDF**: PDF generation for reports

### Frontend
- **Blade Templates**: Laravel's templating engine for server-side rendering
- **Bootstrap 5**: Responsive CSS framework for layout and components
- **Chart.js**: Interactive chart library for data visualization
- **Vite**: Modern build tool for asset compilation
- **SCSS**: CSS preprocessor for maintainable stylesheets
- **JavaScript/jQuery**: Client-side interactivity
- **Inter Font**: Modern typography for improved readability

### Development Tools
- **Vite**: Fast build tool replacing Laravel Mix
- **Laravel UI**: Authentication scaffolding
- **Composer**: PHP dependency management

## Implementation Details

### UI Redesign Process

1. **Design Analysis**: Reviewed Figma designs to understand the new visual language, component structure, and user flow
2. **Component Mapping**: Identified existing Blade components and mapped them to new design requirements
3. **Style System**: Implemented consistent color palette, typography (Inter font), spacing, and component styling
4. **Layout Restructuring**: Redesigned dashboard layouts with modern card-based designs, improved spacing, and better visual hierarchy
5. **Responsive Implementation**: Ensured all views work seamlessly across desktop, tablet, and mobile devices

### Controller Updates

- **DashboardController**: Enhanced with new methods for visual and workbench views across all modules
- **SubsidiaryController**: Updated to support new UI components, tree views, and matrix exports
- **Data Entry Controllers**: Refactored to work with new form layouts and data entry interfaces
- **Filtering & Query Optimization**: Improved data fetching methods to support new filtering and visualization requirements

### Key UI Components Implemented

- **Modern Card Designs**: Redesigned dashboard cards with improved shadows, borders, and spacing
- **Interactive Charts**: Integrated Chart.js with custom styling matching design specifications
- **Responsive Sidebar**: Collapsible sidebar navigation with mobile-friendly behavior
- **Data Tables**: Modern table designs with improved readability and responsive behavior
- **Form Components**: Updated form inputs, selects, and buttons to match design system
- **Metric Displays**: Redesigned metric cards with icons, gradients, and improved typography
- **Timeline Components**: Visual timeline displays for oversight tracking

## Challenges & Solutions

### Challenge 1: Maintaining Backward Compatibility
**Problem**: Updating UI while ensuring existing functionality remained intact.

**Solution**: 
- Incremental migration approach, updating one module at a time
- Comprehensive testing after each update
- Preserved existing data structures and relationships
- Maintained API compatibility for existing integrations

### Challenge 2: Complex Data Relationships
**Problem**: The application manages complex relationships between subsidiaries, directors, financial years, and various metrics.

**Solution**:
- Leveraged Laravel's Eloquent ORM relationships effectively
- Implemented eager loading to optimize queries
- Created helper methods for complex data aggregations
- Used database transactions for data integrity

### Challenge 3: Responsive Design Implementation
**Problem**: Ensuring the new design works seamlessly across all device sizes while maintaining functionality.

**Solution**:
- Mobile-first approach with progressive enhancement
- Flexible grid layouts using Bootstrap 5
- Custom media queries for specific breakpoints
- Touch-friendly interface elements for mobile devices
- Collapsible sidebar with smooth transitions

### Challenge 4: Performance Optimization
**Problem**: Dashboard views loading large datasets affecting performance.

**Solution**:
- Implemented query optimization with eager loading
- Added pagination where appropriate
- Lazy loading for charts and heavy components
- Caching strategies for frequently accessed data
- Optimized asset compilation with Vite

### Challenge 5: Design-to-Code Translation
**Problem**: Accurately translating Figma designs to functional Blade templates while maintaining design fidelity.

**Solution**:
- Close collaboration with design team for clarification
- Created reusable Blade components for consistency
- Used CSS custom properties for design tokens
- Implemented design system with consistent spacing and typography scales
- Regular design reviews to ensure accuracy

## Key Learnings

1. **Design System Implementation**: Learned the importance of establishing a consistent design system early in the project, which significantly improved development speed and UI consistency.

2. **Laravel Blade Best Practices**: Gained deeper understanding of Blade component architecture, partials, and layout inheritance, enabling more maintainable template structures.

3. **Performance Optimization**: Discovered the importance of query optimization and eager loading in Laravel, especially when dealing with complex relationships and large datasets.

4. **Responsive Design Patterns**: Enhanced skills in creating truly responsive interfaces that work seamlessly across devices, not just mobile breakpoints.

5. **Chart.js Integration**: Learned advanced Chart.js customization techniques to match design specifications while maintaining interactivity and performance.

6. **Version Control for UI Changes**: Understood the importance of incremental commits and feature branches when making extensive UI changes across multiple files.

7. **Collaboration with Designers**: Improved communication skills in translating design requirements into functional code while maintaining design integrity.

8. **Laravel 11 Features**: Explored and implemented new features in Laravel 11, including improved routing, service providers, and middleware capabilities.

## Technical Highlights

- **Modern UI/UX**: Transformed the interface from a traditional enterprise application to a modern, visually appealing dashboard
- **Component Reusability**: Created reusable Blade components reducing code duplication
- **Accessibility**: Improved keyboard navigation and screen reader compatibility
- **Data Visualization**: Enhanced chart implementations with custom styling and interactivity
- **Export Functionality**: Implemented PDF and Excel export features for various reports
- **Audit Trail**: Comprehensive audit logging for data changes and user actions
- **Security**: Role-based access control ensuring users only access appropriate data and features

## Conclusion

The TNB SMD UI redesign project successfully transformed the application's user interface while maintaining and enhancing its robust backend functionality. The project demonstrated the importance of close collaboration between design and development teams, incremental implementation strategies, and maintaining code quality during extensive refactoring.

The new interface provides a significantly improved user experience with modern design patterns, better data visualization, and responsive layouts. The updated controller methods and Blade integration ensure the application remains maintainable and scalable for future enhancements.
