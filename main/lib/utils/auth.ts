import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        profileImage: true,
        phone: true,
        location: true,
        company: true,
        bio: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(userId: number) {
  const cookieStore = cookies();
  // Since cookies() returns a Promise in async context, we need to handle this properly
  return { userId: userId.toString() };
}
