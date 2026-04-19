import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { inferRepoProviderFromUrl } from "@/lib/utils/infer-repo-provider";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const repositories = await prisma.repository.findMany({
      where: { userId: sessionUser.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ repositories }, { status: 200 });
  } catch (error) {
    console.error("List repositories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, branch, description, provider } = body as Record<
      string,
      unknown
    >;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 },
      );
    }
    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 },
      );
    }

    let normalizedUrl: string;
    try {
      normalizedUrl = new URL(url.trim()).toString();
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const branchStr =
      typeof branch === "string" && branch.trim() ? branch.trim() : "main";

    const providerStr =
      typeof provider === "string" && provider.trim() ?
        provider.trim().toLowerCase()
      : inferRepoProviderFromUrl(normalizedUrl);

    const descriptionStr =
      typeof description === "string" && description.trim() ?
        description.trim()
      : null;

    const repository = await prisma.repository.create({
      data: {
        name: name.trim(),
        url: normalizedUrl,
        branch: branchStr,
        provider: providerStr,
        description: descriptionStr,
        userId: sessionUser.id,
      },
    });

    return NextResponse.json({ repository }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This repository URL is already connected to your account" },
        { status: 409 },
      );
    }
    console.error("Create repository error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
