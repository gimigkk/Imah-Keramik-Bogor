import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems, FAQItem } from '../../data/faq';
import { resizeSmoothScroll } from '../providers/SmoothScroll';

interface FAQColumnProps {
  items: FAQItem[];
  startIndex: number;
  openIndex: number | null;
  onToggle: (index: number) => void;
}

const FAQColumn = ({ items, startIndex, openIndex, onToggle }: FAQColumnProps) => (
  <div className="grid grid-cols-1 content-start gap-2">
    {items.map((item, index) => (
      (() => {
        const itemIndex = startIndex + index;
        const isOpen = openIndex === itemIndex;

        return (
          <div
            key={item.question}
            className="group overflow-hidden rounded-sm transition-colors duration-300 hover:bg-card/60"
          >
            <button
              type="button"
              onClick={() => onToggle(itemIndex)}
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
                <p onClick={() => onToggle(itemIndex)} className="max-w-2xl cursor-pointer bg-background px-11 pb-4 pr-8 font-sans text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
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
  const resizeTimerRef = useRef<number | null>(null);
  const midpoint = Math.ceil(faqItems.length / 2);

  const handleToggle = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));

    if (resizeTimerRef.current !== null) {
      window.clearTimeout(resizeTimerRef.current);
    }

    resizeTimerRef.current = window.setTimeout(() => {
      resizeSmoothScroll();
      resizeTimerRef.current = null;
    }, 360);
  };

  useEffect(() => () => {
    if (resizeTimerRef.current !== null) {
      window.clearTimeout(resizeTimerRef.current);
    }
  }, []);

  return (
    <div id="faq" className="mt-16 border-t-2 border-dashed border-foreground/20 pt-[62px]">
      <div className="mb-8 text-center">
        <h3 className="mb-2 font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Pertanyaan Umum.
        </h3>
        <p className="text-balance font-sans font-semibold text-xs text-muted-foreground md:text-sm">
          Panduan singkat memilih aktivitas dan menyiapkan kunjungan.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2 lg:gap-x-3">
        <FAQColumn items={faqItems.slice(0, midpoint)} startIndex={0} openIndex={openIndex} onToggle={handleToggle} />
        <FAQColumn items={faqItems.slice(midpoint)} startIndex={midpoint} openIndex={openIndex} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default FAQ;
