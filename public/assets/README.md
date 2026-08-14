# Public assets

Static assets are grouped by purpose so their URLs communicate ownership and usage:

- `brand/` contains logos and identity assets.
- `images/activities/` contains catalog and facility imagery.
- `images/hero/` contains above-the-fold imagery.
- `images/reviews/` contains participant/review imagery.
- `patterns/` contains decorative SVG tile patterns.
- `seo/` contains social preview assets.
- `videos/` contains hero, package, activity, and review footage.

When adding an asset, place it in the narrowest matching folder and register its public URL in the relevant `src/data` module. Keep filenames descriptive and avoid placing media directly in `public/`.
