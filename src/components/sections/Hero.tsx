import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Container } from '../layout/Container';
import { getTodayScheduleWIB } from '../../data/schedule';
import { mediaAssets } from '../../data/assets';
import { getYouTubeId } from '../../utils/youtube';

const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

const getYouTubeThumbnail = (youtubeId: string): string =>
  `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

const getYouTubeFallbackThumbnail = (youtubeId: string): string =>
  `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;

export interface HeroVideo {
  id: number;
  title: string;
  type: 'youtube' | 'local';
  youtubeUrl?: string;
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
    poster: mediaAssets.hero.poster,
  },
  {
    id: 2,
    title: 'Seni Membuat Kerajinan Keramik - Imah Keramik Bogor | BBO Preneur',
    type: 'youtube',
    youtubeUrl: mediaAssets.hero.youtubeUrl2,
    poster: mediaAssets.hero.poster,
  },
  {
    id: 3,
    title: 'Kreasi Keramik di Imah Keramik Bogor dan Batik Ayu Dewi',
    type: 'youtube',
    youtubeUrl: mediaAssets.hero.youtubeUrl3,
    poster: mediaAssets.hero.poster,
  },
];

// TODO(company): Hero copy, location claim, image alt text, video assets, and activity labels are concept content pending company approval. See CONCEPT_HANDOFF.md.

interface TrustSlot {
  id: number;
  tag: string;
  line1: string;
  line2: string;
}

const trustSlots: TrustSlot[] = [
  {
    id: 1,
    tag: 'LOKASI',
    line1: 'Imah Keramik Bogor',
    line2: 'Studio Terbuka Jawa Barat',
  },
  {
    id: 2,
    tag: 'ULASAN GOOGLE',
    line1: '4.9 ★★★★★ Rating',
    line2: '91 Ulasan Google',
  },
  {
    id: 3,
    tag: 'HASIL KARYA',
    line1: '100% Bawa Pulang',
    line2: 'Hasil Kreasi Studio',
  },
  {
    id: 4,
    tag: 'EDUKASI PEMULA',
    line1: '100% Didampingi',
    line2: 'Mentor Ramah & Sabar',
  },
  {
    id: 5,
    tag: 'REKOR STUDIO',
    line1: '+5.000 Karya',
    line2: 'Wisata Keramik #1 Bogor',
  },
];

const marqueeSlots = [...trustSlots, ...trustSlots, ...trustSlots, ...trustSlots];

