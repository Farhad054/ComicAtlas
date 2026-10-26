-- AlterTable
ALTER TABLE "User" ALTER COLUMN "spoilerModeOn" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN "statusIsSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "statusSpoilerAfterIssueId" TEXT;

-- AlterTable
ALTER TABLE "TimelineEvent" ADD COLUMN "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "spoilerAfterIssueId" TEXT;

-- AlterTable
ALTER TABLE "TeamMembership" ADD COLUMN "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "spoilerAfterIssueId" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "outcomeText" TEXT,
ADD COLUMN "outcomeSpoilerAfterIssueId" TEXT;

-- AlterTable
ALTER TABLE "ImpactEntry" ADD COLUMN "isSpoiler" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "spoilerAfterIssueId" TEXT;

-- AlterTable
ALTER TABLE "ReadingPathNode" ADD COLUMN "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "spoilerAfterIssueId" TEXT;
