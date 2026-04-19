import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testGitHubToken } from "@/lib/utils/github";

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { githubToken } = body;

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token is required" },
        { status: 400 },
      );
    }

    // Test the token
    const tokenTest = await testGitHubToken(githubToken);
    if (!tokenTest.valid) {
      return NextResponse.json(
        { error: "Invalid GitHub token" },
        { status: 400 },
      );
    }

    // Store the token
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { githubToken },
    });

    return NextResponse.json({
      success: true,
      message: "GitHub token saved successfully",
      githubUser: tokenTest.user,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        githubToken: user.githubToken,
      },
    });
  } catch (error) {
    console.error("GitHub token error:", error);
    return NextResponse.json(
      { error: "Failed to save GitHub token" },
      { status: 500 },
    );
  }
}
