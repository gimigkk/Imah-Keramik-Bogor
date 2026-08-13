import { useEffect, useState, useCallback, useRef } from 'react';
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll';

interface IntroSplashProps {
  onComplete: () => void;
  onMorphStart?: () => void;
}

const INTRO_TIMING = {
  textRevealDelay: 80,
  holdDuration: 1300,
  morphDuration: 1100,
  dockFadeDuration: 400,
} as const;

/**
 * Fixed fullscreen clone intro splash:
 * 1. Black clone panel starts fullscreen with brand title float-up entrance.
 * 2. Morphs into #hero-video-container coordinates over 1.1s.
 * 3. Once docked on top of #hero-video-container, fades out over 400ms to reveal video.
 */
export default function IntroSplash({ onComplete, onMorphStart }: IntroSplashProps) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'hold' | 'morph' | 'docked' | 'done'>('hold');
  const [textVisible, setTextVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
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

  // Step 1: Reveal brand text stagger
  useEffect(() => {
    const tShow = setTimeout(() => setTextVisible(true), INTRO_TIMING.textRevealDelay);
    return () => clearTimeout(tShow);
  }, []);

  // Step 2: Hold for 2.2s, then measure target rect and trigger morph
  useEffect(() => {
    const tMorph = setTimeout(() => {
      const target = document.getElementById('hero-video-container');
      if (target) {
        setTargetRect(target.getBoundingClientRect());
      }
      setPhase('morph');
      onMorphStartRef.current?.();
    }, INTRO_TIMING.holdDuration);

    return () => clearTimeout(tMorph);
  }, []);

  // Step 3: Wait for 1.1s morph to finish, then set phase to 'docked'
  useEffect(() => {
    if (phase !== 'morph') return;

    if (!targetRect) {
      finishIntro();
      return;
    }

    const tDock = setTimeout(() => {
      setPhase('docked');
    }, INTRO_TIMING.morphDuration);

    return () => clearTimeout(tDock);
  }, [phase, targetRect, finishIntro]);

  // Step 4: Fade out clone over 400ms while docked, then unmount
  useEffect(() => {
    if (phase !== 'docked') return;

    const tFinish = setTimeout(() => {
      finishIntro();
    }, INTRO_TIMING.dockFadeDuration);

    return () => clearTimeout(tFinish);
  }, [phase, finishIntro]);

  if (phase === 'done') return null;

  const isMorphOrDocked = phase === 'morph' || phase === 'docked';
  const style: React.CSSProperties = isMorphOrDocked && targetRect ? {
    top: `${targetRect.top}px`,
    left: `${targetRect.left}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
    opacity: phase === 'docked' ? 0 : 1,
    transition: phase === 'docked'
      ? 'opacity 400ms ease-out'
      : 'top 1100ms cubic-bezier(0.76, 0, 0.24, 1), left 1100ms cubic-bezier(0.76, 0, 0.24, 1), width 1100ms cubic-bezier(0.76, 0, 0.24, 1), height 1100ms cubic-bezier(0.76, 0, 0.24, 1), opacity 400ms ease-out',
  } : {
    top: '0px',
    left: '0px',
    width: '100vw',
    height: '100vh',
    opacity: 1,
  };

  return (
    <div
      className={`intro-clone${isMorphOrDocked ? ' intro-clone--morph' : ''}${phase === 'docked' ? ' intro-clone--docked' : ''}`}
      style={style}
      aria-label="Pembuka Imah Keramik Bogor"
    >
      {/* Brand Text Overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-out z-10 ${isMorphOrDocked ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}
      >
        <div className="flex flex-col items-center justify-center">
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-none px-4">
              Imah
            </span>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-none px-4">
              Keramik
            </span>
          </div>
          <div
            className={`intro-float-panel ${textVisible ? 'intro-float-panel-visible' : ''}`}
            style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
          >
            <span className="font-brand uppercase text-5xl sm:text-7xl md:text-8xl text-background tracking-wider font-extrabold text-center drop-shadow-md leading-none px-4">
              Bogor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

