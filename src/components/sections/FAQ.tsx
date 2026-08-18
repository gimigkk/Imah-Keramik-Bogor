import { type CSSProperties, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { faqItems, FAQItem } from '../../data/faq';
import { getWhatsAppUrl } from '../../data/site';
import { useRevealOnIntersect } from '../../hooks/useRevealOnIntersect';

interface FAQColumnProps {
  items: FAQItem[];
  startIndex: number;
  openIndex: number | null;
  onToggle: (index: number) => void;
  visible: boolean;
  isDesktop: boolean;
}

const FAQColumn = ({ items, startIndex, openIndex, onToggle, visible, isDesktop }: FAQColumnProps) => (
  <div className="grid grid-cols-1 content-start gap-2">
    {items.map((item, index) => (
      (() => {
        const itemIndex = startIndex + index;
        const toggleIndex = isDesktop ? index : itemIndex;
        const isOpen = isDesktop ? openIndex === index : openIndex === itemIndex;

        return (
          <div
            key={item.question}
            className={`modal-reveal-panel ${visible ? 'modal-reveal-panel-visible' : ''}`}
            style={{ '--reveal-delay': `${itemIndex * 80}ms` } as CSSProperties}
          >
            <div className="group overflow-hidden rounded-sm transition-colors duration-300 hover:bg-card/60">
              <button
                type="button"
                onClick={() => onToggle(toggleIndex)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${itemIndex}`}
                className="flex w-full cursor-pointer items-center justify-start gap-3 bg-background px-4 py-4 text-left shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-foreground/55 transition-transform duration-300 ${isOpen ? 'rotate-180 text-foreground' : ''}`} />
                <span id={`faq-question-${itemIndex}`} className="font-sans text-sm font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-foreground/75 md:text-base">{item.question}</span>
              </button>
              <div
                id={`faq-answer-${itemIndex}`}
                role="region"
                aria-labelledby={`faq-question-${itemIndex}`}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p onClick={() => onToggle(toggleIndex)} className="max-w-2xl cursor-pointer bg-background px-11 pb-4 pr-8 font-sans text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()
    ))}
  </div>
);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sectionRef, visible] = useRevealOnIntersect<HTMLDivElement>();
  const midpoint = Math.ceil(faqItems.length / 2);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <div ref={sectionRef} id="faq" className="mt-16 border-t-2 border-dashed border-foreground/20 pt-[62px]">
      <div className={`modal-reveal-panel ${visible ? 'modal-reveal-panel-visible' : ''} mb-8 text-center`}>
        <h3 className="mb-2 font-brand text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Pertanyaan Umum.
        </h3>
        <p className="text-balance font-sans font-semibold text-xs text-muted-foreground md:text-sm">
          Panduan singkat memilih aktivitas dan menyiapkan kunjungan.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2 lg:gap-x-3">
        <FAQColumn items={faqItems.slice(0, midpoint)} startIndex={0} openIndex={openIndex} onToggle={handleToggle} visible={visible} isDesktop={isDesktop} />
        <FAQColumn items={faqItems.slice(midpoint)} startIndex={midpoint} openIndex={openIndex} onToggle={handleToggle} visible={visible} isDesktop={isDesktop} />
      </div>

      <div
        className={`modal-reveal-panel ${visible ? 'modal-reveal-panel-visible' : ''} mt-6 flex justify-center`}
        style={{ '--reveal-delay': `${faqItems.length * 80 + 80}ms` } as CSSProperties}
      >
        <a
          href={getWhatsAppUrl('Halo, saya ingin bertanya tentang aktivitas di Imah Keramik Bogor.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tanya lebih lanjut melalui WhatsApp"
          className="group flex w-fit items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors duration-300 hover:text-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <span>Tanya Lebih Lanjut</span>
          <FaWhatsapp aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        </a>
      </div>
    </div>
  );
};

export default FAQ;
