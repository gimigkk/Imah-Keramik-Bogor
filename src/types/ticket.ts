export type TicketBadge = 'favorit' | 'hemat' | 'kustom' | 'expert' | '4_pilihan' | null;

export type TicketCategory = 'keramik' | 'membatik' | 'bundling' | 'info_umum';

export type TicketId =
  | 'cac'
  | 'fun-clay'
  | 'glaze-coloring'
  | 'membatik-kayu-1'
  | 'membatik-kayu-2'
  | 'membatik-kayu-3'
  | 'membatik-kayu-4'
  | 'bundling-1'
  | 'bundling-2'
  | 'htm'
  | 'sewa-aula'
  | 'workshop'
  | 'paket-usaha';

export type TicketTier = {
  name: string;
  price: string;
  detail: string;
  items?: string[];
};

export type TicketVideo = {
  title: string;
  src: string;
};

export type Ticket = {
  id: TicketId;
  title: string;
  price: string;
  originalPrice?: string;
  unitLabel?: string;
  badge?: TicketBadge;
  savings?: string;
  image?: string;
  tags?: string[];
  description: string;
  additionalDetails?: string;
  tiers?: TicketTier[];
  category: TicketCategory;
  featured?: boolean;
  isAccent?: boolean;
  isHorizontal?: boolean;
  addons?: string[];
  videos?: TicketVideo[];
  gridSpan?: {
    cols?: number;
    rows?: number;
  };
  gridPosition?: {
    colStart: number;
    rowStart: number;
  };
  whatsappMessage?: string;
};
