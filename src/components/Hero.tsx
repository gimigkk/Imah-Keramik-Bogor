import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from './Container';
import { getTodayScheduleWIB } from '../data/schedule';
import { site } from '../data/site';

const heroVideos = [
  { id: 1, title: 'Teknik Putar', src: '/assets/videos/hero/studio-process.mp4', webmSrc: '/assets/videos/hero/studio-process.webm' },
  { id: 2, title: 'Teknik Tangan', src: '/assets/videos/hero/studio-process.mp4', webmSrc: '/assets/videos/hero/studio-process.webm' },
  { id: 3, title: 'Proses Pembakaran', src: '/assets/videos/hero/studio-process.mp4', webmSrc: '/assets/videos/hero/studio-process.webm' },
];

// TODO(company): Hero copy, location claim, image alt text, video assets, and activity labels are concept content pending company approval. See CONCEPT_HANDOFF.md.

interface HeroProps {
  introStarted?: boolean;
  videoEnabled?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ introStarted, videoEnabled = true }) => {
  const [visible, setVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const todaySchedule = getTodayScheduleWIB();
  const currentVideo = heroVideos[activeVideo];

  useEffect(() => {
    if (introStarted === undefined) {
      // Fallback for standalone usage
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    } else if (introStarted) {
      setVisible(true);
    }
  }, [introStarted]);

  const handlePrevVideo = () => {
    setActiveVideo((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setActiveVideo((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="about" className="relative pt-20 md:pt-24 pb-6 md:pb-12 border-b border-foreground/20 bg-background">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 md:gap-10">
          <div className="max-w-4xl">
            <div
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex items-center gap-3 md:gap-4 mb-4 md:mb-6`}
              style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
            >
              <span className={`inline-block border ${!todaySchedule.isOpenNow ? 'border-foreground/50 text-foreground/50' : 'border-foreground'} px-2.5 py-0.5 leading-none text-[10px] md:text-xs font-mono uppercase tracking-widest rounded-full`}>
                {!todaySchedule.isOpenNow ? 'CLOSED' : 'OPEN'}
              </span>
              <span className="font-mono text-[11px] md:text-xs text-muted-foreground uppercase tracking-widest">
                {todaySchedule.displayText}
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
              {site.name}<br />Studio Terbuka Jawa Barat
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
          <img
            src="/assets/images/hero-poster.webp"
            alt={`Proses membentuk tanah liat di studio ${site.name}`}
            width="1280"
            height="720"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {videoEnabled && (
            <video
              autoPlay={!reduceMotion}
              loop
              muted
              playsInline
              preload={reduceMotion ? 'none' : 'metadata'}
              poster="/assets/images/hero-poster.webp"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={currentVideo.webmSrc} type="video/webm" />
              <source src={currentVideo.src} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Video Controls */}
        <div
          className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex justify-between items-center px-1`}
          style={{ '--reveal-delay': '720ms' } as React.CSSProperties}
        >
          <div className="font-accent italic text-base md:text-lg text-foreground/90 lowercase">
            vid. {activeVideo + 1}: {currentVideo.title}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={handlePrevVideo}
              className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-sm border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              aria-label="Video sebelumnya"
            >
              <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
            <div className="flex gap-1.5 md:gap-2 mx-1">
              {heroVideos.map((_, idx) => (
                <div
                  key={idx}
                  aria-hidden="true"
                  className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-none transition-colors duration-500 ${idx === activeVideo ? 'bg-foreground' : 'bg-foreground/20'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNextVideo}
              className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-sm border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              aria-label="Video berikutnya"
            >
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
