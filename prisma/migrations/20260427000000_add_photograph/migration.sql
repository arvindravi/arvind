-- CreateTable
CREATE TABLE "Photograph" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "slug" VARCHAR(96) NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "caption" VARCHAR(1024),
    "imageUrl" VARCHAR(512) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "capturedAt" TIMESTAMP(3),
    "location" VARCHAR(120),
    "camera" VARCHAR(80),
    "lens" VARCHAR(80),

    CONSTRAINT "Photograph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhotographToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Photograph_slug_key" ON "Photograph"("slug");

-- CreateIndex
CREATE INDEX "Photograph_publishedAt_idx" ON "Photograph"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_PhotographToTag_AB_unique" ON "_PhotographToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PhotographToTag_B_index" ON "_PhotographToTag"("B");

-- AddForeignKey
ALTER TABLE "_PhotographToTag" ADD CONSTRAINT "_PhotographToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Photograph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhotographToTag" ADD CONSTRAINT "_PhotographToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
