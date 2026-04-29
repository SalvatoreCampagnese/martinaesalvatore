"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const programma = [
  { time: "17:30", title: "Cerimonia", desc: "L'inizio del nostro per sempre" },
  { time: "18:30", title: "Aperitivo", desc: "Brindisi di benvenuto in giardino" },
  { time: "20:00", title: "Cena", desc: "A tavola tra noi" },
  { time: "23:00", title: "Festa & Taglio Torta", desc: "Si balla fino a notte fonda" }
];

export default function ProgramSection() {
  return (
    <section className="relative overflow-hidden bg-cream-dark/40 py-28">
      <div className="container-narrow">
        <SectionHeader eyebrow="programma" title="il nostro giorno" />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {programma.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="flex flex-col items-center rounded-md border border-bordeaux/15 bg-cream/70 px-6 py-10 text-center shadow-[0_10px_30px_-20px_rgba(122,4,2,0.25)]"
            >
              <span className="font-serif text-3xl italic text-bordeaux">
                {p.time}
              </span>
              <span className="mt-3 h-px w-10 bg-bordeaux/40" />
              <h3 className="mt-4 font-sans text-sm uppercase tracking-[0.3em] text-stone-800">
                {p.title}
              </h3>
              <p className="mt-3 font-serif text-sm italic text-stone-600">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
