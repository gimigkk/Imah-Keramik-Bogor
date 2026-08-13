import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from './Container';
import { getTodayScheduleWIB } from '../data/schedule';
import { site } from '../data/site';
import { mediaAssets } from '../data/assets';
import { getYouTubeId } from '../utils/youtube';

export interface HeroVideo {
  id: number;
  title: string;
  type: 'youtube' | 'local';
  youtubeUrl?: string;
  youtubeId?: string;
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
}


const heroVideos: HeroVideo[] = [
  {
    id: 1,
    title: 'Imah Keramik Bogor | BBO Documentary',
    type: 'youtube',
    youtubeUrl: mediaAssets.hero.youtubeUrl,
    youtubeId: mediaAssets.hero.youtubeId,
    poster: mediaAssets.hero.poster,
  },
  {
    id: 2,
    title: 'Seni Membuat Kerajinan Keramik - Imah Keramik Bogor | BBO Preneur',
    type: 'youtube',
    youtubeUrl: mediaAssets.hero.youtubeUrl2,
    youtubeId: mediaAssets.hero.youtubeId2,
    poster: mediaAssets.hero.poster,
  },
  {
    id: 3,
    title: 'Kreasi Keramik di Imah Keramik Bogor dan Batik Ayu Dewi',
    type: 'youtube',
    youtubeUrl: mediaAssets.hero.youtubeUrl3,
    youtubeId: mediaAssets.hero.youtubeId3,
    poster: mediaAssets.hero.poster,
  },
];

// TODO(company): Hero copy, location claim, image alt text, video assets, and activity labels are concept content pending company approval. See CONCEPT_HANDOFF.md.

interface HeroProps {
  introStarted?: boolean;
  videoEnabled?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ introStarted, videoEnabled = true }) => {
  const [visible, setVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
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

  const handlePrevVideo = useCallback(() => {
    setActiveVideo((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1));
  }, []);

  const handleNextVideo = useCallback(() => {
    setActiveVideo((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1));
  }, []);

  // Play active video iframe and pause inactive video iframes automatically on video change
  useEffect(() => {
    if (!videoEnabled) return;

    heroVideos.forEach((_, idx) => {
      const iframe = iframeRefs.current[idx];
      if (!iframe || !iframe.contentWindow) return;

      try {
        if (idx === activeVideo) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        } else {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
            '*'
          );
        }
      } catch {
        // Ignore cross-origin issues
      }
    });
  }, [activeVideo, videoEnabled]);

  // Listen for YouTube embed ENDED state or time end to auto-advance
  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      if (typeof event.origin === 'string' && !event.origin.includes('youtube')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        const isEndedState =
          (data?.event === 'infoDelivery' && data?.info?.playerState === 0) ||
          data?.info?.playerState === 0 ||
          data?.playerState === 0 ||
          (data?.event === 'onStateChange' && data?.info === 0);

        const isTimeEnded =
          data?.info?.currentTime &&
          data?.info?.duration &&
          data.info.duration > 0 &&
          data.info.currentTime >= data.info.duration - 1;

        if (isEndedState || isTimeEnded) {
          handleNextVideo();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleYouTubeMessage);
    return () => window.removeEventListener('message', handleYouTubeMessage);
  }, [handleNextVideo]);

  return (
    <section id="about" className="relative pt-20 md:pt-24 pb-6 md:pb-12 border-b border-foreground/20 bg-background">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 md:gap-10">
          <div className="w-full max-w-4xl flex flex-col items-start text-left">
            <div
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex items-center justify-start gap-3 md:gap-4 mb-4 md:mb-6`}
              style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
            >
              <span className={`inline-flex items-center justify-center border ${!todaySchedule.isOpenNow ? 'border-foreground/50 text-foreground/50' : 'border-foreground'} px-2.5 h-5 md:h-6 text-[10px] md:text-xs font-mono uppercase tracking-wider rounded-full`}>
                {!todaySchedule.isOpenNow ? 'CLOSED' : 'OPEN'}
              </span>
              <span className="font-mono text-[11px] md:text-xs text-muted-foreground uppercase tracking-widest">
                {todaySchedule.displayText}
              </span>
            </div>
            <h1 className="font-serif text-[11.2vw] sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] md:leading-[0.9] tracking-tight uppercase flex flex-col">
              <span
                className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} block whitespace-nowrap`}
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
            className="hidden lg:flex text-right font-sans max-w-xs flex-col justify-end border-r border-foreground/20 pr-6 py-1"
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
              className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors inline-block w-fit ml-auto`}
              style={{ '--reveal-delay': '600ms' } as React.CSSProperties}
            >
              Lihat paket!
            </a>
          </div>
        </div>

        {/* Massive Cinematic Video Slider */}
        <div id="hero-video-container" className="w-full aspect-video md:aspect-[377/180] overflow-hidden bg-[#0d0d0d] relative border border-foreground/10 mb-4">
          <div
            className="absolute inset-0 flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{
              width: `${heroVideos.length * 100}%`,
              transform: `translateX(-${(activeVideo * 100) / heroVideos.length}%)`,
            }}
          >
            {heroVideos.map((vid, idx) => {
              const isSelected = idx === activeVideo;
              const ytId = vid.type === 'youtube'
                ? (vid.youtubeId || getYouTubeId(vid.youtubeUrl))
                : null;

              return (
                <div
                  key={vid.id}
                  style={{ width: `${100 / heroVideos.length}%` }}
                  className="relative h-full flex-shrink-0 bg-[#0d0d0d] overflow-hidden"
                >
                  <img
                    src={vid.poster || mediaAssets.hero.poster}
                    alt={vid.title}
                    width="1280"
                    height="720"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {videoEnabled && (
                    ytId ? (
                      <iframe
                        ref={(el) => {
                          iframeRefs.current[idx] = el;
                        }}
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${isSelected ? 1 : 0}&mute=1&loop=0&controls=1&rel=0&playsinline=1&enablejsapi=1`}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
                        className="absolute inset-0 w-full h-full border-0 z-10"
                      />
                    ) : (
                      <video
                        autoPlay={isSelected && !reduceMotion}
                        muted
                        playsInline
                        preload="auto"
                        poster={vid.poster || mediaAssets.hero.poster}
                        onEnded={() => {
                          if (isSelected) handleNextVideo();
                        }}
                        style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
                        className="absolute inset-0 h-full w-full object-cover z-10"
                      >
                        {vid.videoWebm && <source src={vid.videoWebm} type="video/webm" />}
                        {vid.videoMp4 && <source src={vid.videoMp4} type="video/mp4" />}
                      </video>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Controls */}
        <div
          className={`intro-float-panel ${visible ? 'intro-float-panel-visible' : ''} flex justify-between items-center px-1`}
          style={{ '--reveal-delay': '720ms' } as React.CSSProperties}
        >
          <div className="font-accent italic text-base md:text-lg text-foreground/90 lowercase truncate min-w-0 pr-2">
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

