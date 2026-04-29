ALTER TABLE "User"
ADD COLUMN name TEXT;

UPDATE "User"
SET name = "firstName" || ' ' || "lastName";

ALTER TABLE "User" DROP COLUMN "firstName";
ALTER TABLE "User" DROP COLUMN "lastName";

ALTER TABLE "User" ALTER COLUMN name SET NOT NULL;
