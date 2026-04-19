"use client";

import { GitBranch, ExternalLink, Trash2, Settings } from "lucide-react";
import { useState } from "react";

interface Repository {
  id: string;
  name: string;
  url: string;
  provider: "github" | "gitlab" | "bitbucket";
  branch: string;
  status: "connected" | "active" | "inactive";
  lastSync: string;
}

export function ViewRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: "1",
      name: "pipeline-automation",
      url: "https://github.com/username/pipeline-automation",
      provider: "github",
      branch: "main",
      status: "active",
      lastSync: "2 hours ago",
    },
    {
      id: "2",
      name: "api-server",
      url: "https://github.com/username/api-server",
      provider: "github",
      branch: "develop",
      status: "connected",
      lastSync: "1 day ago",
    },
    {
      id: "3",
      name: "frontend-app",
      url: "https://gitlab.com/username/frontend-app",
      provider: "gitlab",
      branch: "main",
      status: "active",
      lastSync: "30 minutes ago",
    },
  ]);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "github":
        return "bg-gray-700";
      case "gitlab":
        return "bg-orange-600";
      case "bitbucket":
        return "bg-blue-600";
      default:
        return "bg-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">My Repositories</h2>
        <p className="text-gray-400">
          Manage all your connected repositories and pipelines
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors">
            All
          </button>
          <button className="px-4 py-2 rounded-lg border border-zinc-700 text-gray-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Active
          </button>
          <button className="px-4 py-2 rounded-lg border border-zinc-700 text-gray-300 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Inactive
          </button>
        </div>
        <input
          type="text"
          placeholder="Search repositories..."
          className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Repositories List */}
      {repositories.length > 0 ?
        <div className="space-y-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="border border-zinc-700 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all p-6"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg ${getProviderColor(repo.provider)} flex items-center justify-center flex-shrink-0`}
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
                      {repo.status.charAt(0).toUpperCase() +
                        repo.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Branch:{" "}
                      <span className="font-mono text-gray-300">
                        {repo.branch}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      Last sync: {repo.lastSync}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:bg-zinc-700 hover:text-blue-400 transition-colors"
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      : <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
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
      }
    </div>
  );
}
