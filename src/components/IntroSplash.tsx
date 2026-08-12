import { useEffect, useState, useCallback, useRef } from 'react';
import { TileBackground } from './TileBackground';
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll';

interface IntroSplashProps {
  onComplete: () => void;
  onMorphStart?: () => void;
}

const INTRO_TIMING = {
  textRevealDelay: 80,
  holdDuration: 2200,
  morphDuration: 1100,
  morphSafetyBuffer: 200,
  videoLoadFallback: 1200,
} as const;

/**
 * Fixed fullscreen video clone intro splash:
 * 1. Clone video starts fullscreen and blurred with a dark backdrop.
 * 2. Brand icon, "IMAH KERAMIK BOGOR" title, and tagline float up with blur and stagger.
 * 3. Morphs into #hero-video-container, unblurring the video as it shrinks into place.
 */
export default function IntroSplash({ onComplete, onMorphStart }: IntroSplashProps) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'hold' | 'morph' | 'done'>('hold');
  const [textVisible, setTextVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onMorphStartRef = useRef(onMorphStart);
  const hasCompletedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setPhase('done');
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onMorphStartRef.current = onMorphStart;
  }, [onComplete, onMorphStart]);

  useEffect(() => {
    if (reduceMotion) {
      onMorphStartRef.current?.();
      finishIntro();
    }
  }, [reduceMotion, finishIntro]);

  // Disable scrolling during intro and force scroll position to top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    pauseSmoothScroll();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      resumeSmoothScroll();
    };
  }, []);

  // Handle case where video is already loaded (e.g. from cache)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  // Fallback timer in case network latency delays onLoadedData on prod
  useEffect(() => {
    if (videoLoaded) return;
    const fallback = setTimeout(() => {
      setVideoLoaded(true);
    }, INTRO_TIMING.videoLoadFallback);
    return () => clearTimeout(fallback);
  }, [videoLoaded]);

  // Step 1: Trigger float-up blur stagger entrance right after video loads
  // Step 2: Hold for 2.2s, then measure target and trigger morph
  useEffect(() => {
    if (!videoLoaded) return;

    const tShow = setTimeout(() => setTextVisible(true), INTRO_TIMING.textRevealDelay);
    const tMorph = setTimeout(() => {
      const target = document.getElementById('hero-video-container');
      if (target) {
        setTargetRect(target.getBoundingClientRect());
      }
      setPhase('morph');
      onMorphStartRef.current?.();
    }, INTRO_TIMING.holdDuration);

    return () => {
      clearTimeout(tShow);
      clearTimeout(tMorph);
    };
  }, [videoLoaded]);

  // Step 3: Wait for transition to finish, then unmount
  useEffect(() => {
    if (phase !== 'morph') return;

    if (!targetRect) {
      finishIntro();
      return;
    }

    const safety = setTimeout(
      finishIntro,
      INTRO_TIMING.morphDuration + INTRO_TIMING.morphSafetyBuffer,
    );
    return () => clearTimeout(safety);
  }, [phase, targetRect, finishIntro]);

  if (phase === 'done') return null;

  const style: React.CSSProperties = phase === 'morph' && targetRect ? {
    top: `${targetRect.top}px`,
    left: `${targetRect.left}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
  } : {
    top: '0px',
    left: '0px',
    width: '100vw',
    height: '100vh',
  };

  return (
    <div
      className={`intro-clone${phase === 'morph' ? ' intro-clone--morph' : ''}`}
      style={style}
      aria-label="Pembuka Imah Keramik Bogor"
    >
      <img
        src="/assets/images/hero-poster.webp"
        alt=""
        width="1280"
        height="720"
        fetchPriority="high"
        aria-hidden="true"
        className="intro-clone-poster"
      />
      <video
        ref={videoRef}
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        preload={reduceMotion ? 'none' : 'auto'}
        onLoadedData={() => setVideoLoaded(true)}
        poster="/assets/images/hero-poster.webp"
        aria-hidden="true"
        className={`intro-clone-video ${videoLoaded ? 'video-loaded' : ''}`}
      >
        <source src="/assets/videos/hero/studio-process.webm" type="video/webm" />
        <source src="/assets/videos/hero/studio-process.mp4" type="video/mp4" />
      </video>

      {/* Tile Overlay - Optional visual texture over the video */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-[5] ${phase === 'morph' ? 'opacity-0' : 'opacity-100'
          }`}
        style={{
          mixBlendMode: 'overlay',
          filter: 'invert(1) brightness(2)',
          opacity: phase === 'morph' ? 0 : 1
        }}
      >
        <TileBackground gridOpacity={0.15} tileOpacity={0.4} />
      </div>

      {/* Brand Text Overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-out z-10 ${phase === 'morph' ? 'opacity-0 scale-95 blur-md' : 'opacity-100'
          }`}
      >
        {/* Title Lines Staggered */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Imah
            </span>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Keramik
            </span>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Bogor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
