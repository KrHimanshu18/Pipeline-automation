import type { Prisma } from "../../generated/prisma/client";

/** Fields exposed to the client (no password). */
export const userPublicSelect = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  profileImage: true,
  phone: true,
  location: true,
  company: true,
  bio: true,
  createdAt: true,
  notifyPipelineFailures: true,
  notifyDeploymentUpdates: true,
  notifyWeeklyDigest: true,
} satisfies Prisma.UserSelect;
