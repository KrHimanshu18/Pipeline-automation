"use client";

import { TrendingUp, Clock, Zap, DollarSign } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Reduce Deployment Time",
    description:
      "Cut deployment times by up to 10x through intelligent pipeline optimization and parallel execution.",
    metric: "10x Faster",
  },
  {
    icon: Zap,
    title: "Near-Zero Downtime",
    description:
      "Automated failure recovery ensures your pipelines keep running with minimal manual intervention.",
    metric: "99.9% Uptime",
  },
  {
    icon: TrendingUp,
    title: "Improve Team Productivity",
    description:
      "Eliminate manual pipeline management, allowing your team to focus on innovation.",
    metric: "80% Less Manual Work",
  },
  {
    icon: DollarSign,
    title: "Reduce Infrastructure Costs",
    description:
      "Optimize resource utilization and eliminate wasted compute resources.",
    metric: "40% Cost Savings",
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="relative py-20 md:py-32 bg-linear-to-b from-black to-zinc-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Transform Your DevOps
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See measurable improvements across deployment time, reliability, and
            team efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 transition-all"
              >
                {/* Background linear */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {benefit.metric}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400">{benefit.description}</p>
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
