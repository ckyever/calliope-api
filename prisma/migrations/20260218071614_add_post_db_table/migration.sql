-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "spotifyUri" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "rating" INTEGER,
    "text" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
