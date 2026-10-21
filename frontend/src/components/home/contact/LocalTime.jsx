import React, { useState, useEffect } from 'react';
import { useLabStore } from '../../../store/store';

const LocalTime = () => {
  const theme = useLabStore((state) => state.theme);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      // Formats the current time strictly to IST (Asia/Kolkata)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const timeString = formatter.format(new Date());
      
      setTime(`${timeString} IST`);
    };

    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000); // Tick every second

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.55rem] uppercase tracking-[0.2em] font-bold text-zinc-600">
        Local Time
      </span>
      {/* Monospace font gives it that live terminal/telemetry feel */}
      <span className={`text-xs sm:text-sm font-mono tracking-widest ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
        {time || 'CALCULATING...'}
      </span>
    </div>
  );
};

export default LocalTime;