# Design Guidelines: Lisbon Wine Routes - Guia Personalizado

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium travel and hospitality platforms (Airbnb, Booking.com) adapted for wine tourism experiences, while maintaining exact brand consistency with lisbonwineroutes.com.

**Core Principle**: Create an elegant, trustworthy experience that evokes the sophistication of Portuguese wine culture while remaining accessible and mobile-optimized.

---

## Typography Hierarchy

**Font Families** (matching lisbonwineroutes.com):
- Primary: System fonts stack for optimal performance
- Headings: Bold, elegant serif-style treatment
- Body: Clean, readable sans-serif for all content
- Use web-safe fonts or Google Fonts CDN

**Scale & Weights**:
- Hero Headline: 2.5rem mobile / 4rem desktop, bold
- Section Headers: 1.75rem mobile / 2.5rem desktop, semi-bold
- Quiz Questions: 1.5rem mobile / 2rem desktop, medium
- Body Text: 1rem mobile / 1.125rem desktop, regular
- Small Text/Labels: 0.875rem, regular

---

## Layout System

**Spacing Primitives** (Tailwind):
Primary units: **4, 6, 8, 12, 16, 20, 24** (p-4, m-8, gap-6, etc.)

**Container Widths**:
- Full sections: w-full with max-w-7xl mx-auto px-4
- Content sections: max-w-5xl
- Quiz container: max-w-2xl
- Text content: max-w-prose

**Vertical Rhythm**:
- Section padding: py-16 mobile / py-24 desktop
- Component spacing: space-y-8 to space-y-12
- Card padding: p-6 to p-8

---

## Component Library

### Landing Page Components

**Hero Section** (full-height on mobile):
- Large hero image: Portuguese vineyard landscape at golden hour
- Overlay gradient for text readability
- Centered headline: "Descubra o Seu Roteiro Perfeito de Enoturismo em Lisboa"
- Subheadline explaining the personalized quiz
- Primary CTA button with blur background: "Criar Meu Roteiro Personalizado"
- Secondary trust indicator: "Mais de 500 roteiros criados"

**Value Proposition Section** (3-column on desktop):
- Icon + Title + Description cards
- Features: "Personalizado para Você", "Curadoria Especializada", "Baixe Instantaneamente"
- Icons from Heroicons (outline style)
- Cards with subtle borders, generous padding (p-8)

**How It Works Section** (step-by-step visual):
- 4 numbered steps in vertical mobile / horizontal desktop layout
- Step 1: Responda ao Quiz | Step 2: IA Gera Roteiro | Step 3: Revise Sugestões | Step 4: Baixe seu Guia
- Timeline connector between steps (desktop only)

**Sample Itinerary Preview** (social proof):
- 2-column layout showing example day-by-day itinerary
- Left: Morning/afternoon activities | Right: Evening/dining
- Blurred content with "Veja um exemplo do que você receberá"

**Pricing Transparency Section**:
- Clear explanation: "Pague o que achar justo (mínimo $1 USD)"
- Value justification: expert curation, time saved, insider access
- Visual pricing slider concept

**Footer** (exact match to lisbonwineroutes.com):
- Multi-column layout: About, Links, Contact, Social
- Logo placement
- Link to main site: lisbonwineroutes.com
- Contact: contacto@lisbonwineroutes.com
- Instagram integration

### Quiz Interface Components

**Progress Indicator**:
- Stepped progress bar: "Passo 2 de 6"
- Visual dots showing current/completed/upcoming steps
- Positioned at top of quiz container

**Question Cards** (one per screen):
- Large, centered card (max-w-2xl)
- Question number badge: "02/06"
- Question text: 1.5rem, bold
- Answer options with clear visual hierarchy
- Navigation: "Voltar" and "Próximo" buttons

**Input Variations**:
- Multiple choice: Radio buttons with custom styling, full-width clickable areas
- Budget range: Custom range slider with value display
- Date picker: Mobile-optimized calendar
- Preference tags: Multi-select chips/pills
- Text input: For special requests (optional field)

**Question Types**:
1. Duração: "Quantos dias durará sua viagem?" (1-7+ days selector)
2. Período: Date range picker
3. Orçamento: Range slider (Econômico / Moderado / Premium)
4. Viajantes: Cards (Sozinho / Casal / Família / Grupo)
5. Preferências: Multi-select (Vinícolas históricas, Degustações, Gastronomia, Paisagens, etc.)
6. Experiências desejadas: Optional text area

### Itinerary Display Components

**Generated Itinerary Container**:
- Header: "Seu Roteiro Personalizado de Enoturismo"
- Summary cards: Days, Budget match, Key highlights
- Day-by-day accordion/expandable sections

**Daily Schedule Cards**:
- Day header: "Dia 1 - Região Oeste"
- Timeline view: Morning (09:00-12:00), Afternoon (14:00-18:00), Evening (19:00+)
- Location cards with: Winery name, Activity type, Duration, Brief description
- Map placeholder: "Ver no mapa" link
- Restaurant recommendations integrated

**Action Section**:
- Prominent CTA: "Baixar Roteiro Completo (PDF)"
- Stripe payment integration
- Price selector: Slider starting at $1 USD
- Value reminder: "Apoie nosso trabalho de curadoria"

### Form Elements

**Buttons**:
- Primary: Filled, rounded-lg, px-8 py-4, prominent
- Secondary: Outlined, same sizing
- Blur backgrounds when over images
- No custom hover states (rely on component defaults)

**Input Fields**:
- Consistent border-radius: rounded-lg
- Padding: px-4 py-3
- Focus states with subtle border emphasis
- Labels: mb-2, text-sm, font-medium

---

## Images

**Hero Section**:
- Large, high-quality vineyard landscape image
- Portuguese wine region (Quinta do Gradil, Bucelas, or similar)
- Golden hour lighting preferred
- Dimensions: 1920x1080 minimum

**Section Backgrounds**:
- Value proposition: Light, subtle vineyard pattern or solid background
- How it works: Clean, minimal background
- Sample itinerary: Blurred wine/food photography

**Content Images**:
- Winery photos for itinerary cards (landscape orientation)
- Wine bottles and glasses for decorative accents
- Regional landscape photography

**Icon Set**: Heroicons (outline style) for all interface icons

---

## Responsive Behavior

**Breakpoints**:
- Mobile: base (< 768px) - single column, stacked layout
- Tablet: md (768px+) - 2-column grids
- Desktop: lg (1024px+) - 3-column grids, full layout

**Mobile-First Priorities**:
- Quiz optimized for thumb navigation
- Large tap targets (min 44px)
- Single-column card stacks
- Collapsible sections for long content
- Fixed bottom CTA bar when appropriate

**Desktop Enhancements**:
- Multi-column feature grids
- Sticky navigation during quiz
- Side-by-side itinerary viewing
- Hover states on interactive elements

---

## Accessibility

- Semantic HTML throughout (nav, main, section, article)
- ARIA labels for all interactive elements
- Keyboard navigation for quiz
- Sufficient contrast ratios (WCAG AA minimum)
- Focus indicators on all focusable elements
- Alt text for all images

---

## Animations

**Minimal, Purposeful Motion**:
- Quiz transitions: Subtle slide between questions (200ms)
- Accordion expand/collapse: Smooth height transition
- Button hover: Gentle scale (1.02) - handled by component
- Page load: Fade-in for hero content
- No scroll-triggered animations
- No parallax effects