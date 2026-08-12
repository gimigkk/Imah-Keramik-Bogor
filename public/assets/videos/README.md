# Video assets

> **TODO(company):** All current video assets and their package assignments are concept media. Confirm ownership, usage rights, captions, and final selections before launch; see `CONCEPT_HANDOFF.md` in the repository root.

- `hero/` contains footage used by the page hero.
- `packages/<package-id>/` contains footage specific to one reservable package.
- Use descriptive file names rather than numbered clips.
- Register package videos in `src/data/ticketMedia.ts`.
- Do not add a generic fallback: packages without matching footage should not show a gallery.
