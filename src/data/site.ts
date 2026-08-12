/**
 * Shared business details used by the React application.
 *
 * Keep this as the source of truth for runtime contact and location details.
 * Static search assets under `public/` cannot import TypeScript, so update the
 * matching metadata there when these values are approved for production.
 * See CONCEPT_HANDOFF.md for the full pre-launch checklist.
 */
export const site = {
  name: 'Imah Keramik Bogor',
  booking: {
    whatsappNumber: '628128145417',
  },
  contact: {
    whatsappLabel: 'WhatsApp (0812-8145-417)',
    email: 'imahkeramikbogor@gmail.com',
    instagramHandle: '@imahkeramikbogor',
    instagramUrl: 'https://instagram.com/imahkeramikbogor',
  },
  address: {
    copyText: 'Jl. Pembangunan No.22/23A, Kedunghalang, Bogor Utara, Kota Bogor, Jawa Barat 16158.',
    displayLines: [
      'Jl. Pembangunan No.22/23A,',
      'RT.03/RW.05, Kedunghalang,',
      'Kec. Bogor Utara, Kota Bogor,',
      'Jawa Barat 16158',
    ],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Jl.+Pembangunan+No.22%2F23A,+RT.03%2FRW.05,+Kedunghalang,+Kec.+Bogor+Utara,+Kota+Bogor,+Jawa+Barat+16158,+Indonesia&output=embed&z=16',
  },
} as const;

export const getWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${site.booking.whatsappNumber}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
