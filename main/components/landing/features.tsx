"use client";

import {
  Zap,
  Shield,
  BarChart3,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Workflow,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Pipeline Orchestration",
    description:
      "Coordinate complex multi-stage pipelines with intelligent sequencing and dependency management.",
  },
  {
    icon: AlertCircle,
    title: "Failure Detection",
    description:
      "Real-time monitoring and instant alerts for pipeline failures across all stages.",
  },
  {
    icon: Shield,
    title: "Automated Recovery",
    description:
      "Intelligent self-healing pipelines that detect and recover from failures automatically.",
  },
  {
    icon: Workflow,
    title: "Visual Workflows",
    description:
      "intuitive drag-and-drop pipeline designer with real-time visualization.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Comprehensive dashboards tracking pipeline performance, trends, and optimization opportunities.",
  },
  {
    icon: Zap,
    title: "Parallel Execution",
    description:
      "Maximize throughput with intelligent parallel processing and resource optimization.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Role-based access control, audit logs, and compliance-ready infrastructure.",
  },
  {
    icon: CheckCircle2,
    title: "Multi-Provider Support",
    description:
      "Seamless integration with GitHub, GitLab, Jenkins, AWS, Azure, and more.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-32 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to orchestrate, monitor, and automate your CI/CD
            pipelines
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all hover:border-zinc-700"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" />

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
