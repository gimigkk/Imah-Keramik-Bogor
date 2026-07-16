import React from 'react';
import { Container } from './Container';

export const BentoTickets: React.FC = () => {
  return (
    <section id="activities" className="py-24 bg-card border-b border-foreground/10 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <Container className="relative z-10">
        <div className="mb-16 md:flex justify-between items-end gap-8 border-b border-foreground/20 pb-8">
          <div>
            <h2 className="font-serif text-6xl md:text-8xl text-foreground uppercase tracking-tighter leading-[0.85]">Pilih Wisata.</h2>
          </div>
          <p className="text-muted-foreground font-sans text-sm max-w-sm mt-6 md:mt-0 text-left md:text-right">
            Pilih tiket untuk mendaftar. Tempat sangat terbatas untuk memastikan perhatian individu secara maksimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto] md:auto-rows-[380px]">

          {/* HORIZONTAL TICKET - 2 cols, 1 row */}
          <div className="md:col-span-2 md:row-span-1 bg-background border border-foreground/20 shadow-sm flex flex-col sm:flex-row group hover:shadow-md transition-shadow">
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground text-background font-bold">favorit</span>
                <span className="font-mono text-sm text-muted-foreground tracking-widest">IKB-001</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 h-full mt-4">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3 leading-tight">Teknik<br />Putar</h3>
                  <p className="text-muted-foreground font-sans text-sm max-w-sm">Pelajari teknik memukau membentuk tanah liat di atas roda putar. Sempurna untuk membuat mangkuk, cangkir, dan vas.</p>
                </div>
                <div className="w-full md:w-5/12 aspect-video md:aspect-auto h-full border border-foreground/10 overflow-hidden bg-muted relative">
                  <img src="https://images.unsplash.com/photo-1662844681461-8c16d05b0582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Wheel Throwing" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
              </div>

            </div>
            <div className="relative border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-foreground/20 flex-shrink-0">
              <div className="hidden sm:block absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-b border-foreground/20" />
              <div className="hidden sm:block absolute bottom-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 translate-y-1/2 border-t border-foreground/20" />

              <div className="sm:hidden absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-foreground/20" />
              <div className="sm:hidden absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-foreground/20" />
            </div>
            <div className="w-full sm:w-[180px] md:w-[200px] p-6 md:p-8 flex flex-col justify-center items-center text-center bg-secondary/10">
              <div className="w-full">
                <p className="uppercase tracking-[0.2em] text-[10px] text-muted-foreground mb-2 font-mono">1 Tiket Masuk</p>
                <p className="font-mono text-2xl text-foreground mb-1">Rp 350K</p>
                <p className="font-sans text-[10px] text-muted-foreground">2.5 Jam</p>
              </div>
            </div>
          </div>

          {/* VERTICAL TICKET - 1 col, 2 rows */}
          <div className="md:col-span-1 md:row-span-2 bg-background border border-foreground/20 shadow-sm flex flex-col group hover:shadow-md transition-shadow h-full">
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground text-background font-bold">favorit</span>
                <span className="font-mono text-sm text-muted-foreground tracking-widest">IKB-002</span>
              </div>
              <div className="mb-6">
                <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3 leading-tight">Teknik<br />Tangan</h3>
                <p className="text-muted-foreground font-sans text-sm">Cubit, gulung, dan pipihkan tanah liat untuk membuat karya unik tanpa perlu roda putar. Sangat cocok untuk pemula.</p>
              </div>
              <div className="w-full flex-grow bg-muted min-h-[160px] overflow-hidden border border-foreground/10 relative">
                <img src="https://images.unsplash.com/photo-1621846323386-a60faf26f962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Handbuilding" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
            </div>
            <div className="relative border-t-2 border-dashed border-foreground/20 flex-shrink-0 w-full">
              <div className="absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-foreground/20" />
              <div className="absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-foreground/20" />
            </div>
            <div className="w-full p-6 md:p-8 flex items-center justify-between bg-secondary/10">
              <div className="text-left">
                <p className="uppercase tracking-[0.2em] text-[10px] text-muted-foreground mb-1 font-mono">1 Tiket Masuk</p>
                <p className="font-mono text-2xl text-foreground">Rp 250K</p>
              </div>
            </div>
          </div>

          {/* SQUARE TICKET 1 - 1 col, 1 row */}
          <div className="md:col-span-1 md:row-span-1 bg-background border border-foreground/20 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
            <div className="flex-1 p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1">Penyelesaian</span>
                <span className="font-mono text-sm text-muted-foreground tracking-widest">IKB-003</span>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Glasir & Lukis</h3>
              <p className="text-muted-foreground font-sans text-xs mb-4">Hidupkan karya setengah matang Anda dengan berbagai pilihan warna dan glasir kami.</p>

              <div className="w-full flex-grow bg-muted overflow-hidden border border-foreground/10 relative min-h-[100px]">
                <img src="https://images.unsplash.com/photo-1582140099533-11fe4d348e01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Glazing & Paint" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
            </div>
            <div className="relative border-t-2 border-dashed border-foreground/20 flex-shrink-0 w-full">
              <div className="absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-foreground/20" />
              <div className="absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-foreground/20" />
            </div>
            <div className="w-full p-4 px-6 flex items-center justify-between bg-secondary/10">
              <p className="font-mono text-lg text-foreground">Rp 150K</p>
            </div>
          </div>

          {/* SQUARE TICKET 2 - 1 col, 1 row */}
          <div className="md:col-span-1 md:row-span-1 bg-[#5c3a28] text-background border border-foreground/20 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
            <div className="flex-1 p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="uppercase tracking-widest text-[10px] font-mono border border-background/50 px-2 py-1 text-background/80">Grup</span>
                <span className="font-mono text-sm text-background/50 tracking-widest">IKB-GRP</span>
              </div>
              <h3 className="font-serif text-2xl text-background mb-2">Acara Privat</h3>
              <p className="text-background/70 font-sans text-xs mb-4">Pesan studio kami untuk acara team building, ulang tahun, atau hari kreatif bersama.</p>

              <div className="w-full flex-grow bg-muted overflow-hidden border border-background/20 relative min-h-[100px]">
                <img src="https://images.unsplash.com/photo-1508269151431-a34449ca161d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Private Events" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 mix-blend-luminosity" />
              </div>
            </div>
            <div className="relative border-t-2 border-dashed border-background/30 flex-shrink-0 w-full">
              <div className="absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-background/20" />
              <div className="absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-background/20" />
            </div>
            <div className="w-full p-4 px-6 flex items-center justify-between bg-background/5">
              <p className="font-mono text-lg text-background/80">Kustom</p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default BentoTickets;
