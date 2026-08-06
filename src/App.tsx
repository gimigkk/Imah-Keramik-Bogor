import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BentoTickets from './components/BentoTickets';
import { Container } from './components/Container';
import { SmoothScroll } from './components/SmoothScroll';

const Hero = () => (
  <section id="about" className="relative pt-6 md:pt-10 pb-12 md:pb-24 border-b border-foreground/20 bg-background">
    <Container>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 md:mb-16 gap-6 md:gap-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="inline-block border border-foreground px-2.5 py-0.5 leading-none text-[10px] md:text-xs font-mono uppercase tracking-widest rounded-full">
              OPEN
            </span>
            <span className="font-mono text-[11px] md:text-xs text-muted-foreground uppercase tracking-widest">
              HARI INI: 10:00 - 18:00
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] md:leading-[0.9] tracking-tight uppercase">
            Wisata edukasi <br />
            <span className="font-accent italic font-normal text-[0.85em] tracking-normal text-foreground/90 lowercase">tanah liat & Keramik</span>
          </h1>
        </div>

        <div className="text-left lg:text-right font-sans lg:max-w-xs flex flex-col justify-end border-l lg:border-l-0 lg:border-r border-foreground/20 pl-4 lg:pl-0 lg:pr-6 py-1">
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1 font-mono">Lokasi</p>
          <p className="text-xs md:text-sm lg:text-base text-foreground mb-4 md:mb-6 font-medium">Imah Keramik Bogor<br />Studio Terbuka Jawa Barat</p>
          <a
            href="#activities"
            className="border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors inline-block w-fit lg:ml-auto"
          >
            Lihat paket!
          </a>
        </div>
      </div>

      {/* Massive Cinematic Video */}
      <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted relative border border-foreground/10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1609881583302-61548332039c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-90"
        >
          <source src="/assets/videos/hero/studio-process.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-6 left-6 bg-background/90 backdrop-blur px-4 py-2 text-xs font-mono uppercase tracking-widest hidden md:block border border-foreground/10">
          Vid. 1: Teknik Putar
        </div>
      </div>
    </Container>
  </section>
);



const GalleryReviews = () => {
  const reviews = [
    {
      img: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Vase keramik putih dan coklat",
      quote: "Pengalaman yang menenangkan. Instruktur sangat sabar, dan saya pulang membawa vas yang benar-benar saya gunakan setiap hari.",
      author: "Sarah M.",
      type: "Teknik Putar"
    },
    {
      img: "https://images.unsplash.com/photo-1590605095243-072811dbe64c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Memegang pot tanah liat putih",
      quote: "Belum pernah menyentuh tanah liat sebelumnya, tapi mereka membuatnya sangat mudah. Pelarian akhir pekan yang sempurna dari kota.",
      author: "Budi P.",
      type: "Teknik Tangan"
    },
    {
      img: "https://images.unsplash.com/photo-1517045261157-8b3682044fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Pot tanah liat bulat di telapak tangan",
      quote: "Tempatnya sendiri sangat indah dan menginspirasi. Sangat merekomendasikan acara privat untuk kelompok kecil.",
      author: "Elena R.",
      type: "Acara Privat"
    },
  ];

  return (
    <section id="gallery" className="py-24 bg-background">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-foreground/20 pb-8">
          <h2 className="font-serif text-5xl md:text-7xl text-foreground uppercase tracking-tighter leading-[0.85]">Karya Sebelumnya <br /><span className="font-accent italic font-normal text-[0.85em] tracking-normal text-foreground/80 lowercase">&amp; ulasan</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reviews.map((review, idx) => (
            <div key={idx} className="flex flex-col group border border-foreground/10 p-4 pb-6 bg-card hover:shadow-md transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted mb-6">
                <img
                  src={review.img}
                  alt={review.alt}
                  className="w-full h-full object-cover filter grayscale opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col flex-grow px-2">
                <div className="flex justify-between items-center mb-4 border-b border-foreground/10 pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{review.type}</span>
                  <div className="flex gap-0.5 text-foreground">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[10px]">★</span>
                    ))}
                  </div>
                </div>
                <blockquote className="font-serif text-lg text-foreground mb-6 flex-grow italic">
                  "{review.quote}"
                </blockquote>
                <div className="text-xs font-sans font-bold uppercase tracking-widest text-foreground">
                  — {review.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const CTA = () => (
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

export default function App() {
  return (
    <>
      <SmoothScroll />
      <div id="top" className="min-h-screen font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
        <Navbar />
        <main>
          <Hero />
          <BentoTickets />
          <GalleryReviews />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
