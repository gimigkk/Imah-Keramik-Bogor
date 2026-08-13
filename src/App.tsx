import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BentoTickets from './components/BentoTickets';
import IntroSplash from './components/IntroSplash';
import { SmoothScroll } from './components/SmoothScroll';
import { Hero } from './components/Hero';
import { CTA } from './components/CTA';
import { GalleryReviews } from './components/GalleryReviews';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [introMorphing, setIntroMorphing] = useState(false);

  return (
    <>
      <SmoothScroll />
      {!introDone && (
        <IntroSplash
          onMorphStart={() => setIntroMorphing(true)}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <div id="top" className="min-h-screen font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[10000] bg-background px-4 py-3 font-sans text-sm font-bold text-foreground shadow-lg focus:not-sr-only"
        >
          Lewati ke konten utama
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero introStarted={introMorphing || introDone} videoEnabled={introMorphing || introDone} />
          <BentoTickets />
          <GalleryReviews />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
