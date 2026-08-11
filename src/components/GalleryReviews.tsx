import { useState, useEffect, useRef } from 'react';
import { Container } from './Container';

export const GalleryReviews = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Spatial Delay Calculator: Guarantees perfect visual stagger regardless of how CSS columns wrap the items!
  useEffect(() => {
    const calculateDelays = () => {
      if (!gridRef.current) return;
      const cards = Array.from(gridRef.current.children) as HTMLElement[];
      
      const colMap = new Map<number, HTMLElement[]>();
      cards.forEach((card) => {
        // Skip elements that are hidden on the current viewport (e.g. mobile hides cards 4-15)
        if (card.offsetWidth === 0 && card.offsetHeight === 0) return;
        
        const rect = card.getBoundingClientRect();
        // Group by physical X position (rounded to 20px to ignore subpixel rounding differences)
        const xPos = Math.round(rect.left / 20) * 20; 
        if (!colMap.has(xPos)) colMap.set(xPos, []);
        colMap.get(xPos)!.push(card);
      });

      // Sort columns left-to-right
      const sortedXs = Array.from(colMap.keys()).sort((a, b) => a - b);
      
      sortedXs.forEach((x, colIdx) => {
        const colCards = colMap.get(x)!;
        // Sort cards within the column top-to-bottom
        colCards.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        
        colCards.forEach((card, rowIdx) => {
          // Exact user request: +delay per column, +delay per row
          const delay = (colIdx * 80) + (rowIdx * 100);
          card.style.setProperty('--reveal-delay', `${delay}ms`);
        });
      });
    };

    calculateDelays();
    window.addEventListener('resize', calculateDelays);
    return () => window.removeEventListener('resize', calculateDelays);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // All 16 real Google Reviews from Imah Keramik Bogor customers with exact direct Google share links
  // Array is ordered Left-to-Right, Top-to-Bottom:
  // Items 0..3 are the top row across the 4 columns (and top 4 highlights for mobile)
  const reviews = [
    // --- Row 1 (Top Cards / Mobile Highlights) ---
    {
      author: "Anisa S.",
      time: "12:15",
      quote: "Pengalaman pertama membuat mangkok dari tanah liat dan membatik 😍💕 paket liburan 100rb per org. Cocok nih buat ide liburan anak sekolah..ada guidenya jadi bisa diajarin membuat gerabah, hasil karya bisa dibawa pulang...seru banget 😍👍",
      url: "https://share.google/iN2EGFT6ElyXZmOiN",
      img: "https://images.unsplash.com/photo-1662844681461-8c16d05b0582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Hasil kreasi tanah liat mangkok",
      aspect: "aspect-[16/9]"
    },
    {
      author: "Devi A.",
      time: "13:00",
      quote: "Ikut kelas Clay dan Belajar membatik di media kayu. Seru banget, tempatnya adem, luas dan owner nya ramah banget. Keren",
      url: "https://share.google/QKQUj9dLy21prRArB",
      img: "https://images.unsplash.com/photo-1582140099533-11fe4d348e01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Belajar membatik media kayu",
      aspect: "aspect-[4/3]"
    },
    {
      author: "Nafisa D.",
      time: "16:45",
      quote: "Ibu dan bapanya sangat ramah sekali, disini ada fun clay dan juga membatik, saya kemaren ambil paket yg harga 100k udh bisa fun clay dan membatik, dan seru juga guyss, disini kalian bisa reservasi h-1 sebelum ketempat ini yaaa, bisa grup bisa individu",
      url: "https://share.google/10vpqXBLaoJqy6S4X",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Paket Fun Clay dan Membatik",
      aspect: "aspect-[16/10]"
    },
    {
      author: "Mahardika C.",
      time: "18:50",
      quote: "Seru banget, dapet insight baru juga tentang keramik dan batik yang medianya ga biasa, best",
      url: "https://share.google/NMvowb2LhvsHne2XV",
      img: "https://images.unsplash.com/photo-1508269151431-a34449ca161d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Insight workshop keramik dan batik",
      aspect: "aspect-[21/9]"
    },

    // --- Row 2 ---
    {
      author: "Dwi T.",
      time: "15:25",
      quote: "Tempat wisata edukatif semua usia, menyenangkan utk mulai Belajar membuat kreasi keramik dari Tanah liat, Dan jg menbatik di kayu,, jg proses pewarnaannya,, pertama Kali kesini agenda outing ktr pas weekday, ketemu pemilik Lgsg sekaligus pemandunya Dan mereka sangat ramah bersahaja Dan tidak Pelit berbagi ilmu , jg Bisa humoris pas break time disediakan snack, kopi Dan Teh manis hangat,, Sangat welcome bagi siapa sja yg dtg mau Belajar Dan berkreasi,, tempatnya luas, Mushola dan toilet ada Dan Nyaman, Suasana Di Sana jg adem, rasanya mau balik lg kesini dengan anak anak krn pasti akan seru 🤩🥰🤗",
      url: "https://share.google/W7QORv3ydk2OqpV1x",
      img: "https://images.unsplash.com/photo-1621846323386-a60faf26f962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Proses edukasi kriya keramik",
      aspect: "aspect-[3/2]"
    },
    {
      author: "Dedi S.",
      time: "14:10",
      quote: "Utk anak2 belajar mandiri dan kreatif ,, dengan suasana yg Asri 👍👍👍",
      url: "https://share.google/P4aEr88qUajj4HfkH",
    },
    {
      author: "Herman H.",
      time: "16:05",
      quote: "Senang sekali bisa mengunjungi Imah keramik, ownernya ramah sekali, tempatnya nyaman, sangat edukatif. Cocok buat pelajar, mahasiswa dan keluarga…Terima kasih owner (pak Catur dan Bu Dewi)",
      url: "https://share.google/nISEjbZO0ar5IeS1T",
    },
    {
      author: "Qadariah E.",
      time: "14:50",
      quote: "Untuk wahana edukasi dann kreasi anak sangat cocok memperkenalkan handcraft. Tempatnya luas jadi sangat cocok untuk tempat edukasi tentang kriya keramik.",
      url: "https://share.google/CZ6qTF9zfKJVF8gCy",
    },

    // --- Row 3 ---
    {
      author: "Satya M.",
      time: "11:45",
      quote: "SERU BANGET ! Terimakasih banyak bapak dan ibu yang udah ikut membantu proses tugas kami pak, kegiatan nya seru banget dan sangat informatif dan menginspirasi 🤩",
      url: "https://share.google/JCfk8ROHTkCCMXW2e",
    },
    {
      author: "Irwan B.",
      time: "11:05",
      quote: "Suasana nyaman, seperti sedang di kampung; dipandu dengan baik dan ramah dalam berkreasi...",
      url: "https://share.google/v50zBANRkD79q6sTh",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Suasana nyaman seperti di kampung",
      aspect: "aspect-[14/9]"
    },
    {
      author: "Dhiya U.",
      time: "17:30",
      quote: "Seru banget, ibu dan bapak ramah dan sabar dalam mengajar, dan tentunya keren-keren karyanya🫶",
      url: "https://share.google/GHPzTV6OofVqpOhbC",
      img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Hasil karya kreasi keramik",
      aspect: "aspect-square"
    },
    {
      author: "Sarah M.",
      time: "20:00",
      quote: "Pengalaman yang sangat menenangkan. Instruktur sangat sabar, dan saya pulang membawa vas hasil buatan sendiri! ❤️",
      url: "https://share.google/SbD4qFhPDBh0mc8xI",
      img: "https://images.unsplash.com/photo-1662844681461-8c16d05b0582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      alt: "Hasil buatan vas keramik",
      aspect: "aspect-[5/4]"
    },

    // --- Row 4 ---
    {
      author: "Siti J.",
      time: "10:14",
      quote: "they welcome customers warmly, kebetulan dateng kesini after 4 days lebaran jadi sepi bgt dan belum beroperasi juga karena karyawan lainnya lagi pada mudik hihi tapi tetep welcome buat yg mau coba kerajinan disini seru bgt kita di ajak tour dulu liat' sekitar tempat pembuatannya dan tentunya kita di temenin sama pekerja disana juga paa kita lagi buat kerajinan pokoknya org' disanaa baik' ramah' poll jadi nyaman kitanya hehe",
      url: "https://share.google/725tcptBt413Djn6K",
    },
    {
      author: "Chika N.",
      time: "13:40",
      quote: "Tempat yang fun dan edukatif, seru untuk menghabiskan waktu bersama sahabat juga cocok buat mengisi waktu bersama anak mau remaja supaya lepas dari gadget. Bapak dan ibunya juga sangat ramah dan edukatif saat mendampingi kita membatik atau membuat fun clay.",
      url: "https://share.google/HGy64LPR2DjqPG2Sz",
    },
    {
      author: "Zahwatul J.",
      time: "18:10",
      quote: "Seru banget buat belajar hal baru, help full dan baik banget karena sebelumnya ga pernah belajar bikin clay dan batik. Saran buat pengunjung bikin clay yang mudah di bawa karena harus jemur sendiri di rumah",
      url: "https://share.google/gNXlUu4RTAkAxl8Ng",
    },
    {
      author: "Madamr",
      time: "19:30",
      quote: "Tempatnya luas dan teduh. Bapak dan ibunya sangat ramah. Penjelasan untuk workshopnya juga menyeluruh dan sangat membantu.",
      url: "https://share.google/V4QBbs356VQ4QqFvX",
    }
  ];

  return (
    <section ref={sectionRef} id="gallery" className="pt-12 pb-6 md:pt-16 md:pb-8 bg-background overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-foreground/20 pb-4">
          <div>
            <div className="mb-3">
              <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-3 py-1.5 font-bold text-foreground inline-block">
                Google Reviews
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground uppercase tracking-tighter leading-none">
              Ulasan Peserta.
            </h2>
          </div>
          <p className="text-muted-foreground font-sans text-xs md:text-sm text-left md:text-right max-w-md leading-relaxed pb-0.5">
            Ulasan jujur dari peserta di Google Reviews.<br className="hidden md:inline" /> Klik bubble untuk buka langsung di Google Maps.
          </p>
        </div>

        {/* 4-Column Pinterest-style Masonry Grid */}
        <div ref={gridRef} className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className={`modal-reveal-panel ${visible ? 'modal-reveal-panel-visible' : ''} break-inside-avoid w-full ${
                idx >= 4 ? 'hidden sm:block' : 'block'
              }`}
            >
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white text-[#111b21] rounded-md rounded-tl-none p-3 shadow-sm hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer border border-black/5 block w-full h-full"
              >
              {/* WhatsApp Top-Left White Speech Tail */}
              <svg className="absolute -top-[1px] -left-2 text-white" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M10 0C6 0 0 0 0 10V0H10Z" />
              </svg>

              {/* Author Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-sans font-bold text-xs text-foreground">
                  {review.author}
                </span>
                <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-black/5 text-[#54656f] flex items-center gap-1 font-semibold shrink-0">
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  Google Review
                </span>
              </div>

              {/* Participant's Creation Image (Optional) */}
              {review.img && (
                <div className={`relative overflow-hidden rounded-sm bg-black/5 mb-2 w-full ${review.aspect}`}>
                  <img
                    src={review.img}
                    alt={review.alt || "Karya peserta"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-[10px] px-2 py-0.5 rounded-full font-sans font-medium text-[#111b21] shadow-md transition-opacity duration-200">
                      Buka di Maps ↗
                    </span>
                  </div>
                </div>
              )}

              {/* Review Text */}
              <p className="font-sans text-xs text-[#111b21] leading-relaxed mb-2.5">
                {review.quote}
              </p>

              {/* Footer: WhatsApp Timestamp + Double Checkmark */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-1">
                <span>{review.time}</span>
                <svg viewBox="0 0 16 11" width="12" height="9" fill="#53bdeb">
                  <path d="M15.01 3.316l-6.59 6.591L4.83 6.316l.896-.896 2.7 2.7 5.69-5.69.894.896zm-4.7 0l-.895-.896-4.8 4.8-1.8-1.8-.896.896 2.7 2.7 5.69-5.69z" />
                </svg>
              </div>
            </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
