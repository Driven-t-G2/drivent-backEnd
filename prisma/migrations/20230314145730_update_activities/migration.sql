/*
  Warnings:

  - You are about to drop the column `enrollment_id` on the `Chosen_Activities` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Chosen_Activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chosen_Activities" DROP CONSTRAINT "Chosen_Activities_enrollment_id_fkey";

-- AlterTable
ALTER TABLE "Chosen_Activities" DROP COLUMN "enrollment_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chosen_Activities" ADD CONSTRAINT "Chosen_Activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
