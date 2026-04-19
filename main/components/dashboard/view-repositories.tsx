"use client";

import { GitBranch, ExternalLink, Trash2, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { useRepositories } from "@/lib/contexts/repositories-context";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";

type FilterTab = "all" | "active" | "inactive";

export function ViewRepositories() {
  const { repositories, isLoading, error, refetch } = useRepositories();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return repositories.filter((repo) => {
      const status = repo.status.toLowerCase();
      if (filter === "active" && status !== "active") return false;
      if (filter === "inactive" && status !== "inactive") return false;
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.url.toLowerCase().includes(q)
      );
    });
  }, [repositories, filter, search]);

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "github":
        return "bg-gray-700";
      case "gitlab":
        return "bg-orange-600";
      case "bitbucket":
        return "bg-blue-600";
      default:
        return "bg-zinc-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "connected":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this repository from your account?")) return;
    setDeleteMessage(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/repositories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteMessage(
          typeof data.error === "string" ? data.error : "Delete failed",
        );
        return;
      }
      await refetch();
    } finally {
      setDeletingId(null);
    }
  };

  const filterBtn = (tab: FilterTab, label: string) => (
    <button
      type="button"
      onClick={() => setFilter(tab)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        filter === tab ?
          "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
        : "border border-zinc-700 text-gray-300 hover:bg-zinc-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">My Repositories</h2>
        <p className="text-gray-400">
          Manage all your connected repositories and pipelines
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {deleteMessage && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
          {deleteMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filterBtn("all", "All")}
          {filterBtn("active", "Active")}
          {filterBtn("inactive", "Inactive")}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full md:max-w-xs px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {isLoading ?
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center text-gray-400">
          Loading repositories…
        </div>
      : filtered.length > 0 ?
        <div className="space-y-4">
          {filtered.map((repo) => {
            const statusLabel =
              repo.status.charAt(0).toUpperCase() + repo.status.slice(1);
            return (
              <div
                key={repo.id}
                className="border border-zinc-700 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${getProviderColor(repo.provider)} flex items-center justify-center shrink-0`}
                      >
                        <GitBranch className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {repo.name}
                        </h3>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors truncate block"
                        >
                          {repo.url}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(repo.status)}`}
                      >
                        {statusLabel}
                      </span>
                      <span className="text-xs text-gray-400">
                        Branch:{" "}
                        <span className="font-mono text-gray-300">
                          {repo.branch}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        Updated {formatRelativeTime(repo.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      type="button"
                      disabled
                      className="p-2 rounded-lg text-gray-500 cursor-not-allowed opacity-50"
                      title="Coming soon"
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === repo.id}
                      onClick={() => void handleDelete(repo.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      : repositories.length === 0 ?
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
          <GitBranch className="h-16 w-16 text-gray-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              No repositories yet
            </h3>
            <p className="text-gray-400">
              Get started by adding your first repository
            </p>
          </div>
        </div>
      : <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
          <GitBranch className="h-16 w-16 text-gray-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white">No matches</h3>
            <p className="text-gray-400">Try a different search or filter</p>
          </div>
        </div>
      }
    </div>
  );
}
