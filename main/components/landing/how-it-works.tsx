"use client";

import { ArrowRight, Settings, BarChart3, Zap, Shield } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Connect & Configure",
    description:
      "Connect your existing CI/CD systems and configure pipeline rules in minutes with our intuitive builder.",
    step: 1,
  },
  {
    icon: Zap,
    title: "Orchestrate Pipelines",
    description:
      "Define complex workflows with intelligent sequencing, parallelization, and conditional logic.",
    step: 2,
  },
  {
    icon: Shield,
    title: "Monitor & Recover",
    description:
      "Get real-time insights with automatic failure detection and intelligent recovery mechanisms.",
    step: 3,
  },
  {
    icon: BarChart3,
    title: "Optimize & Scale",
    description:
      "Leverage analytics and AI-powered recommendations to continuously improve pipeline performance.",
    step: 4,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-32 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get up and running in four simple steps
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-8 items-start">
                {/* Step number and line */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="h-16 w-0.5 bg-linear-to-b from-cyan-500 to-transparent my-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 pb-8">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
