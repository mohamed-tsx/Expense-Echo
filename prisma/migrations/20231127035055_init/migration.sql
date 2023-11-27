/*
  Warnings:

  - You are about to drop the `Expenses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_authorId_fkey";

-- DropTable
DROP TABLE "Expenses";
