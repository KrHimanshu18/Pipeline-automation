"use client";

import { X, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useRepositories } from "@/lib/contexts/repositories-context";

export function AddRepository() {
  const { refetch } = useRepositories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [branch, setBranch] = useState("main");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: repoName,
          url: repoUrl,
          branch: branch.trim() || "main",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string" ? data.error : "Could not add repository",
        );
        return;
      }
      setRepoUrl("");
      setRepoName("");
      setBranch("main");
      setIsDialogOpen(false);
      await refetch();
    } catch {
      setSubmitError("Could not add repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Add Repository</h2>
        <p className="text-gray-400">
          Connect your Git repository to PipelineAI for automated CI/CD
          orchestration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="p-6 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left space-y-3 group"
        >
          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
            <X className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">GitHub Repository</h3>
            <p className="text-sm text-gray-400">Connect from GitHub</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="p-6 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left space-y-3 group"
        >
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405 3.3-1.23 1.005.315 3.3 1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.935 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">GitLab Repository</h3>
            <p className="text-sm text-gray-400">Connect from GitLab</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="p-6 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left space-y-3 group"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 10 15.5 10 14 10.67 14 11.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 10 8.5 10 7 10.67 7 11.5 7.67 13 8.5 13zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">Bitbucket Repository</h3>
            <p className="text-sm text-gray-400">Connect from Bitbucket</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="p-6 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left space-y-3 group"
        >
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <LinkIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Custom Repository</h3>
            <p className="text-sm text-gray-400">Connect via URL</p>
          </div>
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Add Repository</h3>
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSubmitError(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="repoName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Repository Name
                </label>
                <input
                  id="repoName"
                  type="text"
                  placeholder="my-awesome-repo"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="repoUrl"
                  className="block text-sm font-medium text-gray-300"
                >
                  Repository URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    id="repoUrl"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="repoBranch"
                  className="block text-sm font-medium text-gray-300"
                >
                  Default branch
                </label>
                <input
                  id="repoBranch"
                  type="text"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              {submitError && (
                <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
                  {submitError}
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-300">
                  Make sure you have admin access to the repository to enable
                  webhooks for automatic pipeline orchestration.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSubmitError(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Adding..." : "Add Repository"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
