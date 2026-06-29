import { useEffect, useState } from "react";

export function useNextActivityCountdown(nextActivityTime?: string) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [secondsLeft, setSecondsLeft] = useState(0); // Tambahkan ini
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!nextActivityTime) {
        setTimeLeft("00:00:00");
        setSecondsLeft(0);
        return;
    };

    const calculate = () => {
      const now = new Date();
      const activityDate = new Date(nextActivityTime);

      const target = new Date();
      target.setHours(
        activityDate.getHours(),
        activityDate.getMinutes(),
        activityDate.getSeconds(),
        0
      );

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setSecondsLeft(0); // Set ke 0 jika waktu habis
        setInitialized(true);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000); // Hitung total detik
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
 
      setSecondsLeft(totalSeconds); // Update state detik
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
      setInitialized(true);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [nextActivityTime]);

  return {
    timeLeft,
    secondsLeft,
    initialized,
  };
}