import { useState, useEffect } from "react";

export function useSessionCountdown(startTimeStr: string | undefined, totalMinutes: number) {
  const [timeLeft, setTimeLeft] = useState("--:--:--");

  useEffect(() => {
    if (!startTimeStr || totalMinutes === undefined) return;

    const calculateTimer = () => {
      const now = new Date();
      
      // 1. Ambil jam, menit, detik dari startTime API
      const apiDate = new Date(startTimeStr);
      const hStart = apiDate.getHours();
      const mStart = apiDate.getMinutes();
      const sStart = apiDate.getSeconds();

      // 2. Tentukan kapan sesi dimulai HARI INI
      const sessionStartToday = new Date();
      sessionStartToday.setHours(hStart, mStart, sStart, 0);

      // 3. Tentukan kapan sesi berakhir HARI INI
      const sessionEndToday = new Date(sessionStartToday.getTime() + totalMinutes * 60 * 1000);

      // 4. Hitung selisih dari SEKARANG ke WAKTU SELESAI
      const diff = sessionEndToday.getTime() - now.getTime();

      // Jika sekarang belum masuk waktu mulai, tampilkan durasi total
      if (now < sessionStartToday) {
        setTimeLeft(formatMsToTime(totalMinutes * 60 * 1000));
        return;
      }

      // Jika waktu sudah lewat dari target selesai
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      // Update state dengan format HH:mm:ss
      setTimeLeft(formatMsToTime(diff));
    };

    // Helper untuk format milidetik ke HH:mm:ss
    function formatMsToTime(ms: number) {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    calculateTimer(); // Jalankan langsung saat mount
    const interval = setInterval(calculateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTimeStr, totalMinutes]);

  return timeLeft;
}