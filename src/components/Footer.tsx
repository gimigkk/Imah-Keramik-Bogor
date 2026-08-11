import React from 'react';
import { Copyright, Mail } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { Container } from './Container';

const TILES = [
  '/tile.svg',
  '/tile2.svg',
  '/tile3.svg',
  '/tile4.svg',
  '/tile5.svg',
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background overflow-hidden relative">
      <Container className="pt-12 pb-8 relative z-10">
        {/* 12-column grid system matching main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left: Brand Title (col-span-5) */}
          <div className="lg:col-span-5">
            <h2 className="font-brand text-3xl md:text-4xl lg:text-5xl leading-[0.88] tracking-wide uppercase text-background font-extrabold">
              Imah<br />Keramik<br />Bogor.
            </h2>
          </div>

          {/* Right: Info Columns Grid (col-span-7) */}
          <div className="lg:col-span-7">
            {/* 3 Structured Columns: 2-col grid on mobile (Socials full-width, Jam Buka & Lokasi side-by-side), flex justify-between on desktop */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:flex sm:flex-row sm:justify-between items-start gap-6 sm:gap-8">

              {/* Socials & Contact (Full width on mobile 2-col grid, auto on desktop flex) */}
              <div className="min-[420px]:col-span-2 sm:col-auto">
                <div className="mb-2.5 sm:mb-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Ikuti Kami</p>
                </div>
                <div className="flex flex-col gap-2.5 font-sans text-xs md:text-sm text-background/80">
                  <a
                    href="https://wa.me/628128145417"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaWhatsapp size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">WhatsApp (0812-8145-417)</span>
                  </a>
                  <a
                    href="https://instagram.com/imahkeramikbogor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaInstagram size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">@imahkeramikbogor</span>
                  </a>
                  <a
                    href="mailto:imahkeramikbogor@gmail.com"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <Mail size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">imahkeramikbogor@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="w-full sm:w-auto">
                <div className="mb-2.5 sm:mb-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Jam Buka</p>
                </div>
                <ul className="font-sans text-xs md:text-sm text-background/80 space-y-2 max-w-[200px]">
                  <li className="flex justify-between items-center gap-3">
                    <span className="text-background/60">Sel - Jum</span>
                    <span className="font-mono text-background/95 font-medium whitespace-nowrap">13:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between items-center gap-3">
                    <span className="text-background/60">Sab - Min</span>
                    <span className="font-mono text-background/95 font-medium whitespace-nowrap">10:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between items-center gap-3">
                    <span className="text-background/50">Senin</span>
                    <span className="font-mono text-background/50 font-medium whitespace-nowrap">Tutup</span>
                  </li>
                </ul>
              </div>

              {/* Address */}
              <div className="w-full sm:w-auto">
                <div className="mb-2.5 sm:mb-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Lokasi</p>
                </div>
                <address className="not-italic font-sans text-xs md:text-sm text-background/80 leading-relaxed">
                  Jl. Pembangunan No.22/23A,<br />
                  RT.03/RW.05, Kedunghalang,<br />
                  Kec. Bogor Utara, Kota Bogor,<br />
                  Jawa Barat 16158
                </address>
              </div>

            </div>
          </div>

        </div>

        {/* Copyright text placed under the grid */}
        <div className="mt-4 sm:mt-5 text-center w-full flex justify-center">
          <p className="inline-flex items-center justify-center gap-1.5 font-sans text-xs md:text-sm text-background font-semibold tracking-wide">
            <Copyright size={14} className="text-background shrink-0" />
            <span>
              {new Date().getFullYear()} IMAH KERAMIK BOGOR. Web by{' '}
              <a
                href="https://www.gimiaw.web.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background/80 underline decoration-background transition-colors"
              >
                gimigkk
              </a>
            </span>
          </p>
        </div>
      </Container>

      {/* Decorative Ceramic Tile Background with Gradient Mask at Bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 sm:h-56 pointer-events-none select-none overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 90%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 90%)',
        }}
      >
        {/* Grid Lines Layer */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-background) 1px, transparent 1px), linear-gradient(90deg, var(--color-background) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Tile SVGs Layer */}
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-tiles" width="400" height="400" patternUnits="userSpaceOnUse">
                {Array.from({ length: 5 }).map((_, rowIndex) =>
                  Array.from({ length: 5 }).map((_, colIndex) => {
                    const tileIndex = (colIndex + rowIndex) % TILES.length;
                    return (
                      <image
                        key={`${rowIndex}-${colIndex}`}
                        href={TILES[tileIndex]}
                        x={colIndex * 80}
                        y={rowIndex * 80}
                        width="80"
                        height="80"
                      />
                    );
                  })
                )}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-tiles)" />
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
