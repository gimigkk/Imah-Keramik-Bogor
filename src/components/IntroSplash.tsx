import { useEffect, useState, useCallback, useRef } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

/**
 * Fixed fullscreen video clone intro splash:
 * 1. Clone video starts fullscreen and blurred with a dark backdrop.
 * 2. Brand icon, "IMAH KERAMIK BOGOR" title, and tagline float up with blur and stagger.
 * 3. Morphs into #hero-video-container, unblurring the video as it shrinks into place.
 */
export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<'hold' | 'morph' | 'done'>('hold');
  const [textVisible, setTextVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCompleteCb = useCallback(onComplete, [onComplete]);

  // Disable scrolling during intro and force scroll position to top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-scroll-locked', 'true');
    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-locked');
    };
  }, []);

  // Handle case where video is already loaded (e.g. from cache)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  // Step 1: Trigger float-up blur stagger entrance right after video loads
  // Step 2: Hold for 2.2s, then measure target and trigger morph
  useEffect(() => {
    if (!videoLoaded) return;

    const tShow = setTimeout(() => setTextVisible(true), 80);
    const tMorph = setTimeout(() => {
      const target = document.getElementById('hero-video-container');
      if (target) {
        setTargetRect(target.getBoundingClientRect());
      }
      setPhase('morph');
    }, 2200);
    
    return () => {
      clearTimeout(tShow);
      clearTimeout(tMorph);
    };
  }, [videoLoaded]);

  // Step 3: Wait for transition to finish, then unmount
  useEffect(() => {
    if (phase !== 'morph') return;

    if (!targetRect) {
      onCompleteCb();
      return;
    }

    const finish = () => {
      setPhase('done');
      onCompleteCb();
    };

    // Transition is 1100ms, give it a tiny padding
    const safety = setTimeout(finish, 1300);
    return () => clearTimeout(safety);
  }, [phase, targetRect, onCompleteCb]);

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
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        poster="https://images.unsplash.com/photo-1609881583302-61548332039c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
        className={`intro-clone-video ${videoLoaded ? 'video-loaded' : ''}`}
      >
        <source src="/assets/videos/hero/studio-process.mp4" type="video/mp4" />
      </video>

      {/* Brand Text Overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-out z-10 ${
          phase === 'morph' ? 'opacity-0 scale-95 blur-md' : 'opacity-100'
        }`}
      >
        {/* Title Lines Staggered */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <h1 className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Imah
            </h1>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <h1 className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Keramik
            </h1>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
          >
            <h1 className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-[1] px-4">
              Bogor
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
