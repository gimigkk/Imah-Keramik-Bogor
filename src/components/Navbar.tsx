import React from 'react';
import { Container } from './Container';
import brandIcon from '@/imports/image.png';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 w-full z-100 py-2.5 bg-[#0c4723]/85 backdrop-blur-md backdrop-saturate-200 text-background transition-all duration-300">
      <Container className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img src={brandIcon} alt="Brand Icon" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shrink-0" />
          <a href="#top" className="font-brand uppercase text-background leading-[0.88] font-extrabold text-[11px] sm:text-[12px] md:text-[13px] tracking-wider">
            Imah<br />Keramik<br />Bogor.
          </a>
        </div>
        <nav className="hidden md:flex gap-10 font-sans text-xs font-medium tracking-widest uppercase text-background/70">
          <a href="#about" className="hover:text-background transition-colors">Brand</a>
          <a href="#activities" className="hover:text-background transition-colors">Aktivitas</a>
          <a href="#gallery" className="hover:text-background transition-colors">Ulasan</a>
        </nav>
        <a
          href="#book"
          className="inline-block bg-background text-foreground px-4 py-1.5 md:px-5 md:py-2 text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-background/80 transition-colors font-sans font-bold"
        >
          Booking
        </a>
      </Container>
    </header>
  );
};

export default Navbar;
