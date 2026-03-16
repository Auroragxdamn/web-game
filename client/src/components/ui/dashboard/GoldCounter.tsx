import { useState, useEffect } from 'react';

export function GoldCounter({ initialGold, incomePerSecond }: { initialGold: number, incomePerSecond: number }) {
    const [displayGold, setDisplayGold] = useState(initialGold);
    const [bubbles, setBubbles] = useState<{ id: number; val: number }[]>([]);

    useEffect(() => {
        // Altın miktarı her arttığında (saniyede bir tetiklenir)
        if (initialGold > displayGold) {
            // Yeni uçan sayı balonu ekle
            const newId = Date.now();
            setBubbles(prev => [...prev, { id: newId, val: incomePerSecond }]);

            // 1 saniye sonra listeden temizle (DOM şişmesin)
            setTimeout(() => {
                setBubbles(prev => prev.filter(b => b.id !== newId));
            }, 1000);
        }
        setDisplayGold(initialGold);
    }, [initialGold, incomePerSecond]);

    const formatGold = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="flex flex-col items-center justify-center py-10 select-none relative">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] mb-2">
                Current Wealth
            </span>

            <div className="flex items-center gap-4 relative">
                <span className="text-5xl">💰</span>

                <h2 className="text-7xl font-black tracking-tighter italic uppercase text-foreground">
                    {formatGold(displayGold)}
                </h2>

                {/* UÇAN SAYILAR BURADA - Sayacın hemen sağında */}
                <div className="absolute left-full ml-4 top-0 w-20 h-20 pointer-events-none">
                    {bubbles.map((bubble) => (
                        <div
                            key={bubble.id}
                            className="absolute animate-float text-primary font-black text-2xl italic"
                        >
                            +{formatGold(bubble.val)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">
                    +{incomePerSecond} Gold / Sec
                </span>
            </div>
        </div>
    );
}