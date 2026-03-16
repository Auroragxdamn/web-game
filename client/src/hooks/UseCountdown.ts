import { useState, useEffect } from 'react';

export function useCountdown(targetDate: number, isEnabled: boolean, onExpire?: () => void) {
    const [timeLeft, setTimeLeft] = useState("00:00:00");

    useEffect(() => {
        // targetDate 0 ise veya kilitli değilse başlama
        if (!isEnabled || !targetDate || targetDate <= 0) {
            setTimeLeft("00:00:00");
            return;
        }

        const calculate = () => {
            const now = Date.now();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                if (onExpire) onExpire();
                return false; // Durdur
            }

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            const pad = (n: number) => n.toString().padStart(2, '0');
            setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
            return true; // Devam et
        };

        // İlk saniyeyi beklemeden hemen çalıştır
        const shouldContinue = calculate();
        if (!shouldContinue) return;

        const timer = setInterval(calculate, 1000);

        return () => clearInterval(timer);
    }, [targetDate, isEnabled, onExpire]); // targetDate değişimini izliyoruz

    return timeLeft;
}