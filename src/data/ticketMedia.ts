import { TicketId, TicketVideo } from '../types/ticket';
import { mediaAssets } from './assets';

// TODO(company): Video assignments and captions are concept media. Replace with company-approved footage and rights-cleared descriptions before launch. See CONCEPT_HANDOFF.md.
const video = (title: string, src: string): TicketVideo => ({ title, src });

const { hero, packageVideos } = mediaAssets;

export const ticketVideoGalleries: Record<TicketId, TicketVideo[]> = {
  cac: [
    video('Hasil di roda putar', packageVideos.wheelResult),
    video('Proses studio & tutorial', hero.videoMp4),
    video('Membentuk & finishing', packageVideos.handBuilding),
  ],
  'fun-clay': [
    video('Membentuk tanah liat dengan tangan', packageVideos.handBuilding),
    video('Menyiapkan tanah liat', packageVideos.clayPreparation),
    video('Suasana kelas studio', hero.videoMp4),
  ],
  'glaze-coloring': [
    video('Proses pewarnaan & glazur', hero.videoMp4),
    video('Hasil akhir pembakaran', packageVideos.wheelResult),
  ],
  'membatik-kayu-1': [
    video('Tutorial membatik kayu', packageVideos.handBuilding),
    video('Kunjungan area studio', hero.videoMp4),
  ],
  'membatik-kayu-2': [
    video('Teknik membatik kayu', packageVideos.handBuilding),
    video('Proses pewarnaan', hero.videoMp4),
  ],
  'membatik-kayu-3': [
    video('Kreasi pigura & centong', packageVideos.handBuilding),
    video('Proses studio', hero.videoMp4),
  ],
  'membatik-kayu-4': [
    video('Membatik talenan kayu', packageVideos.handBuilding),
    video('Pewarnaan multi warna', hero.videoMp4),
  ],
  'bundling-1': [
    video('Sesi Fun Clay', packageVideos.handBuilding),
    video('Persiapan tanah liat', packageVideos.clayPreparation),
    video('Aktivitas membatik', hero.videoMp4),
  ],
  'bundling-2': [
    video('Sesi Roda Putar (CAC)', packageVideos.wheelResult),
    video('Proses studio & membatik', hero.videoMp4),
    video('Finishing karya', packageVideos.handBuilding),
  ],
  htm: [
    video('Tur keliling studio', hero.videoMp4),
    video('Demonstrasi roda putar', packageVideos.wheelResult),
    video('Pengolahan tanah liat', packageVideos.clayPreparation),
  ],
  'sewa-aula': [
    video('Suasana area & ruangan studio', hero.videoMp4),
    video('Aktivitas kelompok', packageVideos.handBuilding),
  ],
  workshop: [
    video('Tutorial workshop rombongan', hero.videoMp4),
    video('Membentuk karya keramik', packageVideos.handBuilding),
    video('Hasil proses pembakaran', packageVideos.wheelResult),
  ],
  'paket-usaha': [
    video('Persiapan & pengolahan bahan', packageVideos.clayPreparation),
    video('Teknik roda putar expert', packageVideos.wheelResult),
    video('Proses pembakaran & glazur', hero.videoMp4),
  ],
};
