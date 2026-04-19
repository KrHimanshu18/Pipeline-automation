"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-backdrop-filter:bg-black/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500" />
            <span className="text-xl font-bold text-white">PipelineAI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden gap-4 md:flex">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ?
              <X size={24} />
            : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-zinc-800 py-4 space-y-4">
            <a
              href="#features"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
              <button
                onClick={() => router.push("/login")}
                className="w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Get Started
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
