-- CreateEnum
CREATE TYPE "EmailSubscription_type" AS ENUM ('HACKER_NEWS');

-- CreateEnum
CREATE TYPE "User_role" AS ENUM ('BLOCKED', 'USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "User_role" NOT NULL DEFAULT E'USER',
    "username" VARCHAR(16) NOT NULL,
    "twitterId" VARCHAR(191) NOT NULL,
    "email" VARCHAR(191),
    "pendingEmail" VARCHAR(191),
    "avatar" VARCHAR(191),
    "description" VARCHAR(256),
    "location" VARCHAR(32),
    "name" VARCHAR(191),
    "nickname" VARCHAR(191),

    CONSTRAINT "idx_24641_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "host" VARCHAR(191),
    "title" VARCHAR(280),
    "image" VARCHAR(512),
    "description" VARCHAR(2048),
    "twitterHandle" VARCHAR(191),
    "faviconUrl" VARCHAR(191),

    CONSTRAINT "idx_24593_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024),
    "userId" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_24620_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "text" TEXT NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "bookmarkId" VARCHAR(191),
    "questionId" VARCHAR(191),
    "postId" VARCHAR(191),
    "stackId" VARCHAR(191),

    CONSTRAINT "idx_24599_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "plays" INTEGER NOT NULL,
    "waveform" JSON NOT NULL,
    "url" VARCHAR(191) NOT NULL,
    "transcription" VARCHAR(191) NOT NULL,
    "commentId" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_24587_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "publishedAt" TIMESTAMPTZ(6),
    "slug" VARCHAR(191) NOT NULL,
    "title" VARCHAR(280) NOT NULL,
    "text" TEXT NOT NULL,
    "excerpt" VARCHAR(280) NOT NULL,
    "featureImage" VARCHAR(191),
    "userId" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_24608_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEdit" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "title" VARCHAR(280) NOT NULL,
    "excerpt" VARCHAR(280) NOT NULL,
    "featureImage" VARCHAR(191),
    "postId" VARCHAR(191),

    CONSTRAINT "idx_24614_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_24638_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stack" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "slug" VARCHAR(191),
    "description" VARCHAR(280) NOT NULL,
    "image" VARCHAR(191) NOT NULL,
    "url" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_24632_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR(191) NOT NULL,
    "commentId" VARCHAR(191),
    "bookmarkId" VARCHAR(191),
    "questionId" VARCHAR(191),
    "postId" VARCHAR(191),
    "stackId" VARCHAR(191),

    CONSTRAINT "idx_24626_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "email" VARCHAR(191) NOT NULL,
    "type" "EmailSubscription_type" NOT NULL
);

-- CreateTable
CREATE TABLE "_BookmarkToTag" (
    "A" VARCHAR(191) NOT NULL,
    "B" VARCHAR(191) NOT NULL
);

-- CreateTable
CREATE TABLE "_StackToTag" (
    "A" VARCHAR(191) NOT NULL,
    "B" VARCHAR(191) NOT NULL
);

-- CreateTable
CREATE TABLE "_StackToUser" (
    "A" VARCHAR(191) NOT NULL,
    "B" VARCHAR(191) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "idx_24641_User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24641_User_twitterId_key" ON "User"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24641_User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24593_Bookmark_url_key" ON "Bookmark"("url");

-- CreateIndex
CREATE INDEX "idx_24593_Bookmark_host_idx" ON "Bookmark"("host");

-- CreateIndex
CREATE INDEX "idx_24599_Comment_bookmarkId_idx" ON "Comment"("bookmarkId");

-- CreateIndex
CREATE INDEX "idx_24599_Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "idx_24599_Comment_questionId_idx" ON "Comment"("questionId");

-- CreateIndex
CREATE INDEX "idx_24599_Comment_stackId_idx" ON "Comment"("stackId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24587_Audio_commentId_key" ON "Audio"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24608_Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "idx_24608_Post_publishedAt_idx" ON "Post"("publishedAt");

-- CreateIndex
CREATE INDEX "idx_24614_PostEdit_postId_idx" ON "PostEdit"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24638_Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24632_Stack_slug_key" ON "Stack"("slug");

-- CreateIndex
CREATE INDEX "idx_24626_Reaction_bookmarkId_idx" ON "Reaction"("bookmarkId");

-- CreateIndex
CREATE INDEX "idx_24626_Reaction_commentId_idx" ON "Reaction"("commentId");

-- CreateIndex
CREATE INDEX "idx_24626_Reaction_postId_idx" ON "Reaction"("postId");

-- CreateIndex
CREATE INDEX "idx_24626_Reaction_questionId_idx" ON "Reaction"("questionId");

-- CreateIndex
CREATE INDEX "idx_24626_Reaction_stackId_idx" ON "Reaction"("stackId");

-- CreateIndex
CREATE INDEX "idx_24605_EmailSubscription_email_idx" ON "EmailSubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "idx_24605_EmailSubscription_email_type_key" ON "EmailSubscription"("email", "type");

-- CreateIndex
CREATE UNIQUE INDEX "_BookmarkToTag_AB_unique" ON "_BookmarkToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BookmarkToTag_B_index" ON "_BookmarkToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StackToTag_AB_unique" ON "_StackToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StackToTag_B_index" ON "_StackToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StackToUser_AB_unique" ON "_StackToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StackToUser_B_index" ON "_StackToUser"("B");


