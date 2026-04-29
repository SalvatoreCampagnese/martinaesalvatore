import type { Metadata } from "next";
import { Montserrat, Judson, MonteCarlo } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap"
});

const judson = Judson({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-judson",
  display: "swap"
});

const montecarlo = MonteCarlo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montecarlo",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Martina e Salvatore — 9 Maggio 2027",
  description:
    "Ci siamo conosciuti in un mondo virtuale, ma ci siamo scelti nella vita. 9 Maggio 2027, La Gaiana — Castel San Pietro Terme.",
  openGraph: {
    title: "Martina e Salvatore — 9 Maggio 2027",
    description:
      "Ci siamo conosciuti in un mondo virtuale, ma ci siamo scelti nella vita.",
    type: "website",
    locale: "it_IT"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${montserrat.variable} ${judson.variable} ${montecarlo.variable}`}
    >
      <body className="bg-cream font-sans">{children}</body>
    </html>
  );
}
