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
          <div className="relative flex flex-col gap-6 items-center justify-center px-4 pt-32 pb-20 min-h-screen text-center max-w-4xl mx-auto">
            
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

            <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Autonomous multi-agent clinical pipeline combining <strong>predictive ML risk models</strong>, 
              <strong> Explainable AI (SHAP)</strong>, <strong>RAG clinical guidelines</strong>, and an 
              <strong> AI Safety Critic</strong> to demystify complex lab results.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/report">
                <button className="px-8 py-4 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200">
                  Analyze Lab Report Now
                </button>
              </Link>
            </div>

            {/* Data Science Architecture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-12 text-left">
              <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
                <div className="text-2xl mb-2">🤖 × 🤖</div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Multi-Agent AI×AI Loop</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Extraction agent, clinical synthesis, and autonomous peer-review AI safety auditor.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Predictive ML Risk Scoring</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Supervised Gradient Boosting models for 10-Yr Cardiovascular and Diabetes risk stratification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Explainable AI (SHAP)</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Marginal feature contribution rankings showing which biomarkers drive clinical risk.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
                <div className="text-2xl mb-2">📈</div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Biomarker Forecasting</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Longitudinal time-series trajectory estimation with 3m/6m predictive velocity projections.
                </p>
              </div>
            </div>

          </div>
        </AuroraBackground>
      </div>
    </>
  );
}