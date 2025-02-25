-- CreateTable
CREATE TABLE "Heart" (
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "productId"),
    CONSTRAINT "Heart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Heart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
