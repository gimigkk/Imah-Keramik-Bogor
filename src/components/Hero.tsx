import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from './Container';

const heroVideos = [
  { id: 1, title: 'Teknik Putar', src: '/assets/videos/hero/studio-process.mp4' },
  { id: 2, title: 'Teknik Tangan', src: '/assets/videos/hero/studio-process.mp4' },
  { id: 3, title: 'Proses Pembakaran', src: '/assets/videos/hero/studio-process.mp4' },
];

export const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    // The intro splash holds for 2200ms and morphs for 1100ms (total 3300ms).
    // Start this animation 500ms before the morph finishes (at 2800ms).
    const timer = setTimeout(() => setVisible(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  const handlePrevVideo = () => {
    setActiveVideo((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setActiveVideo((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="about" className="relative pt-6 md:pt-10 pb-6 md:pb-12 border-b border-foreground/20 bg-background">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 md:gap-10">
          <div className="max-w-4xl">
            <div
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex items-center gap-3 md:gap-4 mb-4 md:mb-6`}
              style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
            >
              <span className="inline-block border border-foreground px-2.5 py-0.5 leading-none text-[10px] md:text-xs font-mono uppercase tracking-widest rounded-full">
                OPEN
              </span>
              <span className="font-mono text-[11px] md:text-xs text-muted-foreground uppercase tracking-widest">
                HARI INI: 10:00 - 18:00
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] md:leading-[0.9] tracking-tight uppercase flex flex-col">
              <span
                className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} block`}
                style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
              >
                Wisata edukasi
              </span>
              <span
                className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} block`}
                style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
              >
                <span className="font-accent italic font-normal text-[0.85em] tracking-normal text-foreground/90 lowercase">tanah liat & Keramik</span>
              </span>
            </h1>
          </div>

          <div
            className="text-left lg:text-right font-sans lg:max-w-xs flex flex-col justify-end border-l lg:border-l-0 lg:border-r border-foreground/20 pl-4 lg:pl-0 lg:pr-6 py-1"
          >
            <p
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1 font-mono`}
              style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
            >
              Lokasi
            </p>
            <p
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} text-xs md:text-sm lg:text-base text-foreground mb-4 md:mb-6 font-medium`}
              style={{ '--reveal-delay': '480ms' } as React.CSSProperties}
            >
              Imah Keramik Bogor<br />Studio Terbuka Jawa Barat
            </p>
            <a
              href="#activities"
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors inline-block w-fit lg:ml-auto`}
              style={{ '--reveal-delay': '600ms' } as React.CSSProperties}
            >
              Lihat paket!
            </a>
          </div>
        </div>

        {/* Massive Cinematic Video */}
        <div id="hero-video-container" className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#0d0d0d] relative border border-foreground/10 mb-4">
          {heroVideos.map((video, idx) => (
            <video
              key={video.id}
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1609881583302-61548332039c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
              className={`absolute inset-0 w-full h-full object-cover filter grayscale transition-opacity duration-1000 ease-in-out ${
                idx === activeVideo ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <source src={video.src} type="video/mp4" />
            </video>
          ))}
        </div>

        {/* Video Controls */}
        <div
          className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex justify-between items-center px-1`}
          style={{ '--reveal-delay': '720ms' } as React.CSSProperties}
        >
          <div className="font-accent italic text-base md:text-lg text-foreground/90 lowercase">
            vid. {activeVideo + 1}: {heroVideos[activeVideo].title}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handlePrevVideo}
              className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-sm border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 focus:outline-none"
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <div className="flex gap-1.5 md:gap-2 mx-1">
              {heroVideos.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-none transition-colors duration-500 ${idx === activeVideo ? 'bg-foreground' : 'bg-foreground/20'}`}
                />
              ))}
            </div>
            <button
              onClick={handleNextVideo}
              className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-sm border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 focus:outline-none"
              aria-label="Next Video"
            >
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
