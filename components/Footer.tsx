"use client";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-bordeaux/15 bg-cream py-14 text-center">
      <div className="container-narrow flex flex-col items-center gap-3">
        <span className="font-script text-4xl text-bordeaux">M e S</span>
        <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-stone-500">
          09 · 05 · 2027 — La Gaiana
        </p>
        <p className="font-serif text-xs italic text-stone-500">
          www.martinaesalvatore.com
        </p>
      </div>
    </footer>
  );
}
