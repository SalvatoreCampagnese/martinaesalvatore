"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function VenueSection() {
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=La+Gaiana+Via+Emilia+Ponente+3201a+Castel+San+Pietro+Terme";

  return (
    <section id="luogo" className="relative overflow-hidden bg-cream py-28">
      <div className="container-narrow">
        <SectionHeader eyebrow="dove" title="La Gaiana" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center"
        >
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <p className="font-serif text-xl italic text-bordeaux">
              Vi aspettiamo presso
            </p>
            <h3 className="mt-3 font-script text-5xl text-bordeaux">
              La Gaiana
            </h3>
            <p className="mt-6 font-serif text-lg text-stone-700">
              Via Emilia Ponente, 3201a
              <br />
              40024 — Castel San Pietro Terme (BO)
            </p>
            <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-stone-600">
              cerimonia · ore 17:30
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-8"
            >
              indicazioni stradali
            </a>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-md border border-bordeaux/20 shadow-[0_20px_60px_-30px_rgba(122,4,2,0.4)]">
              <iframe
                title="Mappa La Gaiana"
                src="https://www.google.com/maps?q=La+Gaiana+Via+Emilia+Ponente+3201a+Castel+San+Pietro+Terme&output=embed"
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
