import { useState, useEffect } from 'react'
import './App.css'
import type { CardProps } from './components/ui/Card';
import { ResourceBar } from './components/ui/dashboard/ResourceBar';
import { SpotifyGamePlayer } from './components/spotify/SpotifyGamePlayer';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CardsPage from './pages/CardsPage';

const DECK_DATA: CardProps[] = [
  { id: 1, name: "Aegis Prime", faction: "Valkyrie Academy", role: "Support", power: 82, description: "Command: Müttefik geliştirme maliyetini %15 azaltır.", rarity: "epic" },
  { id: 2, name: "Neon Architect", faction: "Cyber-Syndicate", role: "Generation", power: 40, description: "Logistics: Pasif altın üretimini saatlik 500 artırır.", rarity: "rare" },
  { id: 3, name: "Oracle System", faction: "Cyber-Syndicate", role: "Manipulation", power: 65, description: "Intel: Günlük çekiliş şanslarını kontrol eder.", rarity: "rare" },
  { id: 4, name: "Seraphina v4", faction: "Valkyrie Academy", role: "Diva", power: 5, description: "Prestige: Ultra-nadir koleksiyon parçası.", rarity: "legendary" },
  { id: 5, name: "Flux Capacitor", faction: "Cyber-Syndicate", role: "Conversion", power: 55, description: "R&D: Altını ekstra çekiliş hakkına dönüştürür.", rarity: "epic" },
  { id: 6, name: "Data Miner", faction: "Cyber-Syndicate", role: "Generation", power: 30, description: "Logistics: Temel düzeyde idle gold üretimi.", rarity: "common" },
];

export default function App() {
  const [gold, setGold] = useState(1000);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState<number>(0);

  const currentIncome = (() => {
    let income = 5;
    selectedIds.forEach(id => {
      const card = DECK_DATA.find(c => c.id === id);
      if (card?.role === "Generation") income += Math.floor(card.power / 2);
    });
    return income;
  })();

  useEffect(() => {
    const interval = setInterval(() => setGold((prev) => prev + currentIncome), 1000);
    return () => clearInterval(interval);
  }, [currentIncome]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground relative font-sans">
        <nav className="fixed top-0 left-0 right-0 z-1000 flex justify-between items-center px-8 py-3 bg-white/90 backdrop-blur-md border-b border-border h-16 pointer-events-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 select-none">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-[10px] text-white font-black">G</div>
              <span className="text-xl font-black tracking-tighter uppercase italic text-black">
                GAME<span className="text-primary">WEB</span>
              </span>
            </div>
            <div className="flex gap-8 relative z-1001">
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-primary transition-all no-underline py-2">Dashboard</Link>
              <Link to="/cards" className="text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-primary transition-all no-underline py-2">Envanter</Link>
            </div>
          </div>
          <ResourceBar />
        </nav>

        <div className="relative z-10 pt-24 px-6 md:px-12">
          <div className="mb-10">
            <SpotifyGamePlayer />
          </div>

          <Routes>
            <Route path="/" element={<Dashboard gold={gold} income={currentIncome} />} />
            <Route path="/cards" element={
              <CardsPage
                deckData={DECK_DATA}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                unlockTime={unlockTime}
                setUnlockTime={setUnlockTime}
              />
            } />
          </Routes>
        </div>

        <footer className="mt-20 text-center text-muted-foreground text-[10px] uppercase tracking-[0.5em] pb-10 opacity-30">
          Project Stellar: Idle Deckbuilder
        </footer>
      </div>
    </Router>
  );
}
