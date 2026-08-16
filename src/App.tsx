import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BentoTickets from './components/sections/BentoTickets';
import { CTA } from './components/sections/CTA';
import { GalleryReviews } from './components/sections/GalleryReviews';
import { Hero } from './components/sections/Hero';

export default function App() {
  return (
    <>
      <div id="top" className="min-h-screen font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[10000] bg-background px-4 py-3 font-sans text-sm font-bold text-foreground shadow-lg focus:not-sr-only"
        >
          Lewati ke konten utama
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
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
