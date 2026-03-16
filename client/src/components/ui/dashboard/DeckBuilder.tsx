import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, type CardProps } from '../Card';

interface DeckBuilderProps {
    inventory: CardProps[];
}

export function DeckBuilder({ inventory }: DeckBuilderProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    // 24 Saatlik Geri Sayım Mantığı
    useEffect(() => {
        if (isLocked) {
            const timer = setInterval(() => {
                // Burada gerçek bir timestamp ile karşılaştırma yapılacak
                // Şimdilik görsel bir geri sayım simülasyonu:
                setTimeLeft("23:59:59");
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLocked]);

    const toggleCard = (id: number) => {
        if (isLocked) return;
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else if (selectedIds.length < 4) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleLock = () => {
        if (selectedIds.length === 4) {
            setIsLocked(true);
            // Backend'e "Deste kilitlendi" isteği burada atılacak
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-16 p-8 bg-card/30 rounded-3xl border border-border/50 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-10">
                <div className="text-left">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                        Daily Deck Setup
                    </h2>
                    <p className="text-muted-foreground text-xs font-bold tracking-[0.2em]">
                        {isLocked ? "SYSTEM LOCKED" : "SELECT 4 CARDS TO INITIALIZE ECONOMY"}
                    </p>
                </div>

                {isLocked ? (
                    <div className="px-6 py-2 bg-amber-500/10 border border-amber-500/50 rounded-xl">
                        <span className="text-amber-500 font-mono font-bold text-xl">{timeLeft}</span>
                    </div>
                ) : (
                    <button
                        onClick={handleLock}
                        disabled={selectedIds.length !== 4}
                        className="px-10 py-3 bg-primary text-primary-foreground rounded-full font-black text-sm uppercase tracking-widest disabled:opacity-30 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        CONFIRM & LOCK DECK
                    </button>
                )}
            </div>

            {/* 4 Slotlu Deste Alanı */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[0, 1, 2, 3].map((index) => {
                    const cardId = selectedIds[index];
                    const cardData = inventory.find(c => c.id === cardId);

                    return (
                        <div
                            key={index}
                            className={`h-[400px] rounded-2xl border-2 border-dashed flex items-center justify-center transition-all
                ${isLocked ? 'border-amber-500/20 bg-amber-500/5' : 'border-border hover:border-primary/50'}
                ${cardData ? 'border-solid border-primary/40 p-0 overflow-hidden' : 'p-8'}`}
                        >
                            {cardData ? (
                                <div className="scale-[0.85] origin-center">
                                    <Card {...cardData} />
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                                    Empty Slot {index + 1}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Envanter Seçim Alanı (Sadece Kilitli Değilse Görünür) */}
            <AnimatePresence>
                {!isLocked && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="pt-10 border-t border-border/50"
                    >
                        <h3 className="text-left text-sm font-black uppercase tracking-widest mb-6 opacity-50">Available Inventory</h3>
                        <div className="flex flex-wrap gap-4 justify-start">
                            {inventory.map((card) => (
                                <div
                                    key={card.id}
                                    onClick={() => toggleCard(card.id)}
                                    className={`cursor-pointer transition-all ${selectedIds.includes(card.id) ? 'opacity-30 scale-95 grayscale' : 'hover:scale-105'}`}
                                >
                                    <div className="scale-[0.6] -m-16 origin-center">
                                        <Card {...card} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}