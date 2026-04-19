"use client";

import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">
              Introducing PipelineAI - Orchestrate with Intelligence
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Automate Your CI/CD
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Pipeline Orchestration
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400">
              Intelligent automation for complex CI/CD pipelines with real-time
              failure recovery, predictive insights, and seamless orchestration
              across your entire infrastructure.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-lg border border-zinc-700 text-white font-semibold hover:bg-zinc-900/50 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-white">99.9%</p>
              <p className="text-sm text-gray-400">Uptime SLA</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-white">10x</p>
              <p className="text-sm text-gray-400">Faster Deployments</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
              <p className="text-sm text-gray-400">Integrations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
