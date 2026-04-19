import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWorkflowRuns, getRepositoryInfo } from "@/lib/utils/github";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;
    const repoId = request.nextUrl.searchParams.get("repoId");

    if (!userId || !repoId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // Get user and repository
    const [user, repository] = await Promise.all([
      prisma.user.findUnique({ where: { id: parseInt(userId) } }),
      prisma.repository.findUnique({
        where: { id: parseInt(repoId) },
      }),
    ]);

    if (!user || !repository) {
      return NextResponse.json(
        { error: "User or repository not found" },
        { status: 404 },
      );
    }

    if (!user.githubToken) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 400 },
      );
    }

    // Extract owner and repo from URL
    // URL format: https://github.com/owner/repo
    const urlParts = repository.url
      .replace("https://github.com/", "")
      .split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Invalid repository URL" },
        { status: 400 },
      );
    }

    // Fetch workflow runs
    const runs = await getWorkflowRuns(user.githubToken, owner, repo, 20);

    // Store runs in database
    for (const run of runs) {
      await prisma.workflowRun.upsert({
        where: { githubRunId: run.id },
        create: {
          githubRunId: run.id,
          repositoryId: repository.id,
          userId: user.id,
          workflowName: run.workflowName,
          workflowFile: "",
          name: run.name,
          status: run.status,
          conclusion: run.conclusion,
          branch: run.branch,
          commitSha: run.commitSha || "",
          commitMessage: run.commitMessage,
          createdAt: run.createdAt,
          updatedAt: run.updatedAt,
          completedAt: run.completedAt,
        },
        update: {
          status: run.status,
          conclusion: run.conclusion,
          updatedAt: run.updatedAt,
          completedAt: run.completedAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      runs: runs.map((run) => ({
        id: run.id,
        name: run.name,
        workflowName: run.workflowName,
        status: run.status,
        conclusion: run.conclusion,
        branch: run.branch,
        commitSha: run.commitSha,
        commitMessage: run.commitMessage,
        createdAt: run.createdAt,
        completedAt: run.completedAt,
        htmlUrl: run.htmlUrl,
      })),
    });
  } catch (error) {
    console.error("Workflow runs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow runs" },
      { status: 500 },
    );
  }
}
