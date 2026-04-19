import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { userPublicSelect } from "@/lib/prisma/user-public-select";

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      location,
      company,
      bio,
      notifyPipelineFailures,
      notifyDeploymentUpdates,
      notifyWeeklyDigest,
    } = body as Record<string, unknown>;

    const data: Record<string, unknown> = {};

    if (fullName !== undefined) {
      if (fullName === null) {
        data.fullName = null;
      } else if (typeof fullName === "string") {
        data.fullName = fullName.trim() === "" ? null : fullName.trim();
      } else {
        return NextResponse.json({ error: "Invalid fullName" }, { status: 400 });
      }
    }
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      const nextEmail = email.trim().toLowerCase();
      if (nextEmail !== sessionUser.email) {
        const taken = await prisma.user.findFirst({
          where: { email: nextEmail, NOT: { id: sessionUser.id } },
        });
        if (taken) {
          return NextResponse.json(
            { error: "Email is already in use" },
            { status: 400 },
          );
        }
      }
      data.email = nextEmail;
    }
    if (phone !== undefined) {
      if (phone === null) data.phone = null;
      else if (typeof phone === "string")
        data.phone = phone.trim() === "" ? null : phone.trim();
      else
        return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (location !== undefined) {
      if (location === null) data.location = null;
      else if (typeof location === "string")
        data.location = location.trim() === "" ? null : location.trim();
      else
        return NextResponse.json(
          { error: "Invalid location" },
          { status: 400 },
        );
    }
    if (company !== undefined) {
      if (company === null) data.company = null;
      else if (typeof company === "string")
        data.company = company.trim() === "" ? null : company.trim();
      else
        return NextResponse.json(
          { error: "Invalid company" },
          { status: 400 },
        );
    }
    if (bio !== undefined) {
      if (bio === null) data.bio = null;
      else if (typeof bio === "string")
        data.bio = bio.trim() === "" ? null : bio.trim();
      else
        return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
    }
    if (typeof notifyPipelineFailures === "boolean") {
      data.notifyPipelineFailures = notifyPipelineFailures;
    }
    if (typeof notifyDeploymentUpdates === "boolean") {
      data.notifyDeploymentUpdates = notifyDeploymentUpdates;
    }
    if (typeof notifyWeeklyDigest === "boolean") {
      data.notifyWeeklyDigest = notifyWeeklyDigest;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: sessionUser.id },
      data: data as Prisma.UserUpdateInput,
      select: userPublicSelect,
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
