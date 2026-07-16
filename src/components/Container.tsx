import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 ${className}`}>
    {children}
  </div>
);
