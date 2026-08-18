import { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Container } from '../layout/Container';
import { getWhatsAppUrl, site } from '../../data/site';
import { useRevealOnIntersect } from '../../hooks/useRevealOnIntersect';

export const CTA = () => {
  const [copied, setCopied] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [sectionRef, visible] = useRevealOnIntersect<HTMLElement>();

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    if (typeof IntersectionObserver === 'undefined') {
      setMapLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMapLoaded(true);
        observer.disconnect();
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(mapContainer);
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.address.copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section ref={sectionRef} id="book" className="pt-6 pb-28 md:pt-8 md:pb-28 bg-background relative z-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-stretch">

          {/* Left Column: CTA & Booking */}
          <div className="lg:col-span-5 flex flex-col">
            <h2
              className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} font-brand font-bold text-6xl sm:text-7xl md:text-8xl mb-6 leading-[0.85] tracking-tight uppercase text-foreground`}
              style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            >
              Reservasi <br />
              <span className="font-nanum text-[0.75em] md:text-[0.9em] tracking-normal text-foreground/90 lowercase block mt-1">
                sekarang juga!
              </span>
            </h2>
            <p
              className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} text-foreground/80 text-sm md:text-base leading-relaxed mb-10 mt-5 font-sans max-w-md font-medium`}
              style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
            >
              Kuota peserta kami batasi di setiap harinya agar suasana belajar tetap hangat dan fokus. Amankan waktu kunjungan Anda via WhatsApp!
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} inline-flex items-center justify-center gap-2 border border-primary bg-primary text-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-300 w-fit`}
              style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
            >
              <FaWhatsapp size={16} aria-hidden="true" />
              Booking Sekarang
            </a>
          </div>

          {/* Right Column: Location & Map Container */}
          <div
            className={`reveal-panel ${visible ? 'reveal-panel-visible' : ''} lg:col-span-7 flex flex-col h-full bg-card border border-foreground/10 p-4 md:p-5 shadow-sm`}
            style={{ '--reveal-delay': '480ms' } as React.CSSProperties}
          >
            <div className="flex flex-row justify-between items-end gap-4 pb-5 pt-1 md:pt-2">
              <div>
                <h3 className="font-brand font-extrabold text-3xl text-foreground mb-2 uppercase">{site.name}</h3>
                <button
                  onClick={handleCopy}
                  className="group text-left text-muted-foreground font-sans text-sm leading-relaxed hover:text-foreground transition-colors"
                  aria-label={`Salin alamat ${site.name}`}
                >
                  <span>
                    {site.address.shortDisplayLines[0]}<br />
                    {site.address.shortDisplayLines[1]}
                  </span>
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 ml-2 mb-0.5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 ml-2 mb-0.5 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                  )}
                </button>
                <span className="sr-only" role="status" aria-live="polite">
                  {copied ? 'Alamat berhasil disalin' : ''}
                </span>
              </div>
              {/* Opening Schedule (Hidden on Mobile) */}
              <div className="hidden sm:block text-right shrink-0">
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Selasa - Jumat: 13.00 - 18.00<br />
                  Sabtu - Minggu: 10.00 - 18.00
                </p>
              </div>
            </div>

            <div
              ref={mapContainerRef}
              className={`relative w-full flex-1 min-h-62.5 lg:min-h-0 aspect-4/3 lg:aspect-auto bg-muted overflow-hidden border border-foreground ${mapInteractive ? '' : 'group'}`}
              onMouseLeave={() => setMapInteractive(false)}
            >
              {mapLoaded && (
                <iframe
                  src={site.address.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  className={`transition-[filter] duration-300 ${mapInteractive ? 'pointer-events-auto' : 'pointer-events-none group-hover:blur-[3px]'}`}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={mapInteractive ? 0 : -1}
                  aria-hidden={!mapInteractive}
                  title={`Peta lokasi ${site.name}`}
                />
              )}
              {!mapInteractive ? (
                <button
                  type="button"
                  onClick={() => {
                    setMapLoaded(true);
                    setMapInteractive(true);
                  }}
                  aria-label={`Aktifkan peta interaktif ${site.name}`}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-foreground"
                >
                  <span className="font-sans text-xs font-black uppercase text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    Click to interact
                  </span>
                </button>
              ) : null}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
