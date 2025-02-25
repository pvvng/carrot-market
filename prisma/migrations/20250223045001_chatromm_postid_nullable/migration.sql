-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "ChatRoom_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("created_at", "id", "updated_at") SELECT "created_at", "id", "updated_at" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
CREATE TABLE "new_LiveStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "stream_key" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LiveStream" ("created_at", "id", "stream_id", "stream_key", "title", "updated_at", "userId") SELECT "created_at", "id", "stream_id", "stream_key", "title", "updated_at", "userId" FROM "LiveStream";
DROP TABLE "LiveStream";
ALTER TABLE "new_LiveStream" RENAME TO "LiveStream";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatRoomId", "created_at", "id", "payload", "updated_at", "userId") SELECT "chatRoomId", "created_at", "id", "payload", "updated_at", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_MessageRead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "read_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MessageRead" ("id", "messageId", "read_at", "userId") SELECT "id", "messageId", "read_at", "userId" FROM "MessageRead";
DROP TABLE "MessageRead";
ALTER TABLE "new_MessageRead" RENAME TO "MessageRead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
