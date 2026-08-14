import { useEffect, useState, useCallback, useRef } from 'react';
import { pauseSmoothScroll, resumeSmoothScroll } from '../providers/SmoothScroll';

interface IntroSplashProps {
  onComplete: () => void;
  onMorphStart?: () => void;
}

const INTRO_TIMING = {
  holdDuration: 100,
  morphDuration: 800,
  dockFadeDuration: 300,
} as const;

/**
 * Fast Morph Loading Screen:
 * 1. Black clone panel starts fullscreen as a dark load screen.
 * 2. Morphs into #hero-video-container coordinates over 800ms.
 * 3. Fades out over 300ms once docked to reveal video container seamlessly.
 */
export default function IntroSplash({ onComplete, onMorphStart }: IntroSplashProps) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'hold' | 'morph' | 'docked' | 'done'>('hold');
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

  // Measure target rect and trigger morph after brief initial load hold
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

  // Wait for morph to finish, then set phase to 'docked'
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

  // Fade out clone while docked, then unmount
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
      ? 'opacity 300ms ease-out'
      : 'top 800ms cubic-bezier(0.76, 0, 0.24, 1), left 800ms cubic-bezier(0.76, 0, 0.24, 1), width 800ms cubic-bezier(0.76, 0, 0.24, 1), height 800ms cubic-bezier(0.76, 0, 0.24, 1), opacity 300ms ease-out',
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
      aria-label="Loading screen"
    />
  );
}
