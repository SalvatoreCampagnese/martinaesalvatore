"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const IBAN = "IT54 R036 6901 6002 3476 2768 802";

export default function GiftSection() {
  const [copied, setCopied] = useState(false);

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(IBAN.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  }

  return (
    <section
      id="lista-nozze"
      className="relative overflow-hidden bg-cream py-28"
    >
      <div className="container-narrow">
        <SectionHeader eyebrow="lista nozze" title="Un pensiero" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-14 flex flex-col items-center text-center"
        >
          <p className="font-script text-3xl text-bordeaux sm:text-4xl">
            Il regalo più bello sarà avervi con noi.
          </p>

          <p className="mt-8 max-w-2xl font-serif text-lg italic text-stone-700">
            Se desiderate contribuire al nostro futuro insieme…
          </p>
          <p className="mt-2 max-w-2xl font-serif text-lg italic text-stone-700">
            La vostra presenza sarà il dono più prezioso.
          </p>
          <p className="mt-6 max-w-2xl font-serif text-base text-stone-600">
            Per chi lo desidera, è possibile contribuire al nostro viaggio
            insieme.
          </p>

          <div className="ornament mt-12" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-10 w-full max-w-2xl rounded-md border border-bordeaux/20 bg-cream-dark/30 p-8 shadow-[0_24px_60px_-40px_rgba(122,4,2,0.35)]"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-bordeaux/70">
              iban
            </p>
            <p className="mt-3 break-all font-serif text-xl tracking-[0.05em] text-bordeaux sm:text-2xl">
              {IBAN}
            </p>
            <p className="mt-5 font-serif text-sm italic text-stone-600">
              Intestato a Salvatore Campagnese &amp; Martina Pillon
            </p>

            <button
              type="button"
              onClick={copyIban}
              className="btn-outline mt-8"
            >
              {copied ? "iban copiato ✓" : "copia iban"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
