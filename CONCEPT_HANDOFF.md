# Concept handoff: company input required

This repository is a concept site, not an approved production website. Do not publish, index, or advertise the following values until Imah Keramik Bogor has reviewed and confirmed them in writing.

## Replace before launch

| Area | Current concept source | Confirm or replace with the company |
| --- | --- | --- |
| Production domain | `https://imah-keramik-bogor.vercel.app` | The final custom domain and redirect/canonical strategy. Update `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/informasi.html`, and `public/llms.txt` together. |
| Business identity and positioning | Page copy, metadata, navigation, and footer | Official business name, logo, tagline, audience, descriptions, and approved Indonesian/English wording. |
| Contact and booking | WhatsApp number, email, Instagram, booking copy | Current business-owned channels, booking flow, response hours, and consent to publish them. |
| Location and map | Address and Google Maps embed in `CTA.tsx` | Exact public address, map pin/embed, directions, parking/accessibility information, and whether the location may be shown publicly. |
| Opening hours | `src/data/schedule.ts`, footer, structured data, static info page | Regular hours, holiday closures, booking-only exceptions, and timezone. |
| Activities, prices, packages, capacities | `src/data/tickets.ts`, `Katalog.md`, `public/informasi.html`, `public/llms.txt`, structured data | Current approved products, prices, inclusions, age limits, duration, availability, taxes, cancellation/refund terms, and all package names. |
| Images, video, logo, icons, tiles | `public/assets/`, `public/tile*.svg`, `public/favicon.*`, `src/imports/`, Unsplash image URLs | Company-owned/approved assets, captions, alt text, licenses, and usage consent. Replace concept/stock assets before launch. |
| Reviews and testimonials | `src/components/GalleryReviews.tsx` | Permission, current source URLs, editorial policy, and whether reviews may be quoted on the official site. |
| SEO, social previews, AI-readable content | `index.html`, `public/informasi.html`, `public/llms.txt`, `public/og-image.jpg` | Approved descriptions, facts, images, pricing, and social handles. These must stay consistent with the final company data. |
| Ownership and legal | Footer credit and all public claims | Copyright owner, privacy policy, terms, booking terms, and the approved developer credit (if any). |

## Technical decisions to review

- The site currently uses Vercel clean URLs and returns a real 404 for unknown paths. Keep this unless the company needs a different routing strategy.
- Google Maps remains embedded because it is part of the approved concept experience. It has a performance cost and can be changed later only with company approval.
- `robots.txt` currently allows all major search and AI crawlers. Confirm the company wants public indexing before launch.
- `public/informasi.html` and `public/llms.txt` duplicate business facts for non-JavaScript and AI/search readers. Keep them only if the company approves the content and commits to maintaining it.
- Image/video caching and responsive-image loading are implementation details and can remain; they do not claim company facts.

## Update order when company input arrives

1. Confirm domain, business identity, contacts, address, hours, catalogue, assets, reviews, and legal copy.
2. Update the source data files first: `src/data/tickets.ts`, `src/data/schedule.ts`, `src/data/ticketMedia.ts`, `CTA.tsx`, `Footer.tsx`, and `GalleryReviews.tsx`.
3. Synchronize `index.html` structured data and metadata with the confirmed facts.
4. Synchronize `public/informasi.html`, `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml`.
5. Replace the social-preview image and update the sitemap `lastmod` date.
6. Have the company review the staging URL, then enable indexing and submit the final sitemap.

## Future Enhancement Ideas

- **Zero-CMS YouTube Playlist Auto-Sync**: Integrate YouTube Data API v3 (`playlistItems` endpoint) using a `VITE_YOUTUBE_API_KEY`. The website will automatically parse and display videos, titles, and thumbnails from a single YouTube Playlist ID (`list=PL...`). This allows the client to update site hero videos anytime just by managing their YouTube playlist, eliminating the need for a CMS or code changes.

