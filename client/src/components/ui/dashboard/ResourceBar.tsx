export function ResourceBar() {
    const resources = [
        { label: 'Star Gems', value: 1250, icon: '💎', color: 'text-blue-400' },
        { label: 'Celestial Wishes', value: 12, icon: '✨', color: 'text-pink-400' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
                <span className="font-black tracking-tighter text-xl">
                    KSN<span className="text-primary">ABLA</span>
                </span>
            </div>

            <div className="flex gap-6">
                {resources.map((res) => (
                    <div key={res.label} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                        <span className="text-sm">{res.icon}</span>
                        <span className="text-sm font-black text-text-h">{res.value}</span>
                        <button className="ml-1 text-xs hover:text-primary transition-colors">+</button>
                    </div>
                ))}
            </div>
        </nav>
    );
}