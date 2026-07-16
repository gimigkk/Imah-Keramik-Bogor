import React, { useEffect } from 'react';
import { X, CheckCircle2, MessageCircle } from 'lucide-react';
import { Ticket } from '../types/ticket';

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (ticket) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ticket, onClose]);

  if (!ticket) return null;

  const isAccent = ticket.isAccent;

  const renderBadge = () => {
    if (!ticket.badge) return null;
    switch (ticket.badge) {
      case 'favorit':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2.5 py-1 bg-foreground text-background font-bold">
            Favorit
          </span>
        );
      case 'hemat':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2.5 py-1 bg-primary text-primary-foreground font-bold">
            Hemat
          </span>
        );
      case '4_pilihan':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2.5 py-1 bg-primary text-primary-foreground font-bold">
            4 Pilihan
          </span>
        );
      case 'kustom':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2.5 py-1 bg-foreground/10 text-foreground font-bold">
            Kustom
          </span>
        );
      case 'expert':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2.5 py-1 bg-foreground text-background font-bold">
            Expert
          </span>
        );
      default:
        return null;
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Imah Keramik Bogor, saya mau tanya / booking tiket "${ticket.title}" (${ticket.code}).`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-foreground/20 shadow-2xl ${
          isAccent ? 'bg-[#5c3a28] text-background' : 'bg-card text-foreground'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`p-6 pb-4 flex items-start justify-between border-b ${isAccent ? 'border-background/20' : 'border-foreground/10'}`}>
          <div className="flex items-center gap-3 flex-wrap">
            {renderBadge()}
            <span className={`font-mono text-xs tracking-widest ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
              {ticket.code}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Detail Tiket"
            className={`p-1.5 rounded-full transition-colors ${
              isAccent
                ? 'hover:bg-background/10 text-background/80 hover:text-background'
                : 'hover:bg-foreground/10 text-foreground/70 hover:text-foreground'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Optional Image */}
        {ticket.image && (
          <div className="w-full h-48 md:h-64 overflow-hidden relative border-b border-foreground/10 bg-muted">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className={`font-serif text-3xl md:text-4xl mb-2 leading-tight ${isAccent ? 'text-background' : 'text-foreground'}`}>
              {ticket.title}
            </h3>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`font-mono text-2xl md:text-3xl font-bold ${isAccent ? 'text-background' : 'text-foreground'}`}>
                {ticket.price}
              </span>
              {ticket.unitLabel && (
                <span className={`font-sans text-xs md:text-sm ${isAccent ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {ticket.unitLabel}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className={`font-sans text-sm md:text-base leading-relaxed ${isAccent ? 'text-background/85' : 'text-foreground/80'}`}>
            {ticket.description}
          </p>

          {/* Included Items / Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className={`font-mono text-xs uppercase tracking-widest font-bold ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
                Fasilitas / Yang Termasuk:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ticket.tags.map((tag, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs md:text-sm">
                    <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${isAccent ? 'text-primary' : 'text-foreground'}`} />
                    <span className={isAccent ? 'text-background/90' : 'text-foreground/90'}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addons (e.g. for Sewa Aula) */}
          {ticket.addons && ticket.addons.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className={`font-mono text-xs uppercase tracking-widest font-bold ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
                Opsi Biaya Tambahan:
              </p>
              <div className="flex flex-wrap gap-2">
                {ticket.addons.map((addon, idx) => (
                  <span
                    key={idx}
                    className={`font-mono text-xs px-3 py-1.5 border ${
                      isAccent
                        ? 'bg-background/10 border-background/20 text-background'
                        : 'bg-secondary/40 border-foreground/15 text-foreground'
                    }`}
                  >
                    {addon}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tiers Breakdown (for Membatik Kayu) */}
          {ticket.tiers && ticket.tiers.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-foreground/10">
              <p className={`font-mono text-xs uppercase tracking-widest font-bold ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
                Rincian Opsi Paket:
              </p>
              <div className="space-y-3">
                {ticket.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 border flex flex-col sm:flex-row justify-between sm:items-center gap-2 ${
                      isAccent
                        ? 'bg-background/10 border-background/20'
                        : 'bg-background border-foreground/15'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider block sm:inline mr-2">
                        {tier.name}
                      </span>
                      <span className={`text-xs ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
                        — {tier.detail}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold flex-shrink-0">
                      {tier.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className={`p-6 border-t flex flex-col sm:flex-row gap-3 justify-end items-center ${isAccent ? 'border-background/20 bg-background/5' : 'border-foreground/10 bg-secondary/10'}`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 font-mono text-xs uppercase tracking-widest border transition-colors ${
              isAccent
                ? 'border-background/30 text-background hover:bg-background/10'
                : 'border-foreground/30 text-foreground hover:bg-foreground/10'
            }`}
          >
            Tutup
          </button>
          <a
            href={`https://wa.me/628128145417?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest font-bold px-6 py-2.5 flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            <MessageCircle size={15} />
            Pesan / Tanya via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
