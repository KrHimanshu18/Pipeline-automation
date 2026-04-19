"use client";

import { Key, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";

interface GitHubTokenSetupProps {
  onSuccess?: () => void;
}

export function GitHubTokenSetup({ onSuccess }: GitHubTokenSetupProps) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/github/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubToken: token }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save token");
      }

      setSuccess(true);
      setToken("");
      await refreshUser();
      onSuccess?.();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key size={20} className="text-cyan-400" />
          GitHub Personal Access Token
        </h3>
        <p className="text-sm text-gray-400">
          Connect your GitHub account to view Actions logs for your repositories
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
        <p className="text-sm text-blue-300">
          <strong>How to get your token:</strong>
        </p>
        <ol className="text-sm text-blue-300 list-decimal list-inside space-y-1">
          <li>
            Go to GitHub Settings → Developer settings → Personal access tokens
          </li>
          <li>Click "Generate new token (classic)"</li>
          <li>
            Select scopes:{" "}
            <code className="bg-black/50 px-1 rounded">repo</code> and{" "}
            <code className="bg-black/50 px-1 rounded">read:repo_hook</code>
          </li>
          <li>Generate and copy the token</li>
          <li>Paste it below</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-300"
          >
            GitHub Token
          </label>
          <input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 flex gap-3">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-3 flex gap-3">
            <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-green-400">Token saved successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Connecting..." : "Connect GitHub"}
        </button>
      </form>
    </div>
  );
}
