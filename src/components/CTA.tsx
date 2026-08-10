import { Container } from './Container';

export const CTA = () => (
  <section id="book" className="py-24 bg-background border-t border-foreground/20 relative z-10">
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Column: CTA & Booking */}
        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
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
        <div className="lg:col-span-7 flex flex-col bg-card border border-foreground/10 p-3 shadow-sm order-1 lg:order-2">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-foreground/10 mb-3 pb-6">
            <div>
              <h3 className="font-brand font-extrabold text-3xl text-foreground mb-2 tracking-wide uppercase">Imah Keramik Bogor</h3>
              <p className="text-muted-foreground font-sans text-sm max-w-xs leading-relaxed">
                Jl. Pembangunan No.22/23A, Kedunghalang,<br />
                Bogor Utara, Kota Bogor, Jawa Barat 16158.<br />
                Selasa — Minggu, 10:00 — 18:00 WIB.
              </p>
            </div>
            <div className="uppercase tracking-widest text-[10px] font-mono border border-foreground/20 px-2 py-1 bg-background">Lokasi Studio</div>
          </div>

          <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-muted grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-foreground/10">
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
