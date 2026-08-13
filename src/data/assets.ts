/** Public decorative asset paths shared by multiple components. */
export const tileAssets = [
  '/tile.svg',
  '/tile2.svg',
  '/tile3.svg',
  '/tile4.svg',
  '/tile5.svg',
] as const;

export const mediaAssets = {
  brandIcon: '/assets/images/brand-icon.webp',
  hero: {
    poster: '/assets/images/hero-poster.webp',
    videoMp4: '/assets/videos/hero/studio-process.mp4',
    videoWebm: '/assets/videos/hero/studio-process.webm',
    youtubeUrl: 'https://www.youtube.com/watch?v=FrqD8OS0ARA',
    youtubeId: 'FrqD8OS0ARA',
    youtubeUrl2: 'https://www.youtube.com/watch?v=iBIYNcN-k4s',
    youtubeId2: 'iBIYNcN-k4s',
    youtubeUrl3: 'https://www.youtube.com/watch?v=7V1YcidosG4',
    youtubeId3: '7V1YcidosG4',
  },
  packageVideos: {
    wheelResult: '/assets/videos/packages/cac/wheel-result.mp4',
    clayPreparation: '/assets/videos/packages/fun-clay/clay-preparation.mp4',
    handBuilding: '/assets/videos/packages/fun-clay/hand-building.mp4',
  },
} as const;

