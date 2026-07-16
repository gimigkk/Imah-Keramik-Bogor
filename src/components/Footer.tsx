import React from 'react';
import { MapPin, Clock, Share2, Copyright } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background overflow-hidden">
      <Container className="pt-16 pb-12">
        {/* 12-column grid system matching main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left: Brand Title (col-span-5) */}
          <div className="lg:col-span-5">
            <h2 className="font-brand text-5xl md:text-6xl lg:text-7xl leading-[0.88] tracking-tight uppercase text-background font-extrabold">
              Imah<br />Keramik<br />Bogor.
            </h2>
          </div>

          {/* Right: Info Columns Grid (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            {/* 3 Structured Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">

              {/* Address */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-background/50 flex-shrink-0" />
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Lokasi</p>
                </div>
                <address className="not-italic font-sans text-xs md:text-sm text-background/80 leading-relaxed">
                  Jl. Pembangunan No.22/23A,<br />
                  RT.03/RW.05, Kedunghalang,<br />
                  Kec. Bogor Utara, Kota Bogor,<br />
                  Jawa Barat 16158
                </address>
              </div>

              {/* Operating Hours */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-background/50 flex-shrink-0" />
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Jam Buka</p>
                </div>
                <ul className="font-sans text-xs md:text-sm text-background/80 space-y-2.5">
                  <li className="flex justify-between items-center gap-2">
                    <span className="text-background/60">Sel — Jum</span>
                    <span className="font-mono text-background/95 font-medium whitespace-nowrap">13:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between items-center gap-2">
                    <span className="text-background/60">Sab — Min</span>
                    <span className="font-mono text-background/95 font-medium whitespace-nowrap">10:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between items-center gap-2">
                    <span className="text-background/50">Senin</span>
                    <span className="font-mono text-background/50 font-medium whitespace-nowrap">Tutup</span>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div className="sm:justify-self-end w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 size={14} className="text-background/50 flex-shrink-0" />
                  <p className="font-mono text-xs uppercase tracking-widest text-background/50 font-bold">Ikuti Kami</p>
                </div>
                <div className="flex flex-col gap-2.5 font-sans text-xs md:text-sm text-background/80">
                  <a
                    href="https://wa.me/628128145417"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaWhatsapp size={15} className="text-background/60 group-hover:text-background transition-colors flex-shrink-0" />
                    <span className="font-medium">WhatsApp (0812-8145-417)</span>
                  </a>
                  <a
                    href="https://instagram.com/imahkeramikbogor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-background/80 hover:text-background transition-colors group"
                  >
                    <FaInstagram size={15} className="text-background/60 group-hover:text-background transition-colors flex-shrink-0" />
                    <span className="font-medium">@imahkeramikbogor</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Copyright text placed under columns on the right side */}
            <div className="mt-12 sm:mt-16 text-left sm:text-right">
              <p className="inline-flex items-center gap-1.5 font-sans text-xs md:text-sm text-background/50 font-semibold tracking-wide">
                <Copyright size={14} className="text-background/50 flex-shrink-0" />
                <span>
                  {new Date().getFullYear()} IMAH KERAMIK BOGOR. Web by{' '}
                  <a
                    href="https://www.gimiaw.web.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background underline decoration-background/30 hover:decoration-background transition-colors"
                  >
                    gimigkk
                  </a>
                </span>
              </p>
            </div>
          </div>

        </div>
      </Container>
    </footer>
  );
};

export default Footer;
