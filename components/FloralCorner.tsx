"use client";

import Image from "next/image";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const positionStyles: Record<Position, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-100"
};

export default function FloralCorner({
  position,
  size = 320,
  className = ""
}: {
  position: Position;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 ${positionStyles[position]} ${className}`}
      aria-hidden
    >
      <Image
        src="/assets/rose.png"
        alt=""
        width={size}
        height={size}
        priority
        className="select-none drop-shadow-[0_8px_20px_rgba(122,4,2,0.08)]"
      />
    </div>
  );
}
