import { TicketId, TicketVideo } from '../types/ticket';

export const ticketVideoGalleries = {
  cac: [
    {
      title: 'Hasil di roda putar',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
  ],
  'fun-clay': [
    {
      title: 'Membentuk tanah liat dengan tangan',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Menyiapkan tanah liat',
      src: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    },
  ],
} satisfies Partial<Record<TicketId, TicketVideo[]>>;
