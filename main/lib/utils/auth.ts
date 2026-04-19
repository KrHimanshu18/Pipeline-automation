import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AUTH_USER_ID_COOKIE } from "@/lib/constants/auth";
import { userPublicSelect } from "@/lib/prisma/user-public-select";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(AUTH_USER_ID_COOKIE)?.value;

  if (!userId?.trim()) {
    return null;
  }

  const id = parseInt(userId, 10);
  if (Number.isNaN(id)) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    return user;
  } catch {
    return null;
  }
}
