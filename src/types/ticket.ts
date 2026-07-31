export type TicketUnit = 'per_orang' | 'per_paket' | 'per_2jam' | 'kustom';

export type TicketBadge = 'favorit' | 'hemat' | 'kustom' | 'expert' | '4_pilihan' | null;

export type TicketCategory = 'keramik' | 'membatik' | 'info_umum';

export type TicketTier = {
  name: string;
  price: string;
  detail: string;
};

export type Ticket = {
  id: string;
  code: string;
  title: string;
  price: string;
  unit: TicketUnit;
  unitLabel?: string;
  badge?: TicketBadge;
  image?: string;
  tags?: string[];
  description: string;
  tiers?: TicketTier[];
  category: TicketCategory;
  featured?: boolean;
  isAccent?: boolean;
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
