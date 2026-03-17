import { GoldCounter } from '../components/ui/dashboard/GoldCounter';
import { EfficiencyStats } from '../components/ui/dashboard/EfficiencyStats';
import { SpotifyGamePlayer } from '../components/spotify/SpotifyGamePlayer';
import { api } from '@/lib/eden';

interface DashboardProps {
    gold: number;
    income: number;
}

export default function Dashboard({ gold, income }: DashboardProps) {

    // 👇 The new Ping/Pong script using Eden
    const handlePingBackend = async () => {
        console.log("Pinging backend...");

        try {
            // Eden magic: type-safe fetch to your backend!
            const { data, error } = await api.ping.get();

            if (error) {
                console.error("❌ Backend error:", error.status, error.value);
                alert("Ping failed! Check the console.");
                return;
            }

            console.log("✅ Success:", data);
            alert(`Server responded: ${data}`);

        } catch (err) {
            console.error("❌ Network error:", err);
            alert("Could not connect to the backend. Is it running?");
        }
    };

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-12">
            {/* Üst Kısım: Altın Sayacı */}
            <div className="w-full max-w-lg">
                <GoldCounter initialGold={gold} incomePerSecond={income} />
            </div>

            {/* Orta Kısım: Verimlilik İstatistikleri (3'lü Grid) */}
            <SpotifyGamePlayer />

            <EfficiencyStats />

            {/* Alt Kısım: Hoş Geldin Metni ve Aksiyon Butonu */}
            <div className="text-center max-w-2xl">
                <h1 className="text-6xl font-black mb-4 bg-linear-to-b from-foreground to-primary/80 bg-clip-text text-transparent uppercase leading-none py-2">
                    HOŞ GELDİN!
                </h1>

                <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] mb-8 font-bold">
                    Project Stellar: Idle Deckbuilder
                </p>

                {/* 👇 Changed from <Link> to <button> and added the onClick handler */}
                <button
                    onClick={handlePingBackend}
                    className="inline-block px-12 py-4 bg-primary text-primary-foreground rounded-full font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 uppercase tracking-widest text-xs border-none cursor-pointer"
                >
                    STRATEJİ BELİRLE (PİNG)
                </button>
            </div>
        </div>
    );
}
