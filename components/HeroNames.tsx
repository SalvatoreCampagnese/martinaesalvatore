"use client";

import { motion } from "framer-motion";
import FloralCorner from "./FloralCorner";

export default function HeroNames() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream">
      <FloralCorner position="top-left" size={360} className="opacity-95" />
      <FloralCorner
        position="bottom-right"
        size={360}
        className="opacity-95"
      />

      <div className="relative z-20 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="font-sans text-[11px] uppercase tracking-[0.5em] text-bordeaux/80 sm:text-sm"
        >
          siamo lieti di invitarvi al nostro matrimonio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="mt-10 font-script text-7xl leading-none text-bordeaux sm:text-[9rem]"
        >
          Martina
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="my-2 font-script text-4xl text-bordeaux/80 sm:text-5xl"
        >
          e
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.2 }}
          className="font-script text-7xl leading-none text-bordeaux sm:text-[9rem]"
        >
          Salvatore
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.4 }}
          className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-6 sm:gap-x-10"
        >
          <div className="flex flex-col items-end">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-bordeaux sm:text-xs">
              domenica
            </span>
            <span className="mt-2 h-px w-24 bg-bordeaux/50 sm:w-32" />
          </div>

          <div className="flex flex-col items-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-bordeaux sm:text-xs">
              maggio
            </span>
            <span className="font-serif text-7xl italic leading-none text-bordeaux sm:text-8xl">
              09
            </span>
            <span className="font-serif text-base text-stone-700 sm:text-lg">
              2027
            </span>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-bordeaux sm:text-xs">
              ore 17:30
            </span>
            <span className="mt-2 h-px w-24 bg-bordeaux/50 sm:w-32" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="mt-10 font-sans text-[11px] uppercase tracking-[0.4em] text-stone-600"
        >
          La Gaiana · Castel San Pietro Terme
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        <span className="block text-center font-sans text-[10px] uppercase tracking-[0.4em] text-bordeaux/70">
          scroll
        </span>
        <span className="mx-auto mt-2 block h-10 w-px animate-pulse bg-bordeaux/40" />
      </motion.div>
    </section>
  );
}
