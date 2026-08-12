import React from 'react';
import { Check, Plus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Ticket } from '../types/ticket';

interface PackageCardsProps {
  ticket: Ticket;
  whatsappHref: string;
  className?: string;
}

export const PackageCards: React.FC<PackageCardsProps> = ({ ticket, whatsappHref, className = '' }) => {
  const packages = ticket.tiers?.length
    ? ticket.tiers.map((tier) => ({
        name: tier.name,
        price: tier.price,
        items: tier.items?.length ? tier.items : [tier.detail],
      }))
    : [
        {
          name: ticket.badge === 'kustom' ? 'Paket sesuai pilihan' : ticket.title,
          price: ticket.price,
          items: ticket.tags?.length ? ticket.tags : [ticket.description],
        },
      ];

  return (
    <section
      aria-labelledby="package-heading"
      className={`flex flex-col border border-foreground/20 bg-card p-5 shadow-xl md:p-7 ${className}`}
    >
      <div className="mb-3">
        <h3 id="package-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
          {packages.length > 1 ? 'Pilih paketmu' : 'Rincian paket'}
        </h3>
      </div>

      <div className={`grid flex-1 gap-3 ${packages.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
        {packages.map((item, index) => (
          <article key={`${item.name}-${index}`} className="flex h-full flex-col border border-foreground/20 bg-background p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  {packages.length > 1 ? `Pilihan ${String(index + 1).padStart(2, '0')}` : 'Termasuk'}
                </span>
                <h4 className="font-serif text-2xl leading-none">{item.name}</h4>
              </div>
              <strong className="shrink-0 border border-foreground/20 bg-primary px-2.5 py-1.5 text-right font-mono text-xs">
                {item.price}
              </strong>
            </div>

            <ul className="mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-x-6 gap-y-2">
              {item.items.map((content, contentIndex) => (
                <li key={`${content}-${contentIndex}`} className="flex items-start gap-2.5 text-xs leading-5 text-foreground/75">
                  <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-foreground" aria-hidden="true" />
                  <span>{content}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {ticket.addons && ticket.addons.length > 0 && (
        <div className="mt-3 border border-dashed border-foreground/30 bg-secondary/15 p-4">
          <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Biaya tambahan opsional
          </p>
          <div className="flex flex-wrap gap-2">
            {ticket.addons.map((addon) => (
              <span key={addon} className="inline-flex items-center gap-1.5 border border-foreground/15 bg-background px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wide">
                <Plus size={12} aria-hidden="true" />
                {addon.replace(/^\+/, '')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-3 text-xs leading-5 text-muted-foreground">
          Tanyakan jadwal dan ketersediaan tempat langsung kepada tim studio.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <FaWhatsapp size={16} aria-hidden="true" />
          Tanya / pesan via WhatsApp
        </a>
      </div>
    </section>
  );
};
