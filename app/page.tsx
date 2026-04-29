"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HeroNames from "@/components/HeroNames";
import StorySection from "@/components/StorySection";
import DateSection from "@/components/DateSection";
import VenueSection from "@/components/VenueSection";
import ProgramSection from "@/components/ProgramSection";
import GiftSection from "@/components/GiftSection";
import RsvpCallToAction from "@/components/RsvpCallToAction";
import Footer from "@/components/Footer";

const EnvelopeHero = dynamic(() => import("@/components/EnvelopeHero"), {
  ssr: false
});

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative">
      {!opened && <EnvelopeHero onOpen={() => setOpened(true)} />}
      <HeroNames />
      <StorySection />
      <DateSection />
      <VenueSection />
      <ProgramSection />
      <GiftSection />
      <RsvpCallToAction />
      <Footer />
    </main>
  );
}
