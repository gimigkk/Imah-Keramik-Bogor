# Imah Keramik Bogor - UX Concept & Digital Hub Design

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
│   ├── ActivityDetails.tsx    # Activity specs and pricing detail panel
│   ├── BentoTickets.tsx       # Bento grid container & tab navigation
│   ├── CTA.tsx                # Location, map embedded view, & contact copy
│   ├── Container.tsx          # Responsive layout boundary
│   ├── Footer.tsx             # Responsive footer with tiled pattern background
│   ├── Hero.tsx               # Header with interactive media carousel
│   ├── IntroSplash.tsx        # Brand entrance splash animation
│   ├── Navbar.tsx             # Sticky header navigation
│   ├── PackageCards.tsx       # Micro pricing tier cards
│   ├── SmoothScroll.tsx      # Lenis smooth-scroll provider
│   ├── TicketCard.tsx         # Bento ticket item with hover state
│   ├── TicketModal.tsx        # Detail overlay with pre-filled booking actions
│   └── TileBackground.tsx     # RAF-driven SVG tile parallax background
├── data/
│   └── tickets.ts             # Sourced and structured catalog dataset
└── types/
    └── ticket.ts              # TypeScript interfaces for catalog items
```

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

# Build for production
npm run build
```

---

## Disclaimer

This project is an independent UX concept and digital web showcase built for Imah Keramik Bogor. All brand assets, brochure catalog details, and venue references belong to **Imah Keramik Bogor**.
