/*
  Warnings:

  - Added the required column `emailVerified` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User"
    RENAME COLUMN "emailVerified" TO "emailVerifiedOld";
ALTER TABLE "User"
    ADD COLUMN "emailVerified" BOOLEAN;

-- set existing data
UPDATE "User"
SET "emailVerified"="emailVerifiedOld" IS NOT NULL;


ALTER TABLE "User"
    DROP COLUMN "emailVerifiedOld";
ALTER TABLE "User"
    ALTER COLUMN "emailVerified" SET NOT NULL;
