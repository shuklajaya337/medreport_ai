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
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-black dark:text-white">
          <span className="text-xl">🩺</span>
          <span>MedReport<span className="text-blue-500">AI</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
            AI×AI Clinical Suite
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/report"
            className="text-sm font-medium px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Launch Platform →
          </Link>
        </div>
      </nav>

      {/* Landing Section with Background Image */}
      <div
        className="relative min-h-screen"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AuroraBackground>
          <div className="relative flex flex-col gap-6 items-center justify-center px-4 pt-32 pb-20 min-h-screen text-center max-w-3xl mx-auto">

            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span>⚡</span>
              <span>Next-Gen Agentic Health Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              AI × AI Medical Report <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Explainer & Risk Engine
              </span>
            </h1>

            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
              Upload a lab report and get a clear, plain-language explanation of what it means —
              backed by real ML risk models and clinical guidelines.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/report">
                <button className="px-8 py-4 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200">
                  Analyze Lab Report Now
                </button>
              </Link>
            </div>
          </div>
        </AuroraBackground>
      </div>

      {/* Under the Hood — technical architecture, below the fold */}
      <div className="bg-white dark:bg-black py-20 px-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            What's under the hood
          </h2>
          <p className="text-center text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto">
            A multi-agent pipeline combining machine learning, explainable AI, and clinical evidence retrieval.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl mb-2">🤖 × 🤖</div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Multi-Agent AI×AI Loop</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Extraction, synthesis, and an autonomous safety-auditor agent that reviews the AI's own output.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Predictive ML Risk Scoring</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Trained models estimate cardiovascular and diabetes risk from your report values.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Explainable AI (SHAP)</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Shows exactly which biomarkers are driving your risk score, and by how much.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Biomarker Forecasting</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Projects where a biomarker is trending over the next 3–6 months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}