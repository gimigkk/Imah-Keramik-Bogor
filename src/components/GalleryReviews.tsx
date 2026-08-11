import { Container } from './Container';

export const GalleryReviews = () => {
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
    <section id="gallery" className="pt-6 pb-12 md:pt-12 md:pb-24 bg-background">
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
                  className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100"
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
                  - {review.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
