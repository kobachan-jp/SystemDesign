-- CreateTable
CREATE TABLE "Museum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "officialUrl" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "officialUrl" TEXT NOT NULL,
    "description" TEXT,
    "museumId" INTEGER NOT NULL,
    CONSTRAINT "Exhibition_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "Museum" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
