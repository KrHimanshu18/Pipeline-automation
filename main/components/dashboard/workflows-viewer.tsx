"use client";

import {
  GitBranch,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string;
  commitSha: string;
  commitMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  htmlUrl: string;
}

interface WorkflowsViewerProps {
  repositoryId: number;
  repositoryName: string;
}

export function WorkflowsViewer({
  repositoryId,
  repositoryName,
}: WorkflowsViewerProps) {
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, [repositoryId]);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/github/workflows?repoId=${repositoryId}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch workflows");
      }

      const data = await response.json();
      setWorkflows(data.runs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, conclusion: string | null) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return <CheckCircle className="text-green-400" size={18} />;
      } else if (conclusion === "failure") {
        return <XCircle className="text-red-400" size={18} />;
      }
    }
    return <Loader className="text-yellow-400 animate-spin" size={18} />;
  };

  const getStatusColor = (status: string, conclusion: string | null) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return "bg-green-500/20 text-green-400 border-green-500/50";
      } else if (conclusion === "failure") {
        return "bg-red-500/20 text-red-400 border-red-500/50";
      }
    }
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  };

  if (error && workflows.length === 0) {
    return (
      <div className="border border-red-500/50 rounded-lg bg-red-500/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-400" size={24} />
          <div>
            <h3 className="font-semibold text-red-400">
              Error Loading Workflows
            </h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchWorkflows}
          className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <GitBranch size={22} className="text-cyan-400" />
            {repositoryName} - Workflows
          </h3>
          <p className="text-sm text-gray-400">
            View GitHub Actions logs and workflow runs
          </p>
        </div>
        <button
          onClick={fetchWorkflows}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && workflows.length === 0 ?
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
          <Loader className="h-12 w-12 text-cyan-400 mx-auto animate-spin" />
          <p className="text-gray-400">Loading workflows...</p>
        </div>
      : workflows.length > 0 ?
        <div className="space-y-3">
          {workflows.map((run) => (
            <div
              key={run.id}
              className="border border-zinc-700 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(run.status, run.conclusion)}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {run.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(run.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        run.status,
                        run.conclusion,
                      )}`}
                    >
                      {run.conclusion || run.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      Branch:{" "}
                      <span className="font-mono text-gray-300">
                        {run.branch}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      Commit:{" "}
                      <span className="font-mono text-gray-300">
                        {run.commitSha.substring(0, 7)}
                      </span>
                    </span>
                  </div>

                  {run.commitMessage && (
                    <p className="text-sm text-gray-400 mt-2 truncate">
                      {run.commitMessage}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedRun(run);
                      setShowLogs(true);
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors"
                    title="View Logs"
                  >
                    <Eye size={18} />
                  </button>
                  <a
                    href={run.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:bg-zinc-700 hover:text-cyan-400 transition-colors"
                    title="Open on GitHub"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      : <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
          <GitBranch className="h-16 w-16 text-gray-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              No workflows found
            </h3>
            <p className="text-gray-400">
              No GitHub Actions workflows have been run yet
            </p>
          </div>
        </div>
      }

      {/* Logs Modal */}
      {showLogs && selectedRun && (
        <WorkflowLogsViewer
          run={selectedRun}
          repositoryId={repositoryId}
          onClose={() => setShowLogs(false)}
        />
      )}
    </div>
  );
}

interface WorkflowLogsViewerProps {
  run: WorkflowRun;
  repositoryId: number;
  onClose: () => void;
}

function WorkflowLogsViewer({
  run,
  repositoryId,
  onClose,
}: WorkflowLogsViewerProps) {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [run.id]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/github/logs?runId=${run.id}&repoId=${repositoryId}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch logs");
      }

      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{run.name}</h3>
            <p className="text-sm text-gray-400">{run.commitMessage}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-auto bg-black rounded-lg p-4 font-mono text-sm">
          {loading ?
            <div className="flex items-center justify-center h-full">
              <Loader className="animate-spin text-cyan-400" size={24} />
            </div>
          : error ?
            <div className="text-red-400">{error}</div>
          : <pre className="text-gray-300 whitespace-pre-wrap wrap-break-words">
              {logs}
            </pre>
          }
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
