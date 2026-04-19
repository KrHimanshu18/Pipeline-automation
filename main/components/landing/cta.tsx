"use client";

import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 md:py-32 bg-linear-to-b from-black to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative rounded-2xl border border-zinc-700 bg-linear-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur p-12 md:p-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm text-cyan-200">Limited Time Offer</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Pipelines?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join hundreds of engineering teams using PipelineAI to automate
              their CI/CD orchestration. Start your free trial today—no credit
              card required.
            </p>

            {/* Features list */}
            <div className="grid md:grid-cols-3 gap-6 py-8">
              <div className="space-y-2">
                <p className="font-semibold text-white">14-Day Free Trial</p>
                <p className="text-sm text-gray-400">
                  Full access to all features
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-white">No Credit Card</p>
                <p className="text-sm text-gray-400">Required to get started</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-white">24/7 Support</p>
                <p className="text-sm text-gray-400">Expert team on standby</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg border border-zinc-600 text-white font-semibold hover:bg-zinc-800/50 transition-colors">
                Schedule Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="text-sm text-gray-400 pt-4">
              Trusted by teams at{" "}
              <span className="text-gray-300">
                Vercel, Stripe, and 200+ companies
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
