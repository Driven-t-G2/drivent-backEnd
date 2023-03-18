/*
  Warnings:

  - You are about to drop the column `local` on the `Activities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activities" DROP COLUMN "local",
ADD COLUMN     "local_id" INTEGER;

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "Local"("id") ON DELETE SET NULL ON UPDATE CASCADE;
