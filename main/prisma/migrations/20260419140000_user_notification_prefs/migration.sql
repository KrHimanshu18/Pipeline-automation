-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyPipelineFailures" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDeploymentUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyWeeklyDigest" BOOLEAN NOT NULL DEFAULT false;
