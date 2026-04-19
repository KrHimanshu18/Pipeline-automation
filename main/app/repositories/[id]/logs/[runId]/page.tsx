import { prisma } from "@/lib/prisma";

interface Props {
  params: { id: string; runId: string };
}

export default async function LogDetailPage({ params }: Props) {
  const runId = Number(params.runId);

  const run = await prisma.pipelineRun.findUnique({
    where: { id: runId },
    include: {
      logs: {
        orderBy: { chunkIndex: "asc" },
      },
    },
  });

  if (!run) {
    return <div className="p-6 text-red-400">Log not found</div>;
  }

  const fullLogs = run.logs.map((l) => l.content).join("\n");

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">
          Logs - {run.commitSha.slice(0, 7)}
        </h1>
        <p className="text-gray-400">
          Status: {run.status} | Branch: {run.branch}
        </p>
      </div>

      <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
        {fullLogs}
      </pre>
    </div>
  );
}
