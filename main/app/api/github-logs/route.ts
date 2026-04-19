import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { repo, branch, commit, status, logs } = body;

  const repository = await prisma.repository.findFirst({
    where: { url: { contains: repo } },
  });

  if (!repository) {
    return NextResponse.json({ error: "Repo not found" }, { status: 404 });
  }

  const decodedLogs = Buffer.from(logs, "base64").toString("utf-8");

  const run = await prisma.pipelineRun.create({
    data: {
      repositoryId: repository.id,
      commitSha: commit,
      branch,
      status,
    },
  });

  await prisma.pipelineLog.create({
    data: {
      pipelineRunId: run.id,
      content: decodedLogs,
    },
  });

  return NextResponse.json({ success: true });
}
