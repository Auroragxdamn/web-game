export function EfficiencyStats() {
    return (
        <div className="flex flex-wrap justify-center gap-6">
            {/* 1. Stat */}
            <div className="bg-white border border-border rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                <div className="text-2xl">📈</div>
                <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Idle Multiplier</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">x2.4</span>
                        <span className="text-[10px] text-primary font-bold">Logistics Focus</span>
                    </div>
                </div>
            </div>

            {/* 2. Stat */}
            <div className="bg-white border border-border rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                <div className="text-2xl">🏷️</div>
                <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Leveling Discount</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">%15</span>
                        <span className="text-[10px] text-primary font-bold">Command Buff</span>
                    </div>
                </div>
            </div>

            {/* 3. Stat */}
            <div className="bg-white border border-border rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                <div className="text-2xl">🧠</div>
                <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily RNG Boost</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">+12%</span>
                        <span className="text-[10px] text-primary font-bold">Intel Intel</span>
                    </div>
                </div>
            </div>
        </div>
    );
}