export const Hero: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const videoEnabled = true;
  const [activeVideo, setActiveVideo] = useState(0);
  const [trustIndex, setTrustIndex] = useState(0);
  const [transitioningFrom, setTransitioningFrom] = useState<number | null>(null);
  const [readyVideoKeys, setReadyVideoKeys] = useState<Set<string>>(() => new Set());
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const activeVideoRef = useRef(0);
  const transitionTimerRef = useRef<number | null>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const todaySchedule = getTodayScheduleWIB();
  const currentVideo = heroVideos[activeVideo];

  useEffect(() => {
    setVisible(true);
  }, []);

  // 5-second slot roll-up rotation for trust building facts
  useEffect(() => {
    const timer = setInterval(() => {
      setTrustIndex((prev) => (prev + 1) % trustSlots.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  const transitionToVideo = useCallback((nextVideo: number) => {
    const previousVideo = activeVideoRef.current;
    if (previousVideo === nextVideo) return;

    activeVideoRef.current = nextVideo;
    setTransitioningFrom(previousVideo);
    setActiveVideo(nextVideo);

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = window.setTimeout(() => {
      setTransitioningFrom(null);
      transitionTimerRef.current = null;
    }, 1000);
  }, []);

  const handleSliderTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    setTransitioningFrom(null);
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const handlePrevVideo = useCallback(() => {
    transitionToVideo((activeVideoRef.current - 1 + heroVideos.length) % heroVideos.length);
  }, [transitionToVideo]);

  const handleNextVideo = useCallback(() => {
    transitionToVideo((activeVideoRef.current + 1) % heroVideos.length);
  }, [transitionToVideo]);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }
  }, []);

  // Play only the selected embed and pause any previously mounted player.
  useEffect(() => {
    if (!videoEnabled) return;

    heroVideos.forEach((_, idx) => {
      const iframe = iframeRefs.current[idx];
      if (!iframe || !iframe.contentWindow) return;

      try {
        const message = idx === activeVideo ? 'playVideo' : 'pauseVideo';
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: message, args: [] }),
          YOUTUBE_EMBED_ORIGIN,
        );
      } catch {
        // Ignore cross-origin issues
      }
    });
  }, [activeVideo, readyVideoKeys, videoEnabled]);

  // Automatically pause video when Hero container scrolls out of the viewport, and resume when it returns
  useEffect(() => {
    const container = document.getElementById('hero-video-container');
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoEnabled) return;
        const iframe = iframeRefs.current[activeVideoRef.current];
        if (iframe && iframe.contentWindow) {
          try {
            const command = entry.isIntersecting ? 'playVideo' : 'pauseVideo';
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: command, args: [] }),
              YOUTUBE_EMBED_ORIGIN,
            );
          } catch {
            // Ignore cross-origin issues
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoEnabled]);

  // Listen for YouTube embed ENDED state or time end to auto-advance
  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      if (event.origin !== YOUTUBE_EMBED_ORIGIN) return;
      if (iframeRefs.current[activeVideo]?.contentWindow !== event.source) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data?.event === 'onReady') {
          setReadyVideoKeys((previous) => {
            const videoKey = String(heroVideos[activeVideo].id);
            if (previous.has(videoKey)) return previous;
            const next = new Set(previous);
            next.add(videoKey);
            return next;
          });
        }

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
  }, [activeVideo, handleNextVideo]);

  return (
    <section id="about" className="relative pt-20 md:pt-24 pb-0 lg:pb-12 border-b border-foreground/20 bg-background">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 md:gap-10">
          <div className="w-full max-w-4xl flex flex-col items-start text-left">
            <div
              className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} flex items-center justify-start gap-3 md:gap-4 mb-4 md:mb-6`}
              style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
            >
              <span className={`inline-flex items-center justify-center border ${!todaySchedule.isOpenNow ? 'border-foreground/50 text-foreground/50' : 'border-foreground'} px-2.5 h-5 md:h-6 text-[10px] md:text-xs font-mono uppercase tracking-wider rounded-full`}>
                {!todaySchedule.isOpenNow ? 'CLOSED' : 'OPEN'}
              </span>
              <span className="font-mono text-[11px] md:text-xs text-muted-foreground uppercase tracking-widest">
                {todaySchedule.displayText}
              </span>
            </div>
            <h1 className="font-serif font-bold text-[11.2vw] sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] md:leading-[0.9] tracking-tight uppercase flex flex-col">
              <span
                className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} block whitespace-nowrap`}
                style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
              >
                Wisata edukasi
              </span>
              <span
                className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} block`}
                style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
              >
                <span className="font-accent italic font-normal text-[0.85em] tracking-normal text-foreground/90 lowercase">tanah liat & Keramik</span>
              </span>
            </h1>
          </div>

          {/* Mechanical Slot Reel Trust Ticker */}
          <div
            className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} hidden lg:flex text-right font-sans max-w-xs flex-col justify-end relative pr-6 py-0 select-none cursor-pointer group`}
            style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
            onClick={() => setTrustIndex((prev) => (prev + 1) % trustSlots.length)}
            title="Klik untuk memutar reel"
          >
            {/* Vertical Segmented Dash Progress Bar */}
            <div className="absolute right-0 top-0 bottom-0.5 w-[2px] flex flex-col justify-between items-center pointer-events-none">
              {trustSlots.map((_, idx) => {
                const isCompleted = idx < trustIndex;
                const isActive = idx === trustIndex;
                return (
                  <div
                    key={idx}
                    className="w-[2px] flex-1 my-[1px] rounded-full bg-foreground/25 relative overflow-hidden"
                  >
                    {isCompleted && (
                      <div className="w-full h-full bg-foreground absolute inset-0" />
                    )}
                    {isActive && (
                      <div
                        key={trustIndex}
                        className="w-full h-full bg-foreground absolute inset-0 origin-top animate-dash-fill"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reel 1: Category Tag */}
            <div className="h-4 overflow-hidden mb-1">
              <div
                className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-end will-change-transform"
                style={{ transform: `translateY(-${trustIndex * 16}px)` }}
              >
                {trustSlots.map((item) => (
                  <span key={item.id} className="h-4 text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-mono leading-4 block">
                    {item.tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reel 2: Line 1 */}
            <div className="h-6 overflow-hidden">
              <div
                className="transition-transform duration-500 delay-75 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-end will-change-transform"
                style={{ transform: `translateY(-${trustIndex * 24}px)` }}
              >
                {trustSlots.map((item) => (
                  <span key={item.id} className="h-6 text-xs md:text-sm lg:text-base text-foreground font-medium leading-6 block whitespace-nowrap">
                    {item.line1}
                  </span>
                ))}
              </div>
            </div>

            {/* Reel 3: Line 2 */}
            <div className="h-6 overflow-hidden mb-4 md:mb-6">
              <div
                className="transition-transform duration-500 delay-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-end will-change-transform"
                style={{ transform: `translateY(-${trustIndex * 24}px)` }}
              >
                {trustSlots.map((item) => (
                  <span key={item.id} className="h-6 text-xs md:text-sm lg:text-base text-foreground font-medium leading-6 block whitespace-nowrap">
                    {item.line2}
                  </span>
                ))}
              </div>
            </div>

            {/* Original CTA Link */}
            <a
              href="#activities"
              onClick={(e) => e.stopPropagation()}
              className="border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors inline-block w-fit ml-auto"
            >
              Lihat paket!
            </a>
          </div>
        </div>

        {/* Massive Cinematic Video Slider */}
        <div
          id="hero-video-container"
          className="group relative mb-4 w-full aspect-video md:aspect-[377/180] cursor-pointer overflow-hidden rounded-sm border border-foreground/10 bg-background"
          onClick={() => {
            if (currentVideo.youtubeUrl) {
              window.open(currentVideo.youtubeUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if ((event.key === 'Enter' || event.key === ' ') && currentVideo.youtubeUrl) {
              event.preventDefault();
              window.open(currentVideo.youtubeUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          title={currentVideo.youtubeUrl ? `Tonton ${currentVideo.title} di YouTube` : currentVideo.title}
          aria-label={currentVideo.youtubeUrl ? `Tonton ${currentVideo.title} di YouTube` : currentVideo.title}
        >
          <div
            className="absolute inset-0 flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            onTransitionEnd={handleSliderTransitionEnd}
            style={{
              width: `${heroVideos.length * 100}%`,
              transform: `translateX(-${(activeVideo * 100) / heroVideos.length}%)`,
            }}
          >
            {heroVideos.map((vid, idx) => {
              const isSelected = idx === activeVideo;
              const ytId = vid.type === 'youtube'
                ? getYouTubeId(vid.youtubeUrl)
                : null;
              const videoKey = String(vid.id);
              const shouldRenderPlayer = videoEnabled && (isSelected || idx === transitioningFrom);
              const thumbnail = ytId
                ? getYouTubeThumbnail(ytId)
                : vid.poster || mediaAssets.hero.poster;

              return (
                <div
                  key={vid.id}
                  style={{ width: `${100 / heroVideos.length}%` }}
                  className="relative h-full flex-shrink-0 bg-background overflow-hidden"
                >
                  <img
                    src={isSelected ? thumbnail : undefined}
                    alt=""
                    aria-hidden="true"
                    width="1280"
                    height="720"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={isSelected ? 'eager' : 'lazy'}
                    fetchPriority={isSelected ? 'high' : 'low'}
                    onError={(event) => {
                      if (!ytId) {
                        event.currentTarget.style.display = 'none';
                        return;
                      }
                      if (event.currentTarget.dataset.fallbackThumbnail === 'true') {
                        event.currentTarget.style.display = 'none';
                        return;
                      }
                      event.currentTarget.dataset.fallbackThumbnail = 'true';
                      event.currentTarget.src = getYouTubeFallbackThumbnail(ytId);
                    }}
                  />
                  {shouldRenderPlayer && (
                    ytId ? (
                      <div className="absolute inset-0 z-10">
                        <iframe
                          key={videoKey}
                          ref={(el) => {
                            iframeRefs.current[idx] = el;
                          }}
                          src={`${YOUTUBE_EMBED_ORIGIN}/embed/${ytId}?autoplay=${isSelected ? 1 : 0}&mute=1&loop=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                          title={vid.title}
                          onLoad={() => {
                            setReadyVideoKeys((previous) => {
                              if (previous.has(videoKey)) return previous;
                              const next = new Set(previous);
                              next.add(videoKey);
                              return next;
                            });
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          className={`pointer-events-none w-full h-full border-0 transition-opacity duration-200 ${readyVideoKeys.has(videoKey) ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </div>
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
          <div
            className="hero-video-blinds absolute inset-0 z-20 grid grid-cols-10 pointer-events-none"
            aria-hidden="true"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className="hero-video-blind"
                style={{ '--blind-index': index } as React.CSSProperties}
              />
            ))}
          </div>

          {currentVideo.youtubeUrl && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25 pointer-events-none">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ExternalLink size={14} aria-hidden="true" />
                Tonton di YouTube
              </span>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div
          className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} flex justify-between items-center px-0`}
          style={{ '--reveal-delay': '720ms' } as React.CSSProperties}
        >
          {currentVideo.youtubeUrl ? (
            <a
              href={currentVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka ${currentVideo.title} di YouTube`}
              className="group flex min-w-0 items-center gap-2 pr-2 font-accent text-base italic lowercase text-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:text-lg"
            >
              <span className="relative min-w-0 truncate after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 group-hover:after:w-full group-focus-visible:after:w-full">
                vid. {activeVideo + 1}: {currentVideo.title}
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <div className="min-w-0 truncate pr-2 font-accent text-base italic lowercase text-foreground/90 md:text-lg">
              vid. {activeVideo + 1}: {currentVideo.title}
            </div>
          )}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              type="button"
              onClick={handlePrevVideo}
              className="flex items-center justify-center w-5.5 h-5.5 md:w-6 md:h-6 rounded-xs bg-foreground text-background hover:bg-foreground/85 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              aria-label="Video sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-1 md:gap-1.5 mx-0.5">
              {heroVideos.map((_, idx) => (
                <div
                  key={idx}
                  aria-hidden="true"
                  className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-none transition-colors duration-500 ${idx === activeVideo ? 'bg-foreground' : 'bg-foreground/30'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNextVideo}
              className="flex items-center justify-center w-5.5 h-5.5 md:w-6 md:h-6 rounded-xs bg-foreground text-background hover:bg-foreground/85 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              aria-label="Video berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Full-Bleed Mobile Trust Facts Marquee (True 100vw Offscreen Bleed & 100% Seamless Loop) */}
      <div
        className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} lg:hidden w-screen relative left-1/2 -translate-x-1/2 overflow-hidden my-5 select-none`}
        style={{ '--reveal-delay': '800ms' } as React.CSSProperties}
      >
        <div className="animate-marquee flex gap-12 items-center">
          {marqueeSlots.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center shrink-0">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-0.5">
                {item.tag}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                {item.line1}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {item.line2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
