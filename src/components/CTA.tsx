import { useState } from 'react';
import { Container } from './Container';

export const CTA = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("Jl. Pembangunan No.22/23A, Kedunghalang, Bogor Utara, Kota Bogor, Jawa Barat 16158.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="book" className="py-24 bg-background border-t border-foreground/20 relative z-10">
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-stretch">

        {/* Left Column: CTA & Booking */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-8">
            <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-3 py-1.5 font-bold">Pendaftaran Dibuka</span>
          </div>
          <h2 className="font-serif text-6xl md:text-8xl mb-6 leading-[0.85] tracking-tighter uppercase text-foreground">
            Booking <br />
            <span className="font-accent italic font-normal text-[0.85em] tracking-normal text-foreground/80 lowercase">sekarang juga</span>
          </h2>
          <p className="text-foreground/80 text-base mb-10 font-sans max-w-md">
            Kapasitas di studio kami sangat terbatas. Lengkapi formulir pendaftaran resmi untuk mengamankan sesi Anda pada musim ini.
          </p>
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-primary bg-primary text-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors duration-300 w-fit"
          >
            Booking Sekarng
          </a>
        </div>

        {/* Right Column: Location & Map */}
        <div className="lg:col-span-7 flex flex-col h-full bg-card border border-foreground/10 p-4 md:p-5 shadow-sm">
          <div className="flex flex-row justify-between items-end gap-4 pb-5 pt-1 md:pt-2">
            <div>
              <h3 className="font-brand font-extrabold text-3xl text-foreground mb-2 tracking-wide uppercase">Imah Keramik Bogor</h3>
              <button 
                onClick={handleCopy}
                className="group text-left text-muted-foreground font-sans text-sm leading-relaxed hover:text-foreground transition-colors"
                title="Copy address"
              >
                <span>
                  Jl. Pembangunan No.22/23A, Kedunghalang,<br />
                  Bogor Utara, Kota Bogor, Jawa Barat 16158.
                </span>
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 ml-2 mb-0.5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 ml-2 mb-0.5 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                )}
              </button>
            </div>
            {/* Opening Schedule (Hidden on Mobile) */}
            <div className="hidden sm:block text-right shrink-0">
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Selasa — Minggu<br />
                10:00 — 18:00 WIB
              </p>
            </div>
          </div>

          <div className="w-full flex-1 min-h-[250px] lg:min-h-0 aspect-[4/3] lg:aspect-auto bg-muted grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-foreground/10">
            <iframe
              src="https://maps.google.com/maps?q=Jl.+Pembangunan+No.22%2F23A,+RT.03%2FRW.05,+Kedunghalang,+Kec.+Bogor+Utara,+Kota+Bogor,+Jawa+Barat+16158,+Indonesia&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Imah Keramik Bogor Location"
            ></iframe>
          </div>
        </div>

      </div>
    </Container>
  </section>
  );
};
