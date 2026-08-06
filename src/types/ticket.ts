export type TicketBadge = 'favorit' | 'hemat' | 'kustom' | 'expert' | '4_pilihan' | null;

export type TicketCategory = 'keramik' | 'membatik' | 'bundling' | 'info_umum';

export type TicketTier = {
  name: string;
  price: string;
  detail: string;
  items?: string[];
};

export type Ticket = {
  id: string;
  code: string;
  title: string;
  price: string;
  unitLabel?: string;
  badge?: TicketBadge;
  image?: string;
  tags?: string[];
  description: string;
  tiers?: TicketTier[];
  category: TicketCategory;
  featured?: boolean;
  isAccent?: boolean;
  isHorizontal?: boolean;
  addons?: string[];
  gridSpan?: {
    cols?: number;
    rows?: number;
  };
  gridPosition?: {
    colStart: number;
    rowStart: number;
  };
};
