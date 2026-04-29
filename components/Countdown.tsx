"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2027-05-09T17:30:00+02:00").getTime();

function diff() {
  const now = Date.now();
  const delta = Math.max(0, TARGET - now);
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(diff());
    const id = setInterval(() => setTime(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "giorni", value: time.days },
    { label: "ore", value: time.hours },
    { label: "minuti", value: time.minutes },
    { label: "secondi", value: time.seconds }
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-10">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-[68px] flex-col items-center sm:min-w-[88px]"
        >
          <span
            className="font-serif text-4xl text-bordeaux sm:text-6xl"
            suppressHydrationWarning
          >
            {mounted ? String(item.value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.3em] text-stone-600 sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
