-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "jobType" TEXT;

-- CreateTable
CREATE TABLE "AnonUsage" (
    "ip" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonUsage_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE INDEX "AnonUsage_resetAt_idx" ON "AnonUsage"("resetAt");
