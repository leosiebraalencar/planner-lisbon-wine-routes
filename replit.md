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
- **PDF Generation**: PDFKit with custom fonts (Gilda Display for titles, Open Sans for body text)

### Custom Fonts (server/fonts/)
- **GildaDisplay-Regular.ttf**: Used for PDF titles, section headings (wine red #722F37)
- **OpenSans-Regular.ttf**: Used for PDF body text
- **OpenSans-Bold.ttf**: Used for PDF labels and emphasis
- Fonts cached at startup via `CUSTOM_FONTS_AVAILABLE` constant with Helvetica fallback

### Winery Data (shared/wineryData.ts)
- 31 wineries from Excel file organized by 4 regions: Região Oeste (19), Setúbal (6), Sintra (4), Oeiras (2)
- Each winery has experiences array with prices, URLs, durations
- `getExperienceByBudget()` selects experience based on user budget preference
- All affiliate URLs pre-parametrized with utm_source=lisbonwineroutes

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Tables**: users, payment_sessions, pro_requests, quiz_submissions
- **Migrations**: Drizzle Kit with migrations in /migrations folder

### Payment Integration
- **Provider**: Stripe for checkout sessions and webhooks
- **Webhook Handling**: Raw body parsing for Stripe signature verification
- **Flow**: Quiz → Itinerary Preview → Stripe Checkout → PDF Download

### Internationalization
- **Languages**: Portuguese (default), English, Spanish, German
- **Implementation**: Custom i18n system in client/src/lib/i18n.ts
- **Context**: LanguageContext provides t() translation function

### Restaurant Data (shared/restaurantData.ts)
- 39 restaurants with TheFork integration and promo code "30B64ED"
- Each restaurant has: name, address, description, region, budgetCategory, averagePrice, openingHours, isTheFork, theForkPromoCode, link, lat, lng, rating, cuisineType
- Lat/lng coordinates for distance-based proximity matching
- Helper functions: getRestaurantsByRegionAndBudget(), getRestaurantsForLunch(), getRestaurantsForDinner()

### Hotel Data (shared/hotelData.ts)
- 33 hotels categorized by budget (low/medium/high) and region
- Budget mapping: economico→[low,medium], moderado→[medium,high], premium→[high]
- Each hotel has: name, budgetCategory, affiliateUrl, description, region, isGenericListing
- Helper functions: getHotelsByBudget(), getHotelsByRegion(), getHotelsByBudgetAndRegion()

### Geo Utilities (shared/geoUtils.ts)
- `haversineDistance()`: Calculates distance in km between two lat/lng coordinates
- `extractCoordsFromGoogleMapsUrl()`: Extracts lat/lng from Google Maps URLs (winery coordinates)

### Itinerary Generation (client/src/App.tsx)
- **Pace modes**: `oneWineryPerDay` = 1 winery + lunch + dinner; default/`maxWineries` = 2 wineries + dinner
- Distance-based winery pairing: Afternoon winery within 30km of morning winery (fast-pace mode)
- **Scored winery selection**: Priority winery bonus (+40), budget tier match (+30), experience tag matching to quiz preferences (+20), rating bonus (+2/star), proximity bonus (+25 for ≤30km in fast mode)
- **Priority wineries**: 12 preferred wineries (Quinta De San Michel, AdegaMãe, Palácio Da Bacalhôa, Quinta Do Gradil, Adega Regional De Colares, Casa Santos Lima, Cas'amaro, Quinta Da Folgorosa, Quinta de S. Sebastião, JMF, Casa Ermelinda Freitas, Manzwine)
- **Experience tags**: Auto-detected from experience names via regex (romantic, technical, informal, gastronomic, outdoor, historical, family, exclusive) → matched to quiz preferences
- **Budget tiers**: avg price ≤30€=low, ≤55€=mid, >55€=high; mapped from quiz values (economico→low, moderado→mid, premium→high)
- Scored restaurant selection: Cuisine preference (+50), budget match (+30), region (+20), rating, proximity
- **Dinner region**: Uses hotel region when `central_lisboa` preference, otherwise winery region
- Hotel per day: Assigned in-loop per region/day (or Lisboa for central_lisboa preference)
- **Hotel region aliases**: Oeiras → Lisboa/Cascais, others → own region
- **JMF rule**: José Maria Da Fonseca morning → JMF Winecorner for lunch (not dinner); Winecorner excluded from dinner when any JMF winery present
- Car rental pickup embedded on Day 1 schedule
- Itinerary schema includes per-day hotel and carRentalPickup fields
- Display order: Hotels/Car Rental → Day-by-Day → Restaurants

### Dynamic Counter
- Hero counter starts at 50 + quiz_submissions DB count
- API endpoint: GET /api/itinerary-count
- Updates in real-time as new itineraries are generated

### Key User Flows
1. Landing page with hero, dynamic counter, value proposition, and how-it-works sections
2. 14-step quiz collecting travel preferences (name → duration → dates → budget → travelers → language → preferences → wine regions → arrival → car rental → guide → accommodation → location → special requests)
3. Itinerary display with Hotels/Car Rental first, then Day-by-Day (with per-day hotel & car rental), then Restaurants last
4. Stripe payment for PDF download
5. Pro upsell banner throughout the flow (link color #84270B)

### SEO & Multilingual Optimization
- **react-helmet-async**: Dynamic meta tags (title, description, OG, Twitter Card, JSON-LD, hreflang)
- **Seo.tsx component**: Renders per-page, per-language SEO metadata via Helmet
- **seoData.ts**: Centralized SEO metadata for all pages (home, quiz, itinerary, pro) x languages (PT, EN, ES, DE)
- **Static files**: robots.txt, sitemap.xml, llms.txt in client/public/
- **Subdomain**: tours.lisbonwineroutes.com (no conflict with main domain robots/sitemap)
- **Hreflang**: Page-specific alternate links for pt/en/es/x-default

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

### Quiz Submissions & Admin (quiz_submissions table)
- **Quiz Steps**: 14 steps total (name → duration → dates → budget → travelers → language → preferences → wine regions → arrival → car rental → guide → accommodation → location → special requests)
- **Customer Name**: Collected as first quiz step, displayed in itinerary title and PDF
- **Email Collection**: Modal before PDF download collects email + optional marketing consent
- **Admin Panel**: /data-admin route with login (ADMIN_EMAIL/ADMIN_PASSWORD env vars), CSV export
- **Data**: customerName, customerEmail, marketingConsent, quizData (JSONB), language, createdAt

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API key
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification
- `VITE_STRIPE_DONATION_URL`: Optional donation link
- `ADMIN_EMAIL`: Admin panel login email
- `ADMIN_PASSWORD`: Admin panel login password