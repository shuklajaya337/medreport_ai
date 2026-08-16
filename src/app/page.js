"use client";

import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MouseGlow } from "@/components/ui/mouse-glow";
import { GlowOrb } from "@/components/ui/glow-orb";

export default function Home() {
  return (
    <>
      <MouseGlow />
      <GlowOrb />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-bold text-lg text-black dark:text-white">
          MedReport<span className="text-blue-600">AI</span>
        </span>
      </nav>

      {/* Landing Section */}
      <div
        className="relative"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AuroraBackground>
          <div className="relative flex flex-col gap-6 items-center justify-center px-4 min-h-screen text-center">
            <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-black">
              AI Medical Report Explainer
            </h1>
            <p className="font-light text-base md:text-xl dark:text-neutral-200 text-neutral-700 max-w-xl">
              Paste your lab report and let AI explain it in simple, easy-to-understand language.
            </p>
            <Link href="/report">
              <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-6 py-3 font-medium hover:scale-105 transition-transform">
                Get Started
              </button>
            </Link>
          </div>
        </AuroraBackground>
      </div>
    </>
  );
}