import React from 'react';

interface TicketPerforationProps {
  horizontal?: boolean;
}

const NotchOutline: React.FC<{ className: string }> = ({ className }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute h-6 w-6 rounded-full border border-(--ticket-edge) ${className}`}
  />
);

export const TicketPerforation: React.FC<TicketPerforationProps> = ({ horizontal = false }) => (
  <div
    aria-hidden="true"
    className={horizontal ? 'relative z-10 h-0 w-full shrink-0 md:h-auto md:w-0' : 'relative z-10 h-0 w-full shrink-0'}
  >
    <NotchOutline
      className={horizontal
        ? '-left-3 -top-3 [clip-path:inset(0_0_0_50%)] md:[clip-path:inset(50%_0_0_0)]'
        : '-left-3 -top-3 [clip-path:inset(0_0_0_50%)]'}
    />
    <NotchOutline
      className={horizontal
        ? '-right-3 -top-3 [clip-path:inset(0_50%_0_0)] md:-bottom-3 md:-left-3 md:right-auto md:top-auto md:[clip-path:inset(0_0_50%_0)]'
        : '-right-3 -top-3 [clip-path:inset(0_50%_0_0)]'}
    />
  </div>
);
