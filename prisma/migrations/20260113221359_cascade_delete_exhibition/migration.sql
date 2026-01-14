-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exhibition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "officialUrl" TEXT NOT NULL,
    "description" TEXT,
    "museumId" INTEGER NOT NULL,
    CONSTRAINT "Exhibition_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "Museum" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exhibition" ("description", "endDate", "id", "museumId", "officialUrl", "startDate", "title") SELECT "description", "endDate", "id", "museumId", "officialUrl", "startDate", "title" FROM "Exhibition";
DROP TABLE "Exhibition";
ALTER TABLE "new_Exhibition" RENAME TO "Exhibition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
