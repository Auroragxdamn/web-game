export interface CardProps {
    id: number;
    name: string;
    faction: string; // Valkyrie Academy, Cyber-Syndicate vb.
    role: 'Generation' | 'Manipulation' | 'Conversion' | 'Support' | 'Diva';
    power: number;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function Card({ name, faction, role, power, description, rarity }: CardProps) {
    // Role göre ikon ve renk belirleme
    const roleStyles = {
        Generation: { icon: '💰', color: 'text-green-500', label: 'Logistics' },
        Manipulation: { icon: '🧠', color: 'text-blue-400', label: 'Intel' },
        Conversion: { icon: '🔄', color: 'text-orange-400', label: 'R&D' },
        Support: { icon: '🛡️', color: 'text-purple-400', label: 'Command' },
        Diva: { icon: '✨', color: 'text-pink-500', label: 'Prestige' },
    };

    const rarityStyles = {
        common: 'border-border',
        rare: 'border-blue-500/30 shadow-blue-500/5',
        epic: 'border-purple-500/40 shadow-purple-500/10',
        legendary: 'border-amber-500/50 shadow-amber-500/20 ring-1 ring-amber-500/20',
    };

    return (
        <div className={`relative group w-72 h-[480px] bg-card border-2 ${rarityStyles[rarity]} rounded-2xl p-5 transition-all duration-500 hover:-translate-y-4 flex flex-col overflow-hidden`}>

            {/* Faction & Role Header */}
            <div className="flex justify-between items-start mb-4 z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary">{faction}</span>
                    <div className={`flex items-center gap-1 text-[11px] font-bold ${roleStyles[role].color}`}>
                        <span>{roleStyles[role].icon}</span>
                        <span className="uppercase tracking-widest">{roleStyles[role].label}</span>
                    </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-secondary/50 backdrop-blur-md flex items-center justify-center font-black text-sm border border-border">
                    {power}
                </div>
            </div>

            {/* Main Visual */}
            <div className="w-full h-44 bg-muted rounded-xl border border-border/50 flex items-center justify-center mb-4 relative overflow-hidden group-hover:bg-accent/5 transition-colors">
                <div className="text-5xl drop-shadow-2xl">{role === 'Diva' ? '⭐' : '🃏'}</div>
                {rarity === 'legendary' && (
                    <div className="absolute inset-0 bg-linear-to-t from-amber-500/10 to-transparent" />
                )}
            </div>

            {/* Name & Description */}
            <div className="flex flex-col gap-2 text-left z-10">
                <h3 className={`text-2xl font-black leading-tight ${rarity === 'legendary' ? 'text-amber-500' : 'text-text-h'}`}>
                    {name}
                </h3>
                <p className="text-xs text-text leading-relaxed line-clamp-4 italic opacity-80">
                    "{description}"
                </p>
            </div>

            {/* Stats / Role Detail Footnote */}
            <div className="mt-auto pt-4 border-t border-border/20 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{role} Unit</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{rarity.toUpperCase()}</span>
                </div>
                {role === 'Diva' && (
                    <div className="w-full py-1 bg-pink-500/10 text-pink-500 text-[9px] font-black text-center rounded uppercase tracking-widest">
                        Ultimate Endgame Flex
                    </div>
                )}
            </div>
        </div>
    );
}