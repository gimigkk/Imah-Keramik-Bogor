import React from 'react';

interface BarcodeProps {
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ className = "" }) => (
  <div className={`flex justify-center gap-[3px] opacity-60 ${className}`}>
    <div className="w-1 bg-foreground"></div>
    <div className="w-2 bg-foreground"></div>
    <div className="w-1 bg-foreground"></div>
    <div className="w-3 bg-foreground"></div>
    <div className="w-1 bg-foreground"></div>
    <div className="w-[2px] bg-foreground"></div>
    <div className="w-2 bg-foreground"></div>
    <div className="w-[1px] bg-foreground"></div>
    <div className="w-4 bg-foreground"></div>
    <div className="w-1 bg-foreground"></div>
    <div className="w-2 bg-foreground"></div>
    <div className="w-[2px] bg-foreground"></div>
    <div className="w-1 bg-foreground"></div>
    <div className="w-3 bg-foreground"></div>
  </div>
);

export default Barcode;
