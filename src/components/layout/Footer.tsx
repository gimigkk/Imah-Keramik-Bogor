import React from 'react';
import { Copyright, Mail } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { Container } from './Container';
import { site, getWhatsAppUrl } from '../../data/site';
import { tileAssets } from '../../data/assets';
import { openingHoursSummary } from '../../data/schedule';

// TODO(company): Footer identity, contact channels, opening hours, address, decorative assets, copyright owner, and developer credit are concept content pending approval. See CONCEPT_HANDOFF.md.
export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background overflow-hidden relative">
      <Container className="pt-12 pb-8 relative z-10">
        {/* 12-column grid system matching main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left: Brand Title (col-span-5) */}
          <div className="lg:col-span-5">
            <h2 className="font-brand text-3xl md:text-4xl lg:text-5xl leading-[0.88] tracking-wide uppercase text-background font-extrabold">
              {site.name.split(' ').map((word, index, words) => (
                <React.Fragment key={word}>
                  {index === words.length - 1 ? `${word}.` : word}
                  {index < words.length - 1 && <br />}
                </React.Fragment>
              ))}
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
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaWhatsapp size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">{site.contact.whatsappLabel}</span>
                  </a>
                  <a
                    href={site.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaInstagram size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">{site.contact.instagramHandle}</span>
                  </a>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <Mail size={15} className="text-background/60 group-hover:text-background transition-colors shrink-0" />
                    <span className="font-medium">{site.contact.email}</span>
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="w-full sm:w-auto">
                <div className="mb-2.5 sm:mb-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Jam Buka</p>
                </div>
                <ul className="font-sans text-xs md:text-sm text-background/80 space-y-2 max-w-50">
                  {openingHoursSummary.map(({ label, value, isClosed }) => (
                    <li key={label} className="flex justify-between items-center gap-3">
                      <span className={isClosed ? 'text-background/50' : 'text-background/60'}>{label}</span>
                      <span className={`font-mono font-medium whitespace-nowrap ${isClosed ? 'text-background/50' : 'text-background/95'}`}>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Address */}
              <div className="w-full sm:w-auto">
                <div className="mb-2.5 sm:mb-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Lokasi</p>
                </div>
                <address className="not-italic font-sans text-xs md:text-sm text-background/80 leading-relaxed">
                  {site.address.displayLines.map((line, index) => (
                    <React.Fragment key={line}>
                      {line}
                      {index < site.address.displayLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
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
                    const tileIndex = (colIndex + rowIndex) % tileAssets.length;
                    return (
                      <image
                        key={`${rowIndex}-${colIndex}`}
                        href={tileAssets[tileIndex]}
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
