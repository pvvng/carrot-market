/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" INTEGER NOT NULL,
    "payload" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Review_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("created_at", "id", "payload", "productId", "rating", "updated_at") SELECT "created_at", "id", "payload", "productId", "rating", "updated_at" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
