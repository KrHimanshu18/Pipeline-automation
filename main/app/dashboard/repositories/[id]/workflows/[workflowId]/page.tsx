"use client";

import {
  ArrowLeft,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRepositories } from "@/lib/contexts/repositories-context";

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

export default function WorkflowPage() {
  const router = useRouter();
  const params = useParams();
  const { repositories } = useRepositories();

  const repoId = parseInt(params.id as string, 10);
  const workflowId = parseInt(params.workflowId as string, 10);
  const repository = repositories.find((r) => r.id === repoId);

  const [workflow, setWorkflow] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState("");
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (repository) {
      fetchWorkflow();
    }
  }, [repository, workflowId]);

  const fetchWorkflow = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/github/workflows?repoId=${repoId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch workflows");
      }

      const data = await response.json();
      const foundWorkflow = data.runs?.find(
        (run: WorkflowRun) => run.id === workflowId,
      );

      if (!foundWorkflow) {
        throw new Error("Workflow not found");
      }

      setWorkflow(foundWorkflow);

      // Automatically fetch logs for AI analysis
      fetchLogsForAnalysis(foundWorkflow.id, foundWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogsForAnalysis = async (
    workflowId: number,
    workflowData: WorkflowRun,
  ) => {
    console.log(
      "[Client] Fetching logs for AI analysis, workflowId:",
      workflowId,
    );
    try {
      const response = await fetch(
        `/api/github/logs?runId=${workflowId}&repoId=${repoId}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch logs");
      }

      const data = await response.json();
      console.log("[Client] Logs fetched, length:", data.logs?.length || 0);

      // Analyze logs with AI
      console.log("[Client] Calling analyzeLogsWithAI");
      await analyzeLogsWithAI(data.logs, workflowData);
    } catch (err) {
      console.error("[Client] Failed to fetch logs for analysis:", err);
      // Don't show error to user, just skip AI analysis
    }
  };

  const fetchLogs = async () => {
    if (!workflow) return;

    setLogsLoading(true);
    setLogsError("");

    try {
      const response = await fetch(
        `/api/github/logs?runId=${workflow.id}&repoId=${repoId}`,
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
      setShowLogs(true);

      // Only analyze if not already analyzed
      if (!aiAnalysis && !aiLoading) {
        analyzeLogsWithAI(data.logs);
      }
    } catch (err) {
      setLogsError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLogsLoading(false);
    }
  };

  const analyzeLogsWithAI = async (
    logsContent: string,
    workflowData?: WorkflowRun,
  ) => {
    const workflowToAnalyze = workflowData || workflow;

    if (!workflowToAnalyze) {
      console.log("[Client] analyzeLogsWithAI: workflow is null, returning");
      return;
    }

    console.log(
      "[Client] Starting AI analysis for workflow:",
      workflowToAnalyze.id,
      "conclusion:",
      workflowToAnalyze.conclusion,
    );
    console.log("[Client] Logs content length:", logsContent?.length || 0);
    setAiLoading(true);
    setAiError("");

    try {
      console.log("[Client] Sending request to /api/ai/analyze");
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logs: logsContent,
          conclusion: workflowToAnalyze.conclusion,
        }),
      });

      console.log("[Client] Response status:", response.status);
      console.log("[Client] Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Client] Response error text:", errorText);
        console.error("[Client] Response status:", response.status);

        // Handle quota exceeded (429) specifically
        if (response.status === 429) {
          throw new Error("AI_QUOTA_EXCEEDED");
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("[Client] AI analysis response received");
      console.log("[Client] Response data keys:", Object.keys(data));
      console.log("[Client] Analysis length:", data.analysis?.length || 0);
      console.log("[Client] Analysis content:", data.analysis);
      setAiAnalysis(data.analysis);
      console.log("[Client] AI analysis state updated");
    } catch (err) {
      console.error("[Client] AI analysis error occurred");
      console.error("[Client] Error object:", err);
      console.error("[Client] Error type:", typeof err);

      let errorMessage = "Failed to analyze logs with AI";

      if (err instanceof Error) {
        console.error("[Client] Error message:", err.message);
        console.error("[Client] Error stack:", err.stack);

        // Handle quota exceeded error
        if (err.message === "AI_QUOTA_EXCEEDED") {
          errorMessage = "AI analysis quota exceeded. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      } else if (typeof err === "object" && err !== null) {
        console.error("[Client] Error properties:", Object.keys(err));
      }

      setAiError(errorMessage);
    } finally {
      console.log("[Client] AI analysis complete, setting loading to false");
      setAiLoading(false);
    }
  };

  const getStatusIcon = (status: string, conclusion: string | null) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return <CheckCircle className="text-green-400" size={24} />;
      } else if (conclusion === "failure") {
        return <XCircle className="text-red-400" size={24} />;
      }
    }
    return <Loader className="text-yellow-400 animate-spin" size={24} />;
  };

  const getStatusMessage = (status: string, conclusion: string | null) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return {
          title: "Workflow completed successfully",
          message: "All steps in the workflow ran without errors.",
          color: "text-green-400",
          bgColor: "bg-green-500/10 border-green-500/50",
        };
      } else if (conclusion === "failure") {
        return {
          title: "Workflow failed",
          message: "One or more steps in the workflow encountered errors.",
          color: "text-red-400",
          bgColor: "bg-red-500/10 border-red-500/50",
        };
      }
    }
    return {
      title: "Workflow in progress",
      message: "The workflow is currently running.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/50",
    };
  };

  if (!repository) {
    return (
      <div className="min-h-screen bg-black p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="text-center space-y-4 mt-12">
          <h1 className="text-2xl font-bold text-white">
            Repository not found
          </h1>
          <p className="text-gray-400">
            The requested repository could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Repository
          </button>
          <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center space-y-4">
            <Loader className="h-12 w-12 text-cyan-400 mx-auto animate-spin" />
            <p className="text-gray-400">Loading workflow...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Repository
          </button>
          <div className="border border-red-500/50 rounded-lg bg-red-500/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-400" size={24} />
              <div>
                <h3 className="font-semibold text-red-400">
                  Error Loading Workflow
                </h3>
                <p className="text-sm text-red-300">
                  {error || "Workflow not found"}
                </p>
              </div>
            </div>
            <button
              onClick={fetchWorkflow}
              className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(workflow.status, workflow.conclusion);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Repository
        </button>

        {/* Header */}
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {getStatusIcon(workflow.status, workflow.conclusion)}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {workflow.name}
                </h1>
                <p className="text-gray-400">{repository.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchLogs}
                disabled={logsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="View Logs"
              >
                <Eye size={16} />
                {logsLoading ? "Loading..." : "View Logs"}
              </button>
              <a
                href={workflow.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-gray-300 hover:bg-zinc-700 transition-colors"
                title="Open on GitHub"
              >
                <ExternalLink size={16} />
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Branch:</span>
              <span className="ml-2 font-mono text-gray-300">
                {workflow.branch}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Commit:</span>
              <span className="ml-2 font-mono text-gray-300">
                {workflow.commitSha?.substring(0, 7) ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Started:</span>
              <span className="ml-2 text-gray-300">
                {new Date(workflow.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Completed:</span>
              <span className="ml-2 text-gray-300">
                {workflow.completedAt ?
                  new Date(workflow.completedAt).toLocaleString()
                : "In progress"}
              </span>
            </div>
          </div>

          {workflow.commitMessage && (
            <div className="mt-4">
              <span className="text-gray-400">Commit Message:</span>
              <p className="mt-1 text-gray-300">{workflow.commitMessage}</p>
            </div>
          )}
        </div>

        {/* Main Status Area */}
        <div className={`border rounded-lg p-6 ${statusInfo.bgColor}`}>
          <div className="flex items-center gap-3 mb-3">
            {getStatusIcon(workflow.status, workflow.conclusion)}
            <h2 className={`text-xl font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h2>
          </div>

          {aiLoading ?
            <div className="flex items-center gap-3 text-gray-300">
              <Loader className="animate-spin" size={16} />
              <span>Analyzing logs with AI...</span>
            </div>
          : aiError ?
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg ${aiError.includes("quota") ? "bg-yellow-500/10 border border-yellow-500/50" : "bg-red-500/10 border border-red-500/50"}`}
              >
                <p
                  className={`text-sm font-medium ${aiError.includes("quota") ? "text-yellow-400" : "text-red-400"}`}
                >
                  {aiError.includes("quota") ?
                    "⚠️ AI Analysis Temporarily Unavailable"
                  : "❌ AI Analysis Failed"}
                </p>
                <p
                  className={`text-sm mt-1 ${aiError.includes("quota") ? "text-yellow-300" : "text-red-300"}`}
                >
                  {aiError}
                </p>
              </div>
              <p className="text-gray-300 text-sm">{statusInfo.message}</p>
            </div>
          : aiAnalysis ?
            <div className="space-y-3">
              <div className="border-b border-zinc-600 pb-3">
                <h3 className="font-medium text-gray-200 mb-2">AI Analysis</h3>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p>Analysis generated by Gemini AI based on workflow logs.</p>
              </div>
            </div>
          : <p className="text-gray-300">{statusInfo.message}</p>}
        </div>

        {/* Logs Modal */}
        {showLogs && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col space-y-4 p-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Workflow Logs
                  </h3>
                  <p className="text-sm text-gray-400">{workflow.name}</p>
                </div>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-auto bg-black rounded-lg p-4 font-mono text-sm">
                {logsLoading ?
                  <div className="flex items-center justify-center h-full">
                    <Loader className="animate-spin text-cyan-400" size={24} />
                  </div>
                : logsError ?
                  <div className="text-red-400">{logsError}</div>
                : <pre className="text-gray-300 whitespace-pre-wrap">
                    {logs}
                  </pre>
                }
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowLogs(false)}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
