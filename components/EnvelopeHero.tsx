"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Phase = "sealed" | "opening" | "expanding" | "done";

const FLAP_MS = 1100;
const EXPAND_MS = 1700;
const FADE_OUT_MS = 700;

export default function EnvelopeHero({
  onOpen
}: {
  onOpen: () => void
}) {
  const [phase, setPhase] = useState<Phase>("sealed");

  function start() {
    if (phase !== "sealed") return;
    setPhase("opening");
  }

  // Drive the phases via timers
  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("expanding"), FLAP_MS);
      return () => clearTimeout(t);
    }
    if (phase === "expanding") {
      const t = setTimeout(() => {
        setPhase("done");
        onOpen();
      }, EXPAND_MS + FADE_OUT_MS);
      return () => clearTimeout(t);
    }
  }, [phase, onOpen]);

  const isExpanding: boolean = phase === "expanding" || phase === "done";
  const isDone: boolean = phase === "done";
  const isOpening: boolean = phase === "opening";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-hidden bg-cream"
        >
          {/* Soft glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(162,6,3,0.05),_transparent_60%)]" />

          {/* Envelope shell — fades when expanding starts */}
          <motion.div
            animate={
              isExpanding ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }
            }
            transition={{
              duration: 0.9,
              ease: "easeOut"
            }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1400px" }}
          >
            <div
              className="relative h-[300px] w-[460px] sm:h-[360px] sm:w-[540px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Envelope body */}
              <div className="absolute inset-0 rounded-[6px] bg-gradient-to-br from-cream-dark to-cream shadow-[0_30px_70px_-20px_rgba(122,4,2,0.25)]" />

              {/* Bottom triangle (front) */}
              <div
                className="absolute inset-x-0 bottom-0 z-[2] h-[55%]"
                style={{
                  background:
                    "linear-gradient(135deg, #f4ecdd 0%, #fffaf3 100%)",
                  clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                  boxShadow: "inset 0 -8px 30px rgba(122,4,2,0.05)"
                }}
              />

              {/* Sides */}
              <div
                className="absolute inset-y-0 left-0 z-[2] w-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, #f4ecdd 0%, #fffaf3 100%)",
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)"
                }}
              />
              <div
                className="absolute inset-y-0 right-0 z-[2] w-1/2"
                style={{
                  background:
                    "linear-gradient(270deg, #f4ecdd 0%, #fffaf3 100%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 50%)"
                }}
              />

              {/* Top flap */}
              <motion.div
                animate={
                  phase !== "sealed" ? { rotateX: 180 } : { rotateX: 0 }
                }
                transition={{
                  duration: FLAP_MS / 1000,
                  ease: [0.7, 0, 0.3, 1]
                }}
                className="absolute inset-x-0 top-0 z-[3] h-[55%] origin-top"
                style={{
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f4ecdd 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden"
                }}
              />

              {/* Wax seal — perfectly centered using inset-0 + flex */}
              <div className="absolute inset-0 z-[4] flex items-center justify-center">
                <motion.button
                  onClick={start}
                  animate={
                    phase !== "sealed"
                      ? { scale: 0.5, opacity: 0, rotate: 24 }
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="relative cursor-pointer rounded-full transition-transform hover:scale-110"
                  aria-label="Apri l'invito"
                  style={{
                    pointerEvents: phase === "sealed" ? "auto" : "none"
                  }}
                >
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-bordeaux-light via-bordeaux to-bordeaux-dark shadow-[0_8px_24px_rgba(122,4,2,0.45),inset_-4px_-4px_8px_rgba(0,0,0,0.25),inset_4px_4px_8px_rgba(255,255,255,0.15)]">
                    <span className="font-script text-2xl leading-none text-cream">
                      M e S
                    </span>
                    <span className="absolute inset-1 rounded-full border border-cream/30" />
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* The morphing letter: starts as the inner card, expands to fill viewport.
              Content matches HeroNames exactly so the morph lands seamlessly. */}
          <motion.div
            animate={
              isExpanding
                ? {
                    width: "100vw",
                    height: "100vh",
                    borderRadius: 0,
                    opacity: isDone ? 0 : 1
                  }
                : {
                    width: 380,
                    height: 240,
                    borderRadius: 4,
                    opacity: isOpening ? 1 : 0
                  }
            }
            transition={{
              duration: isDone
                ? FADE_OUT_MS / 1000
                : isExpanding
                ? EXPAND_MS / 1000
                : 0.6,
              ease: [0.65, 0, 0.35, 1],
              opacity: {
                duration: isDone ? FADE_OUT_MS / 1000 : 0.5,
                delay: isDone
                  ? EXPAND_MS / 1000 - 0.2
                  : isOpening
                  ? 0.45
                  : 0
              }
            }}
            initial={{
              width: 380,
              height: 240,
              borderRadius: 4,
              opacity: 0
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden bg-cream shadow-[0_30px_70px_-30px_rgba(122,4,2,0.35)]"
          >
            {/* Floral corners — fade in as the letter expands */}
            <motion.div
              animate={
                isExpanding ? { opacity: 1 } : { opacity: 0 }
              }
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pointer-events-none absolute inset-0"
              aria-hidden
            >
              <Image
                src="/assets/rose.png"
                alt=""
                width={360}
                height={360}
                priority
                className="absolute left-0 top-0 opacity-95"
              />
              <Image
                src="/assets/rose.png"
                alt=""
                width={360}
                height={360}
                priority
                className="absolute bottom-0 right-0 -scale-100 opacity-95"
              />
            </motion.div>

            {/* Hero content — scales smoothly with the letter */}
            <motion.div
              animate={isExpanding ? { scale: 1 } : { scale: 0.26 }}
              transition={{
                duration: isExpanding ? EXPAND_MS / 1000 : 0.6,
                ease: [0.65, 0, 0.35, 1]
              }}
              initial={{ scale: 0.26 }}
              className="relative z-10 flex flex-col items-center px-6 text-center"
              style={{ transformOrigin: "center center" }}
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-bordeaux/80 sm:text-sm">
                siamo lieti di invitarvi al nostro matrimonio
              </p>

              <h1 className="mt-10 font-script text-[9rem] leading-none text-bordeaux">
                Martina
              </h1>
              <span className="my-2 font-script text-5xl text-bordeaux/80">
                e
              </span>
              <h1 className="font-script text-[9rem] leading-none text-bordeaux">
                Salvatore
              </h1>

              <div className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-10">
                <div className="flex flex-col items-end">
                  <span className="font-sans text-xs uppercase tracking-[0.35em] text-bordeaux">
                    domenica
                  </span>
                  <span className="mt-2 h-px w-32 bg-bordeaux/50" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-sans text-xs uppercase tracking-[0.4em] text-bordeaux">
                    maggio
                  </span>
                  <span className="font-serif text-8xl italic leading-none text-bordeaux">
                    09
                  </span>
                  <span className="font-serif text-lg text-stone-700">
                    2027
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-sans text-xs uppercase tracking-[0.35em] text-bordeaux">
                    ore 17:30
                  </span>
                  <span className="mt-2 h-px w-32 bg-bordeaux/50" />
                </div>
              </div>

              <p className="mt-10 font-sans text-xs uppercase tracking-[0.4em] text-stone-600">
                La Gaiana · Castel San Pietro Terme
              </p>
            </motion.div>
          </motion.div>

          {/* CTA hint while sealed */}
          <AnimatePresence>
            {phase === "sealed" && (
              <motion.button
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.9, duration: 0.9 }}
                onClick={start}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-xs uppercase tracking-[0.4em] text-bordeaux/80 transition-colors hover:text-bordeaux"
              >
                — clicca il sigillo per aprire —
              </motion.button>
            )}
          </AnimatePresence>

          {/* Date eyebrow above the envelope while sealed */}
          <AnimatePresence>
            {phase === "sealed" && (
              <motion.p
                key="eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.9 }}
                className="absolute left-1/2 top-[18%] -translate-x-1/2 font-sans text-xs uppercase tracking-[0.5em] text-bordeaux/70"
              >
                9 · maggio · 2027
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
