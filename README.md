# Imah Keramik Bogor - UX Concept & Digital Hub Design

> See [`CONCEPT_HANDOFF.md`](./CONCEPT_HANDOFF.md) for every company fact, asset, URL, and public-facing claim that must be confirmed before this concept can become a production website.

New maintainers should start with [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). It maps each feature to its owner, identifies the deliberately coupled animation code, and lists the required validation steps.

The repository is organized by responsibility. Page sections live under `src/components/sections`, site chrome under `src/components/layout`, global lifecycles under `src/components/providers`, ticket UI under `src/components/tickets`, and decorative motion under `src/components/effects`. Keep business/catalog data in `src/data` and reusable browser logic in `src/lib` or `src/hooks`.

A web design and digital product concept built for **Imah Keramik Bogor**, an educational ceramic studio and cultural tourism venue in Bogor, Indonesia.

---

## Background & Problem Statement

Imah Keramik Bogor currently operates **without a dedicated website**. All information-ranging from entrance fees and workshop packages to facility rules and booking links-is scattered across Instagram posts, story highlights, and static brochure photos.

This creates critical friction for prospective visitors:
1. **Scattered Information Architecture**: Users must dig through social media posts to piece together pricing across general admission, ceramic art classes, batik workshops, and room rentals.
2. **Unclear Product Offerings**: Brochure details (like 2x kiln firings, glaze count, or minimum group sizes) are buried in image captions or direct messages.
3. **Manual Inquiry Friction**: Bookings rely on direct Instagram DMs or generic Google Forms, leaving users unsure of package availability and exact totals prior to contacting the studio.

---

## Design Strategy & Solutions

### 1. Centralized Single-Page Digital Hub
- Replaced scattered social media links with a single, responsive web application containing all official catalog data, facility highlights, location maps, and pricing in one place.

### 2. Adaptive Bento Grid Catalog
- **Persistent General Access Section**: Placed core venue details (`HTM`, `Workshop`, `Paket Usaha`, `Sewa Aula`) in a fixed top grid section so general entry rules remain clear regardless of active category tabs.
- **Categorized Activity Tabs**: Divided complex workshop options into `Keramik`, `Membatik Kayu`, and `Bundling` tabs. Flagship experiences like the *Ceramic Art Class* use a `2x2` hero card layout, while simpler add-ons use compact single-cell cards.
- **Explicit UX Badges**: Used clear tags (`Favorit`, `Hemat`, `Kustom`, `Expert`) to surface key decision factors (e.g., 2x firing included, 1-color glaze) at a glance.

### 3. Direct WhatsApp Booking Integration
- Replaced static Google Form links and open-ended DMs with an interactive modal (`TicketModal.tsx`).
- Selecting an activity dynamically formats a pre-filled WhatsApp message containing the exact package title, pricing tier, and inclusions.
- Clicking "Pesan via WhatsApp" launches WhatsApp directly with a complete, structured inquiry ready to send.

### 4. Custom Parallax Tile Engine
- Built a scroll-velocity-matched SVG tile pattern (`TileBackground.tsx`) running on a `requestAnimationFrame` loop to add subtle depth reminiscent of ceramic crafting without causing layout shifts or performance lag.

---

## Content Mapping

Mapping scattered Instagram brochure data into structured UI components:

```text
Brochure Data Layer               Digital UI Component             UX Purpose
--------------------              --------------------             ----------
Info Umum (HTM, Aula, Usaha) ---> Persistent Overview Banner ----> Instant clarity on entry fees
Ceramic Art Class (CAC) --------> Featured 2x2 Bento Hero Card --> Highlight top-tier experience
Batik Kayu 1–4 -----------------> Dedicated Filterable Grid -----> Clear feature comparison
Bundling Packages --------------> Full-Width Banner Cards -------> Drive higher order values
```

---

## Project Structure

```text
src/
├── components/
│   ├── effects/               # Decorative and entrance animations
│   │   ├── IntroSplash.tsx
│   │   └── TileBackground.tsx
│   ├── layout/                # Global chrome and layout primitives
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── providers/             # Global browser/scroll lifecycles
│   │   └── SmoothScroll.tsx
│   ├── sections/              # Page-level composition sections
│   │   ├── BentoTickets.tsx
│   │   ├── CTA.tsx
│   │   ├── GalleryReviews.tsx
│   │   └── Hero.tsx
│   └── tickets/               # Catalog cards, details, and modal flow
│       ├── ActivityDetails.tsx
│       ├── PackageCards.tsx
│       ├── TicketBadge.tsx
│       ├── TicketCard.tsx
│       ├── TicketMedia.tsx
│       ├── TicketModal.tsx
│       ├── TicketPerforation.tsx
│       └── TicketPriceFooter.tsx
├── data/
│   ├── assets.ts              # Shared public asset paths
│   ├── schedule.ts            # Opening hours and live-status calculation
│   ├── site.ts                # Runtime business/contact/location details
│   ├── ticketMedia.ts         # Ticket-to-video mapping
│   └── tickets.ts             # Structured catalogue dataset
├── lib/
│   ├── browserScroll.ts        # Shared landing-page scroll initialization
│   ├── responsiveImage.ts      # Unsplash image transformation helpers
│   └── ticketMorph.ts          # DOM animation engine for grid-to-modal tickets
├── hooks/
│   ├── useRevealOnIntersect.ts # One-time section entrance state
│   └── useTicketModal.ts       # Ticket modal, history, and morph orchestration
└── types/
    └── ticket.ts              # TypeScript interfaces for catalog items

src/utils/
└── youtube.ts                 # Trusted YouTube URL and ID parsing

public/                           # Static files copied directly to deployment
├── assets/
│   ├── brand/                    # Logo and brand imagery
│   ├── images/
│   │   ├── activities/           # Catalog and facility imagery
│   │   ├── hero/                 # Above-the-fold imagery
│   │   └── reviews/              # Participant/review imagery
│   ├── patterns/                 # Decorative tile SVGs
│   ├── seo/                      # Social preview assets
│   └── videos/                   # Hero, package, activity, and review video
├── favicon.ico / favicon.png     # Root-level browser icons
├── informasi.html                # Non-JavaScript public information page
├── llms.txt                      # AI-readable concept information
├── robots.txt / sitemap.xml      # Crawler configuration
```

## Generated files

The following are local build or recording outputs and are intentionally ignored by Git:

- `dist/` — production output generated by `npm run build`.
- `artifacts/` — optional showcase recordings and screenshots.
- `tsconfig.tsbuildinfo` — TypeScript incremental-build cache.
- `node_modules/` — installed dependencies.

Do not edit these directories directly. Remove them when a clean workspace is needed; the build and install commands recreate them.

---

## Tech Stack

- **Framework & Language**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS keyframes
- **Scroll Engine**: Lenis Smooth Scroll
- **Icons**: Lucide React, React Icons

---

## Local Setup

```bash
# Clone repository
git clone <repository-url>
cd "Imah Keramik Bogor"

# Install dependencies
npm install

# Run dev server
npm run dev

# Type-check without creating a production build
npm run typecheck

# Build for production
npm run build
```

---

## Disclaimer

This project is an independent UX concept and digital web showcase built for Imah Keramik Bogor. All brand assets, brochure catalog details, and venue references belong to **Imah Keramik Bogor**.
