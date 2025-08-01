# CryptoFi - PKR-to-Crypto Wallet & Remittance App

## Overview

CryptoFi is a regulated cryptocurrency wallet and cross-border remittance application designed for Pakistani users. The app enables seamless PKR-to-crypto conversions and instant international money transfers. Built with a mobile-first approach, it prioritizes simplicity, trust, and accessibility while supporting both English and Urdu languages with proper RTL (right-to-left) support.

The application follows a zero-friction onboarding philosophy, utilizing phone number verification, OCR for CNIC capture, and progressive KYC (Know Your Customer) processes. It bridges the trust gap in cryptocurrency through transparent fee structures, real-time transaction status updates, and clear compliance indicators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state and React Context for global state
- **Routing**: Wouter for lightweight client-side routing
- **Internationalization**: Custom i18n implementation supporting English and Urdu with RTL layout support

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with structured error handling and request logging
- **Development**: Hot module replacement via Vite integration in development mode

### Data Storage Solutions
- **ORM**: Drizzle ORM with type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database via connection string)
- **Schema**: Comprehensive schema supporting users, balances, transactions, recipients, and exchange rates
- **Development Storage**: In-memory storage implementation for development/demo purposes
- **Migrations**: Drizzle Kit for database schema management

### Authentication and Authorization
- **Primary Method**: Phone number + OTP verification
- **Session Management**: Token-based authentication with local storage persistence
- **KYC Integration**: Tiered verification system (Basic → Enhanced → Premium)
- **CNIC Verification**: OCR-based document capture with quality feedback
- **Biometric Support**: Planned integration for enhanced security

### Mobile-First Design Principles
- **Touch Targets**: Minimum 44px touch areas for accessibility
- **Progressive Disclosure**: Complex features hidden behind simple interfaces
- **Responsive Layout**: Mobile-first with seamless desktop scaling
- **Performance**: Optimized for low-bandwidth networks and slower devices
- **Accessibility**: WCAG-compliant contrast ratios and screen reader support

### Core Features Implementation
- **Onboarding Flow**: Phone verification → CNIC capture → Selfie verification → Account setup
- **Wallet Management**: Multi-currency balance display with privacy toggle
- **Money Transfer**: International and domestic send with recipient management
- **Currency Exchange**: Real-time rates with transparent fee breakdown
- **Transaction History**: Comprehensive activity tracking with status updates

### Security and Compliance
- **Regulatory Compliance**: Built for SBP (State Bank of Pakistan) regulations
- **Data Protection**: Secure data handling with encryption best practices
- **Transaction Security**: Multi-factor verification for high-value transfers
- **Anti-Fraud**: Real-time transaction monitoring and risk assessment

## External Dependencies

### Core Framework Dependencies
- **@vitejs/plugin-react**: React integration for Vite build system
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for single-page application navigation

### UI and Styling
- **@radix-ui/**: Comprehensive suite of accessible UI primitives including dialogs, dropdowns, forms, and navigation components
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional CSS class composition utility

### Database and Backend
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **drizzle-zod**: Schema validation integration
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Tools
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Utility Libraries
- **zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting
- **nanoid**: Secure URL-friendly unique ID generator
- **express**: Web application framework for Node.js backend

### Future Integration Points
- **SMS Service**: For OTP delivery (Twilio, AWS SNS, or local providers)
- **OCR Service**: Document processing for CNIC verification
- **Payment Gateways**: Bank integration for PKR deposits/withdrawals
- **Blockchain Services**: Cryptocurrency transaction processing
- **Exchange Rate APIs**: Real-time currency conversion rates
- **Compliance APIs**: KYC/AML verification services