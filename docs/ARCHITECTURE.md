# Architecture guide

This guide is for maintainers who are new to the project. It describes how the current single-page concept is assembled and where changes belong.

## Runtime flow

```text
index.html
  └─ src/main.tsx
      └─ src/App.tsx
          ├─ SmoothScroll          global Lenis lifecycle
          ├─ IntroSplash           optional opening animation
          ├─ Navbar + Hero          page introduction
          ├─ BentoTickets           catalogue tabs and ticket modal state
          ├─ GalleryReviews         review wall
          ├─ CTA                    booking, address, and embedded map
          └─ Footer
```

The application is a Vite/React single-page site. There is no client-side router and no API/database. Booking opens WhatsApp with a prefilled message.

## Component boundaries

The component tree is organized by responsibility rather than by file type:

| Folder | Owns | May depend on |
| --- | --- | --- |
| `components/layout` | Site-wide chrome and layout primitives | Shared data and styling |
| `components/providers` | Global browser lifecycles such as Lenis | Browser APIs and shared utilities |
| `components/sections` | Page-level composition and section state | Layout, tickets, effects, hooks, and data |
| `components/tickets` | Catalog presentation, ticket details, and modal behavior | Ticket data, shared libraries, and the scroll provider |
| `components/effects` | Decorative and entrance animations | Shared assets and providers |

Keep catalog data in `src/data`, reusable browser logic in `src/lib` or `src/hooks`, and avoid importing page sections into ticket or effect components. New components should be placed in the narrowest folder that matches their responsibility.

## Source-of-truth map

| Change needed | Edit here first | Also review |
| --- | --- | --- |
| Business name, contacts, WhatsApp, address, map URL | `src/data/site.ts` | Static SEO files in `public/` and `index.html`; see `CONCEPT_HANDOFF.md`. |
| Weekly hours and live open/closed calculation | `src/data/schedule.ts` | Footer summary and static SEO content. |
| Catalogue copy, prices, ticket layout, booking messages | `src/data/tickets.ts` | `Katalog.md`, `public/informasi.html`, `public/llms.txt`, and JSON-LD. |
| Ticket-specific videos and captions | `src/data/ticketMedia.ts` | `public/assets/videos/README.md`. |
| Tile-pattern SVG paths | `src/data/assets.ts` | The SVG files in `public/assets/patterns/`. |
| Reviews, review links, and stock images | `src/components/sections/GalleryReviews.tsx` | Company approval and source/usage rights. |
| Public search/AI metadata | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/informasi.html`, `public/llms.txt` | Keep every domain and business fact synchronized. |

`public/` files are copied directly to the deployment and cannot import TypeScript. That is why public SEO files intentionally repeat some confirmed company facts.

`src/hooks/useRevealOnIntersect.ts` owns the one-time viewport-triggered reveal state used by page sections. Use it for entrance animations only; do not use it for data loading or continuous visibility tracking.
`src/hooks/useTicketModal.ts` owns ticket selection, browser history, and the lifecycle of grid-to-modal transitions. Keep this behavior out of page-section rendering code.

## Components with behavior worth preserving

- `tickets/TicketCard.tsx`, `tickets/TicketPerforation.tsx`, and `src/index.css` implement the ticket perforation masks. The mask dimensions are coordinated; change them only after visual testing at mobile and desktop widths.
- `sections/BentoTickets.tsx` owns catalog tabs and section composition. `hooks/useTicketModal.ts` owns ticket opening/closing and browser-history state. Its `data-ticket-*` attributes are part of the animation contract with `tickets/TicketCard.tsx` and `tickets/TicketModal.tsx`.
- `lib/ticketMorph.ts` owns the low-level ticket DOM animation. Keep catalog state, browser history, and animation mechanics separate when extending ticket interactions.
- `tickets/TicketModal.tsx` owns modal focus, Escape handling, background-scroll locking, and focus restoration. Keep these together when changing the modal.
- `providers/SmoothScroll.tsx` owns the only Lenis instance. Other components subscribe through `subscribeToLenis`; do not instantiate Lenis elsewhere.
- `effects/IntroSplash.tsx` synchronizes the opening video with the hero. Timings are grouped in `INTRO_TIMING` and should be adjusted there.

## Styling

- Most layout and component styles use Tailwind utility classes directly in the component that owns them.
- `src/index.css` contains global theme tokens, ticket-mask CSS, and shared animation classes. It should not become a second source of per-component layout styles.
- Use existing semantic tokens (`background`, `foreground`, `muted`, etc.) before adding hard-coded colors.

## Validation before handoff

```bash
npm run typecheck
npm run build
git diff --check
```

Then manually verify the current desktop and mobile layouts:

1. Opening animation transitions into the hero.
2. Every ticket opens, closes with the close button/backdrop/Escape, and returns focus to its originating ticket.
3. Ticket tabs work with mouse, Enter/Space, Arrow keys, Home, and End.
4. WhatsApp links and the embedded map open the correct destinations.
5. The page works with `prefers-reduced-motion: reduce`.

## Production readiness

This remains a concept. Before enabling indexing or attaching a company domain, work through [CONCEPT_HANDOFF.md](../CONCEPT_HANDOFF.md) in order. In particular, do not treat the current Vercel domain, business facts, pricing, media, or reviews as final company-approved content.
