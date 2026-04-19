import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RepositoryLogsPage({ params }: Props) {
  const resolvedParams = await params; // ✅ IMPORTANT

  console.log("params:", resolvedParams);

  const repoId = parseInt(resolvedParams.id, 10);

  if (isNaN(repoId)) {
    return <div className="p-6 text-red-400">Invalid repository ID</div>;
  }

  const repo = await prisma.repository.findUnique({
    where: { id: repoId },
    include: {
      pipelineRuns: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repo) {
    return <div className="p-6 text-red-400">Repository not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{repo.name}</h1>
        <p className="text-gray-400">{repo.url}</p>
      </div>

      <div className="space-y-4">
        {repo.pipelineRuns.length === 0 ?
          <p className="text-gray-400">No logs yet</p>
        : repo.pipelineRuns.map((run) => (
            <Link
              key={run.id}
              href={`/repositories/${repoId}/logs/${run.id}`}
              className="block border border-zinc-700 rounded-lg p-4 bg-zinc-900 hover:bg-zinc-800 transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-medium">
                    Commit: {run.commitSha?.slice(0, 7) ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">Branch: {run.branch}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    run.status === "success" ?
                      "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {run.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(run.createdAt).toLocaleString()}
              </p>
            </Link>
          ))
        }
      </div>
    </div>
  );
}
