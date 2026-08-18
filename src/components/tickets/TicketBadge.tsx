import React from 'react';
import { Star, Flame, Sliders, Award, Layers } from 'lucide-react';
import type { TicketBadge as TicketBadgeValue } from '../../types/ticket';

interface TicketBadgeProps {
  badge?: TicketBadgeValue;
  savings?: string;
  isAccent?: boolean;
}

export const TicketBadge: React.FC<TicketBadgeProps> = ({ badge, savings, isAccent = false }) => {
  if (!badge) return null;

  const colorClass = isAccent ? 'text-background' : 'text-[#1b5233]';

  const renderBadgeContent = () => {
    switch (badge) {
      case 'favorit':
        return (
          <>
            <Star className="w-3.5 h-3.5 shrink-0 translate-y-[-1px] fill-none text-current" aria-hidden="true" />
            <span className="lowercase">favorit</span>
          </>
        );
      case 'hemat':
        return (
          <>
            <Flame className="w-3.5 h-3.5 shrink-0 translate-y-[-1px] text-current" aria-hidden="true" />
            <span className="lowercase">{savings ? `hemat ${savings}` : 'hemat'}</span>
          </>
        );
      case 'kustom':
        return (
          <>
            <Sliders className="w-3.5 h-3.5 shrink-0 translate-y-[-1px] text-current" aria-hidden="true" />
            <span className="lowercase">kustom</span>
          </>
        );
      case 'expert':
        return (
          <>
            <Award className="w-3.5 h-3.5 shrink-0 translate-y-[-1px] text-current" aria-hidden="true" />
            <span className="lowercase">expert</span>
          </>
        );
      case '4_pilihan':
        return (
          <>
            <Layers className="w-3.5 h-3.5 shrink-0 translate-y-[-1px] text-current" aria-hidden="true" />
            <span className="lowercase">4 pilihan</span>
          </>
        );
      default:
        return <span className="lowercase">{badge}</span>;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 font-nanum text-lg md:text-xl font-bold tracking-wide leading-none ${colorClass}`}>
      {renderBadgeContent()}
    </span>
  );
};
