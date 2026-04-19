"use client";

import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden px-4">
      {/* Background linear */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur p-8 md:p-12">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="mb-8 flex flex-col items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500" />
            <h2 className="text-2xl font-bold text-white">PipelineAI</h2>
          </Link>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
