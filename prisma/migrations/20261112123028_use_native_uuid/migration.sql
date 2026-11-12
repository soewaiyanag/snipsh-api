-- Hand-edited: Prisma's version dropped and recreated the id columns, which deletes every row.
-- Casting in place keeps the data, and the primary keys survive the type change.

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- AlterTable
ALTER TABLE "Link"
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "userId" SET DATA TYPE UUID USING "userId"::uuid;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
