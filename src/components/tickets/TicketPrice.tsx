import React from 'react';

interface TicketPriceProps {
  price: string;
  originalPrice?: string;
  className?: string;
  priceClassName?: string;
  originalPriceClassName?: string;
}

export const TicketPrice: React.FC<TicketPriceProps> = ({
  price,
  originalPrice,
  className = '',
  priceClassName = 'font-brand font-bold text-xl md:text-2xl tracking-tight',
  originalPriceClassName = 'font-sans text-xs line-through tracking-tight',
}) => (
  <div className={className}>
    {originalPrice && (
      <del className={`block ${originalPriceClassName}`}>
        {originalPrice}
      </del>
    )}
    <span className={`block ${priceClassName}`}>
      {price}
    </span>
  </div>
);
