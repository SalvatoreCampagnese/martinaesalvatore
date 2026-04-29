import Link from "next/link";
import RsvpForm from "@/components/RsvpForm";
import FloralCorner from "@/components/FloralCorner";

export const metadata = {
  title: "RSVP — Martina e Salvatore"
};

export default function RsvpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream py-20">
      <FloralCorner position="top-left" size={260} className="opacity-90" />
      <FloralCorner
        position="bottom-right"
        size={260}
        className="opacity-90"
      />

      <div className="container-narrow relative z-10">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-bordeaux/70 hover:text-bordeaux"
          >
            ← torna alla home
          </Link>
          <p className="mt-6 font-serif text-base italic text-stone-600">
            Conferma entro il 30/03/2027
          </p>
        </div>

        <RsvpForm />
      </div>
    </main>
  );
}
