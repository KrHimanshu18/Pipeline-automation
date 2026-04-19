import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_USER_ID_COOKIE } from "@/lib/constants/auth";
import { userPublicSelect } from "@/lib/prisma/user-public-select";

export async function GET(request: NextRequest) {
  try {
    const rawId = request.cookies.get(AUTH_USER_ID_COOKIE)?.value;

    if (!rawId?.trim()) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = parseInt(rawId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
