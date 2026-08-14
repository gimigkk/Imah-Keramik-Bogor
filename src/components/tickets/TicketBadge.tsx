import React from 'react';
import type { TicketBadge as TicketBadgeValue } from '../../types/ticket';

interface TicketBadgeProps {
  badge?: TicketBadgeValue;
  savings?: string;
}

const baseBadgeClass = 'uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 font-bold';

export const TicketBadge: React.FC<TicketBadgeProps> = ({ badge, savings }) => {
  if (!badge) return null;

  const label = badge === 'hemat' && savings ? `${badge} ${savings}` : badge.replace('_', ' ');
  const colorClass = badge === '4_pilihan'
    ? 'bg-primary text-primary-foreground'
    : badge === 'kustom'
      ? 'bg-foreground/10 text-foreground'
      : 'bg-foreground text-background';

  return <span className={`${baseBadgeClass} ${colorClass}`}>{label}</span>;
};
