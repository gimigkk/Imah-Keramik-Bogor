import { TicketId, TicketVideo } from '../types/ticket';

// TODO(company): Video assignments and captions are concept media. Replace with company-approved footage and rights-cleared descriptions before launch. See CONCEPT_HANDOFF.md.
const video = (title: string, src: string): TicketVideo => ({ title, src: `${src}?v=v3` });
export const ticketVideoGalleries: Record<TicketId, TicketVideo[]> = {
  cac: [
    video('', '/assets/videos/packages/cac/cac-reel.mp4'),
    video('', '/assets/videos/packages/cac/cac-reel-2.mp4'),
    video('', '/assets/videos/packages/cac/cac-reel-3.mp4'),
  ],
  'fun-clay': [
    video('', '/assets/videos/packages/fun-clay/fun-clay-reel.mp4'),
    video('', '/assets/videos/packages/fun-clay/fun-clay-reel-2.mp4'),
    video('', '/assets/videos/packages/fun-clay/fun-clay-reel-3.mp4'),
  ],
  'glaze-coloring': [],
  'membatik-kayu-1': [
    video('', '/assets/videos/packages/membatik/membatik-kayu-1-reel.mp4'),
    video('', '/assets/videos/packages/membatik/membatik-kayu-1-reel-2.mp4'),
    video('', '/assets/videos/packages/membatik/membatik-kayu-1-reel-3.mp4'),
  ],
  'membatik-kayu-2': [
    video('', '/assets/videos/packages/membatik/membatik-kayu-2-reel.mp4'),
    video('', '/assets/videos/packages/bundling/bundling-2-reel-3.mp4'),
    video('', '/assets/videos/packages/membatik/membatik-kayu-1-reel-2.mp4'),
  ],
  'membatik-kayu-3': [],
  'membatik-kayu-4': [],
  'bundling-1': [
    video('', '/assets/videos/packages/fun-clay/fun-clay-reel-2.mp4'),
    video('', '/assets/videos/packages/membatik/membatik-kayu-1-reel.mp4'),
    video('', '/assets/videos/packages/fun-clay/fun-clay-reel-3.mp4'),
  ],
  'bundling-2': [
    video('', '/assets/videos/packages/bundling/bundling-2-reel.mp4'),
    video('', '/assets/videos/packages/bundling/bundling-2-reel-2.mp4'),
    video('', '/assets/videos/packages/bundling/bundling-2-reel-3.mp4'),
  ],
  htm: [
    video('', '/assets/videos/packages/htm/htm-reel.mp4'),
    video('', '/assets/videos/packages/htm/htm-reel-2.mp4'),
    video('', '/assets/videos/packages/htm/htm-reel-3.mp4'),
  ],
  'sewa-aula': [],
  workshop: [],
  'paket-usaha': [],
};
