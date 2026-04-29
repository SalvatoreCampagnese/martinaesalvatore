"use client";

import { motion } from "framer-motion";
import Countdown from "./Countdown";
import SectionHeader from "./SectionHeader";

export default function DateSection() {
  return (
    <section className="relative overflow-hidden bg-cream-dark/40 py-28">
      <div className="container-narrow">
        <SectionHeader eyebrow="save the date" title="il grande giorno" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 flex flex-col items-center gap-10"
        >
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone-700">
                domenica
              </span>
              <span className="mt-2 h-px w-16 bg-bordeaux/40" />
            </div>

            <div className="text-center">
              <span className="block font-sans text-xs uppercase tracking-[0.4em] text-stone-700">
                maggio
              </span>
              <span className="block font-serif text-7xl italic text-bordeaux sm:text-9xl">
                09
              </span>
              <span className="block font-sans text-sm tracking-[0.3em] text-stone-700">
                2027
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-stone-700">
                ore 17:30
              </span>
              <span className="mt-2 h-px w-16 bg-bordeaux/40" />
            </div>
          </div>

          <div className="mt-6 w-full">
            <Countdown />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
