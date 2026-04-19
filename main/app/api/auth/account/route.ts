import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { AUTH_USER_ID_COOKIE } from "@/lib/constants/auth";

export async function DELETE(_request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.user.delete({ where: { id: sessionUser.id } });

    const response = NextResponse.json(
      { success: true, message: "Account deleted" },
      { status: 200 },
    );
    response.cookies.set(AUTH_USER_ID_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
