import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BentoTickets from './components/BentoTickets';
import IntroSplash from './components/IntroSplash';
import { SmoothScroll } from './components/SmoothScroll';
import { Hero } from './components/Hero';
import { GalleryReviews } from './components/GalleryReviews';
import { CTA } from './components/CTA';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <SmoothScroll />
      {!introDone && <IntroSplash onComplete={() => setIntroDone(true)} />}
      <div id="top" className="min-h-screen font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
        <Navbar />
        <main>
          <Hero />
          <BentoTickets />
          <GalleryReviews />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
