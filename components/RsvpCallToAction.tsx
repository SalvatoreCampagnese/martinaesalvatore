"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FloralCorner from "./FloralCorner";

export default function RsvpCallToAction() {
  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-cream py-28 text-center"
    >
      <FloralCorner position="top-left" size={240} className="opacity-90" />
      <FloralCorner
        position="bottom-right"
        size={240}
        className="opacity-90"
      />

      <div className="container-narrow relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[11px] uppercase tracking-[0.5em] text-bordeaux/70"
        >
          R.S.V.P
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-6 font-serif text-3xl italic text-stone-800 sm:text-4xl"
        >
          Conferma entro il 30/03/2027
        </motion.h2>

        <p className="mx-auto mt-6 max-w-xl font-serif text-base text-stone-600">
          Per organizzare al meglio ogni dettaglio, ti chiediamo di confermare la
          tua presenza e segnalare eventuali allergie o intolleranze.
        </p>

        <Link href="/rsvp" className="btn-bordeaux mt-10">
          conferma la presenza
        </Link>
      </div>
    </section>
  );
}
