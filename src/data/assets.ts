/** Public decorative asset paths shared by multiple components. */
export const tileAssets = [
  '/assets/patterns/tile-01.svg',
  '/assets/patterns/tile-02.svg',
  '/assets/patterns/tile-03.svg',
  '/assets/patterns/tile-04.svg',
  '/assets/patterns/tile-05.svg',
] as const;

export const mediaAssets = {
  brandIcon: '/assets/brand/brand-icon.webp',
  hero: {
    poster: '/assets/images/hero/hero-poster.webp',
    videoMp4: '/assets/videos/hero/studio-process.mp4',
    videoWebm: '/assets/videos/hero/studio-process.webm',
    youtubeUrl: 'https://www.youtube.com/watch?v=FrqD8OS0ARA',
    youtubeUrl2: 'https://www.youtube.com/watch?v=iBIYNcN-k4s',
    youtubeUrl3: 'https://www.youtube.com/watch?v=7V1YcidosG4',
  },
  packageVideos: {
    wheelResult: '/assets/videos/packages/cac/wheel-result.mp4',
    clayPreparation: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    handBuilding: '/assets/videos/packages/fun-clay/hand-building.mp4',
  },
} as const;
