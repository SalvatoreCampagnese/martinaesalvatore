"use client";

import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <section className="relative overflow-hidden bg-cream py-28">
      <div className="container-narrow flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[11px] uppercase tracking-[0.45em] text-bordeaux/70"
        >
          la nostra storia
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mt-8 max-w-3xl font-script text-4xl leading-tight text-bordeaux sm:text-6xl"
        >
          Ci siamo conosciuti in un mondo virtuale,
          <br />
          ma ci siamo scelti nella vita.
        </motion.h2>

        <div className="ornament mt-10" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 max-w-2xl font-serif text-lg leading-relaxed text-stone-700"
        >
          Tra schermi e parole, tra giornate distanti e notti vicine, abbiamo
          imparato a conoscerci. Oggi quel filo invisibile diventa un sì, un
          giorno, un per sempre. Saremmo onorati di averti accanto a noi.
        </motion.p>
      </div>
    </section>
  );
}
