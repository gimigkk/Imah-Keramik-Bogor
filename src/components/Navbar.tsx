import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Container } from './Container';
import { site, getWhatsAppUrl } from '../data/site';
import { mediaAssets } from '../data/assets';

// TODO(company): Confirm the approved logo asset, business name, navigation labels, and booking destination before launch. See CONCEPT_HANDOFF.md.
export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 inset-x-0 w-full z-100 py-2.5 bg-[#043e1b]/85 backdrop-blur-md backdrop-saturate-200 text-background transition-all duration-300">
      <Container className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img
            src={mediaAssets.brandIcon}
            alt={`Logo ${site.name}`}
            width="72"
            height="72"
            decoding="async"
            className="h-8 w-8 shrink-0 rounded-full object-cover opacity-100 md:h-9 md:w-9"
          />
          <a href="#top" aria-label={`${site.name} — kembali ke atas`} className="font-brand uppercase text-background leading-[0.88] font-extrabold text-[11px] sm:text-[12px] md:text-[13px] tracking-wider">
            Imah<br />Keramik<br />Bogor.
          </a>
        </div>
        <nav aria-label="Navigasi utama" className="hidden md:flex gap-8 lg:gap-10 font-sans text-xs font-bold tracking-widest uppercase text-background/85">
          <a href="#about" className="hover:text-background transition-colors">Tentang</a>
          <a href="#activities" className="hover:text-background transition-colors">Aktivitas</a>
          <a href="#gallery" className="hover:text-background transition-colors">Ulasan</a>
          <a href="#book" className="hover:text-background transition-colors">Lokasi</a>
        </nav>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 md:gap-2 bg-background text-foreground px-3.5 py-1.5 md:px-5 md:py-2 text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-background/80 transition-colors font-sans font-bold"
        >
          <FaWhatsapp className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" aria-hidden="true" />
          <span>Booking</span>
        </a>
      </Container>
    </header>
  );
};

export default Navbar;
