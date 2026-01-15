# Lisbon Wine Routes - Personalized Wine Tourism Guide

## Overview

This is a wine tourism itinerary generator for the Lisbon region of Portugal. Users complete an interactive quiz about their preferences (duration, budget, travel style, wine preferences), and the system generates a personalized PDF itinerary with winery visits, restaurants, and activities. The platform includes a freemium model with a Pro upgrade option (€29) for more detailed itineraries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React Context for language/i18n
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under /api/ prefix
- **PDF Generation**: PDFKit for creating downloadable itinerary PDFs

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Tables**: users, payment_sessions, pro_requests
- **Migrations**: Drizzle Kit with migrations in /migrations folder

### Payment Integration
- **Provider**: Stripe for checkout sessions and webhooks
- **Webhook Handling**: Raw body parsing for Stripe signature verification
- **Flow**: Quiz → Itinerary Preview → Stripe Checkout → PDF Download

### Internationalization
- **Languages**: Portuguese (default), English, Spanish, German
- **Implementation**: Custom i18n system in client/src/lib/i18n.ts
- **Context**: LanguageContext provides t() translation function

### Key User Flows
1. Landing page with hero, value proposition, and how-it-works sections
2. 11-step quiz collecting travel preferences
3. AI-generated itinerary display with booking affiliate links
4. Stripe payment for PDF download
5. Pro upsell banner throughout the flow linking to /pro comparison page

## External Dependencies

### Third-Party Services
- **Stripe**: Payment processing (checkout sessions, webhooks)
- **Neon Database**: Serverless PostgreSQL hosting

### Affiliate Integrations
- **Winalist**: Wine experience bookings (hosts/{id}/{slug} format with UTM tracking, Google Maps fallback)
- **GetYourGuide**: Tours and activities
- **Booking.com**: Accommodation via AWIN (awinmid=18120, awinaffid=1914530, properly encoded ued parameter)
- **DiscoverCars**: Car rental (fixed link: discovercars.com/pt?a_aid=lisbonwineroutes)

### Affiliate Link Implementation (shared/affiliateLinks.ts)
- **WINALIST_URL_MAP**: Maps winery keys to real Winalist URLs
- **resolveWinalistUrl()**: Returns real URL or Google Maps fallback with logging
- **buildBookingAwinUrl()**: Creates AWIN wrapper with encoded Booking.com URL
- **DISCOVERCARS_AFFILIATE_URL**: Single constant for all DiscoverCars references
- **STRIPE_DONATION_URL**: Fixed Stripe checkout for pay-what-you-want donations

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API key
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification
- `VITE_STRIPE_DONATION_URL`: Optional donation link