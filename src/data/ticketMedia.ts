import { TicketId, TicketVideo } from '../types/ticket';

// TODO(company): Video assignments and captions are concept media. Replace with company-approved footage and rights-cleared descriptions before launch. See CONCEPT_HANDOFF.md.
export const ticketVideoGalleries: Record<TicketId, TicketVideo[]> = {
  cac: [
    {
      title: 'Hasil di roda putar',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
    {
      title: 'Proses studio & tutorial',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Membentuk & finishing',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
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
    {
      title: 'Suasana kelas studio',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'glaze-coloring': [
    {
      title: 'Proses pewarnaan & glazur',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Hasil akhir pembakaran',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
  ],
  'membatik-kayu-1': [
    {
      title: 'Tutorial membatik kayu',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Kunjungan area studio',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'membatik-kayu-2': [
    {
      title: 'Teknik membatik kayu',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Proses pewarnaan',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'membatik-kayu-3': [
    {
      title: 'Kreasi pigura & centong',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Proses studio',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'membatik-kayu-4': [
    {
      title: 'Membatik talenan kayu',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Pewarnaan multi warna',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'bundling-1': [
    {
      title: 'Sesi Fun Clay',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Persiapan tanah liat',
      src: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    },
    {
      title: 'Aktivitas membatik',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
  'bundling-2': [
    {
      title: 'Sesi Roda Putar (CAC)',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
    {
      title: 'Proses studio & membatik',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Finishing karya',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
  ],
  htm: [
    {
      title: 'Tur keliling studio',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Demonstrasi roda putar',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
    {
      title: 'Pengolahan tanah liat',
      src: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    },
  ],
  'sewa-aula': [
    {
      title: 'Suasana area & ruangan studio',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Aktivitas kelompok',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
  ],
  workshop: [
    {
      title: 'Tutorial workshop rombongan',
      src: '/assets/videos/hero/studio-process.mp4',
    },
    {
      title: 'Membentuk karya keramik',
      src: '/assets/videos/packages/fun-clay/hand-building.mp4',
    },
    {
      title: 'Hasil proses pembakaran',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
  ],
  'paket-usaha': [
    {
      title: 'Persiapan & pengolahan bahan',
      src: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    },
    {
      title: 'Teknik roda putar expert',
      src: '/assets/videos/packages/cac/wheel-result.mp4',
    },
    {
      title: 'Proses pembakaran & glazur',
      src: '/assets/videos/hero/studio-process.mp4',
    },
  ],
};
