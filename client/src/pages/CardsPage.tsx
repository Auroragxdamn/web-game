import { useState, useEffect } from 'react';
import { Card, type CardProps } from '../components/ui/Card';
import { useCountdown } from '../hooks/UseCountdown';

interface CardsPageProps {
  deckData: CardProps[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  unlockTime: number;
  setUnlockTime: (time: number) => void;
}

export default function CardsPage({
  deckData, selectedIds, setSelectedIds, isLocked, setIsLocked, unlockTime, setUnlockTime
}: CardsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeInfoCard, setActiveInfoCard] = useState<CardProps | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timeLeft = useCountdown(unlockTime, isLocked, () => setIsLocked(false));

  // MODALLAR AÇIKKEN SCROLL KİLİDİ
  useEffect(() => {
    if (isModalOpen || activeInfoCard || showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, activeInfoCard, showConfirmModal]);

  const toggleCard = (id: number) => {
    if (isLocked) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((cardId) => cardId !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
      setIsModalOpen(false);
    }
  };

  const handleConfirmDeck = () => {
    setUnlockTime(Date.now() + 24 * 60 * 60 * 1000);
    setIsLocked(true);
    setShowConfirmModal(false);
  };

  const Overlay = ({ onClick }: { onClick: () => void }) => (
    <div
      className="absolute inset-0 bg-black/90 backdrop-blur-2xl bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-auto"
      onClick={onClick}
    />
  );

  return (
    <div className="space-y-12 pb-20 relative min-h-screen">
      {/* HEADER: BÜYÜK BAŞLIK VE SAĞDA KİLİT */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-primary pl-6 text-left w-full mb-12">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl md:text-5xl font-black uppercase bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent leading-none py-1 italic tracking-tighter">
            BİRİMLER
          </h1>
          {!isLocked && (
            <p className="text-muted-foreground uppercase tracking-[0.25em] text-[12px] font-black italic mt-2 opacity-80">
              AKTİF KONFİGÜRASYON ({selectedIds.length}/4)
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {!isLocked ? (
            <button
              onClick={() => selectedIds.length === 4 && setShowConfirmModal(true)}
              disabled={selectedIds.length !== 4}
              className="px-12 py-4 bg-primary text-primary-foreground font-black rounded-xl hover:scale-105 active:scale-95 transition-all uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-primary/30 disabled:opacity-30 cursor-pointer border-none"
            >
              SİSTEMİ KİLİTLE
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-primary/20 px-6 py-3.5 rounded-2xl border-2 border-primary shadow-[0_0_25px_rgba(var(--primary),0.4)]">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
              </span>
              <p className="text-primary font-black italic uppercase tracking-[0.15em] text-[12px]">
                DESTE KİLİTLİ: {timeLeft}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* SLOT ALANI: Sabit Boyutlu Slotlar */}
      <section className="bg-white/2er border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((index) => {
            const cardId = selectedIds[index];
            const cardData = deckData.find((c) => c.id === cardId);
            return (
              <div
                key={index}
                onClick={() => !isLocked && (cardData ? toggleCard(cardData.id) : setIsModalOpen(true))}
                className={`w-full aspect-1/1.5 rounded-4xl border-2 transition-all duration-500 relative flex items-center justify-center 
                  ${isLocked ? 'border-accent/10 bg-accent/5 cursor-default' : 'border-dashed border-primary/20 bg-primary/[0.02] cursor-pointer hover:border-primary/40'} 
                  ${cardData ? 'border-solid border-primary/30 shadow-lg shadow-primary/5' : ''}`}
              >
                {cardData ? (
                  <div className="relative w-full h-full flex items-center justify-center scale-[0.85]">
                    <Card {...cardData} />
                    {!isLocked && (
                      <div className="absolute inset-0 bg-red-500/10 opacity-0 hover:opacity-100 transition-opacity rounded-4xl flex items-center justify-center pointer-events-auto backdrop-blur-[2px]">
                        <div className="bg-red-500 text-white px-5 py-2.5 rounded-full text-[11px] font-black shadow-2xl tracking-widest uppercase cursor-pointer">KALDIR</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 select-none">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/5 text-primary text-3xl font-light">+</div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary/30">BİRİM SEÇ</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BİRİM SEÇME PANELİ (Envanter) */}
      {isModalOpen && (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 z-4000 flex items-center justify-center px-4 py-10 overflow-hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl pointer-events-auto" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 bg-card border border-primary/20 w-fit max-w-[90vw] max-h-full overflow-hidden rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="px-10 py-6 flex justify-between items-center border-b border-primary/10 shrink-0 bg-card/50 backdrop-blur-md">
              <h2 className="text-2xl font-black uppercase italic text-primary tracking-tighter leading-none">Birim Envanteri</h2>
              <button onClick={() => setIsModalOpen(false)} className="ml-16 px-5 py-2 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20 cursor-pointer">KAPAT</button>
            </div>
            <div className="overflow-y-auto px-8 py-8 scrollbar-hide">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 justify-items-center pb-20">
                {deckData.filter(c => !selectedIds.includes(c.id)).map((card) => (
                  <div key={card.id} onClick={() => toggleCard(card.id)} className="cursor-pointer hover:-translate-y-2 transition-all duration-300 scale-[0.65] hover:scale-[0.7] origin-top shrink-0">
                    <Card {...card} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONAY MODALI */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-6000 h-screen w-screen flex items-center justify-center p-4">
          <Overlay onClick={() => setShowConfirmModal(false)} />
          <div className="relative z-10 w-full max-w-sm bg-card border-2 border-primary/30 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6"><span className="text-primary text-3xl font-black italic">!</span></div>
              <h2 className="text-2xl font-black uppercase italic text-black tracking-tighter mb-4">SİSTEM PROTOKOLÜ</h2>
              <p className="text-zinc-800 text-[10px] uppercase tracking-[0.2em] leading-relaxed mb-8 font-bold">Mevcut konfigürasyon <span className="text-primary font-black underline underline-offset-4">24 SAAT</span> kilitlenecektir.</p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={handleConfirmDeck} className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl uppercase text-[10px] tracking-widest cursor-pointer shadow-lg shadow-primary/20">Kilidi Onayla</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full py-4 bg-zinc-200 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest cursor-pointer">Vazgeç</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÖZELLİK MODALI (Zoom) */}
      {activeInfoCard && (
        <div className="fixed inset-0 z-5000 h-screen w-screen flex items-center justify-center">
          <Overlay onClick={() => setActiveInfoCard(null)} />
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full h-full p-4">
            <div className="scale-100 animate-in zoom-in-95 duration-300 rounded-[1.8rem] overflow-hidden shadow-2xl border border-white/5">
              <Card {...activeInfoCard} />
            </div>
            <div className="mt-12 px-10 py-3 bg-zinc-800 border border-zinc-700 rounded-full backdrop-blur-md pointer-events-auto cursor-pointer group" onClick={() => setActiveInfoCard(null)}>
              <span className="text-black group-hover:text-primary font-black text-[10px] uppercase tracking-[0.6em] select-none transition-colors">KAPATMAK İÇİN DIŞARI TIKLA</span>
            </div>
          </div>
        </div>
      )}

      {/* BİRİM ARŞİVİ: BURADA! */}
      <div className="pt-24 border-t border-white/5">
        <h3 className="text-xl font-black uppercase tracking-[0.4em] text-muted-foreground/20 mb-12 text-center italic select-none">Birim Arşivi</h3>
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
          {deckData.map((card) => (
            <div key={card.id} onClick={() => setActiveInfoCard(card)} className="scale-75 origin-top transition-all duration-500 cursor-help opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-[0.8]">
              <Card {...card} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}