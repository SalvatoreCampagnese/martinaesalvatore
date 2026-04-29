"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Phase =
  | "sealed"
  | "opening"
  | "slideOut"
  | "expanding"
  | "done";

const FLAP_MS = 1100;
const SLIDE_MS = 1300;
const EXPAND_MS = 1700;
const FADE_OUT_MS = 700;

// Slide-out endpoint: how far above viewport center the letter ends up
// (in px, both for the inner letter's translateY and the outer letter's
// initial position so the swap is invisible).
const SLIDE_OUT_Y = -260;

function MiniLetterContent() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="font-sans text-[8px] uppercase tracking-[0.4em] text-bordeaux/80">
        siamo lieti di invitarvi
      </p>
      <h2 className="font-script text-[34px] leading-none text-bordeaux">
        Martina
      </h2>
      <span className="font-script text-lg leading-none text-bordeaux/80">
        e
      </span>
      <h2 className="font-script text-[34px] leading-none text-bordeaux">
        Salvatore
      </h2>
      <span className="mt-1 h-px w-14 bg-bordeaux/40" />
      <p className="font-serif text-[10px] text-stone-700">
        9 maggio 2027 · La Gaiana
      </p>
    </div>
  );
}

function FullHeroContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-bordeaux/80 sm:text-sm">
        siamo lieti di invitarvi al nostro matrimonio
      </p>
      <h1 className="mt-10 font-script text-[9rem] leading-none text-bordeaux">
        Martina
      </h1>
      <span className="my-2 font-script text-5xl text-bordeaux/80">e</span>
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
          <span className="font-serif text-lg text-stone-700">2027</span>
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
    </div>
  );
}

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

  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("slideOut"), FLAP_MS);
      return () => clearTimeout(t);
    }
    if (phase === "slideOut") {
      const t = setTimeout(() => setPhase("expanding"), SLIDE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "expanding") {
      const t = setTimeout(() => {
        setPhase("done");
        onOpen();
      }, EXPAND_MS);
      return () => clearTimeout(t);
    }
  }, [phase, onOpen]);

  const isOpened = phase !== "sealed";
  const isSliding = phase === "slideOut";
  const isExpanding = phase === "expanding" || phase === "done";
  const isDone = phase === "done";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-hidden bg-cream"
        >
          {/* Soft ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(162,6,3,0.05),_transparent_60%)]" />

          {/* Envelope shell — fades during expansion */}
          <motion.div
            animate={
              isExpanding
                ? { opacity: 0, scale: 1.05 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1400px" }}
          >
            <div
              className="relative h-[300px] w-[460px] sm:h-[360px] sm:w-[540px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back of envelope */}
              <div className="absolute inset-0 rounded-[6px] bg-gradient-to-br from-cream-dark to-cream shadow-[0_30px_70px_-20px_rgba(122,4,2,0.25)]" />

              {/* INNER LETTER — z-[1] inside envelope.
                  Stays hidden under flap & triangles when sealed.
                  After flap opens it peeks; then slides up & out.
                  The outer flex wrapper handles centering so animating `y`
                  doesn't fight Tailwind's translate utilities. */}
              <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
                <motion.div
                  initial={{ y: 0, opacity: 1 }}
                  animate={
                    isExpanding
                      ? { y: SLIDE_OUT_Y, opacity: 0 }
                      : isSliding
                      ? { y: SLIDE_OUT_Y, opacity: 1 }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{
                    y: {
                      duration: isSliding ? SLIDE_MS / 1000 : 0.4,
                      ease: [0.55, 0, 0.45, 1]
                    },
                    opacity: {
                      duration: 0.25,
                      delay: isExpanding ? 0.05 : 0
                    }
                  }}
                  className="flex h-[180px] w-[300px] sm:h-[210px] sm:w-[360px] items-center justify-center rounded-[3px] bg-cream px-4 py-3 shadow-[0_6px_18px_-8px_rgba(122,4,2,0.35)]"
                >
                  <MiniLetterContent />
                </motion.div>
              </div>

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

              {/* Side flaps */}
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
                animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }}
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

              {/* Wax seal — perfectly centered */}
              <div className="absolute inset-0 z-[4] flex items-center justify-center">
                <motion.button
                  onClick={start}
                  animate={
                    isOpened
                      ? { scale: 0.5, opacity: 0, rotate: 24 }
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
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

          {/* OUTER LETTER — appears at the slide-out endpoint and expands
              to full screen. The flex wrapper centers it; `y` animates
              the offset from center without fighting transforms. */}
          <AnimatePresence>
            {isExpanding && (
              <div
                key="outer-letter-wrap"
                className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
              >
                <motion.div
                  key="outer-letter"
                  initial={{
                    width: 360,
                    height: 210,
                    y: SLIDE_OUT_Y,
                    borderRadius: 3,
                    opacity: 1
                  }}
                  animate={
                    isDone
                      ? {
                          width: "100vw",
                          height: "100vh",
                          y: 0,
                          borderRadius: 0,
                          opacity: 0
                        }
                      : {
                          width: "100vw",
                          height: "100vh",
                          y: 0,
                          borderRadius: 0,
                          opacity: 1
                        }
                  }
                  transition={{
                    duration: isDone
                      ? FADE_OUT_MS / 1000
                      : EXPAND_MS / 1000,
                    ease: [0.65, 0, 0.35, 1]
                  }}
                  className="flex items-center justify-center overflow-hidden bg-cream shadow-[0_30px_70px_-30px_rgba(122,4,2,0.35)]"
                >
                {/* Floral corners fade in during expansion */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.6 }}
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

                {/* Hero content scales smoothly from MiniLetter size to full hero */}
                <motion.div
                  initial={{ scale: 0.22 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: EXPAND_MS / 1000,
                    ease: [0.65, 0, 0.35, 1]
                  }}
                  className="relative z-10 px-6"
                  style={{ transformOrigin: "center center" }}
                >
                  <FullHeroContent />
                </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
