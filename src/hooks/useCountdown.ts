import { useState, useEffect } from 'react';

export interface CountdownResult {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
  totalSeconds: number;
  formattedTime: string;
}

/**
 * High-performance, drift-free synchronized countdown hook.
 * Calculates time remaining directly from absolute timestamps to eliminate tick skew.
 */
export function useCountdown(targetTimestamp: number): CountdownResult {
  const calculateTimeRemaining = (): CountdownResult => {
    const now = Date.now();
    const difference = Math.max(0, targetTimestamp - now);
    const totalSeconds = Math.floor(difference / 1000);

    if (difference <= 0) {
      return {
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: true,
        totalSeconds: 0,
        formattedTime: '00:00:00',
      };
    }

    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    const formattedHours = pad(hours);
    const formattedMinutes = pad(minutes);
    const formattedSeconds = pad(seconds);

    return {
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds,
      isExpired: false,
      totalSeconds,
      formattedTime: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeRemaining);

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeRemaining());

    const interval = setInterval(() => {
      const updated = calculateTimeRemaining();
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return timeLeft;
}
