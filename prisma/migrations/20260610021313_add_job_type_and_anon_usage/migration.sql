/*
  Warnings:

  - You are about to drop the `ResumeAnalysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResumeAnalysis" DROP CONSTRAINT "ResumeAnalysis_userId_fkey";

-- DropTable
DROP TABLE "ResumeAnalysis";

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "originalResume" JSONB NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "jobType" TEXT,
    "atsBefore" INTEGER NOT NULL,
    "atsAfter" INTEGER NOT NULL,
    "atsBreakdown" JSONB,
    "optimizedResume" JSONB NOT NULL,
    "coverLetter" TEXT,
    "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "changesMade" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "Resume_createdAt_idx" ON "Resume"("createdAt");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
