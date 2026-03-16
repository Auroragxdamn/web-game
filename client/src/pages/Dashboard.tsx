import { GoldCounter } from '../components/ui/dashboard/GoldCounter';
import { EfficiencyStats } from '../components/ui/dashboard/EfficiencyStats';
import { Link } from 'react-router-dom';

interface DashboardProps {
    gold: number;
    income: number;
}

export default function Dashboard({ gold, income }: DashboardProps) {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-12">
            {/* Üst Kısım: Altın Sayacı */}
            <div className="w-full max-w-lg">
                <GoldCounter initialGold={gold} incomePerSecond={income} />
            </div>

            {/* Orta Kısım: Verimlilik İstatistikleri (3'lü Grid) */}
            <EfficiencyStats />

            {/* Alt Kısım: Hoş Geldin Metni ve Aksiyon Butonu */}
            <div className="text-center max-w-2xl">
                <h1 className="text-6xl font-black mb-4 bg-linear-to-b from-foreground to-primary/80 bg-clip-text text-transparent uppercase leading-none py-2">
                    HOŞ GELDİN!
                </h1>

                <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] mb-8 font-bold">
                    Project Stellar: Idle Deckbuilder
                </p>

                <Link
                    to="/cards"
                    className="inline-block px-12 py-4 bg-primary text-primary-foreground rounded-full font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 uppercase tracking-widest text-xs no-underline"
                >
                    STRATEJİ BELİRLE
                </Link>
            </div>
        </div>
    );
}