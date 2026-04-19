import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWorkflowRunLogs } from "@/lib/utils/github";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;
    const runId = request.nextUrl.searchParams.get("runId");
    const repoId = request.nextUrl.searchParams.get("repoId");

    if (!userId || !runId || !repoId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user || !user.githubToken) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 400 },
      );
    }

    const repository = await prisma.repository.findUnique({
      where: { id: parseInt(repoId) },
    });

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    // Extract owner and repo from URL
    const urlParts = repository.url
      .replace("https://github.com/", "")
      .split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch logs
    const logs = await getWorkflowRunLogs(
      user.githubToken,
      owner,
      repo,
      parseInt(runId),
    );

    // Store logs in database
    if (logs) {
      await prisma.workflowRun.update({
        where: { githubRunId: parseInt(runId) },
        data: {
          logs,
          logsFetched: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      logs: logs || "No logs available",
    });
  } catch (error) {
    console.error("Workflow logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow logs" },
      { status: 500 },
    );
  }
}
