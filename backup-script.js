const { PrismaClient } = require('@prisma/client');
const { writeFileSync } = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting backup...');
  
  try {
    const data = {
      users: await prisma.user.findMany(),
      bookmarks: await prisma.bookmark.findMany(),
      questions: await prisma.question.findMany(),
      comments: await prisma.comment.findMany(),
      audio: await prisma.audio.findMany(),
      posts: await prisma.post.findMany(),
      postEdits: await prisma.postEdit.findMany(),
      tags: await prisma.tag.findMany(),
      stacks: await prisma.stack.findMany(),
      reactions: await prisma.reaction.findMany(),
      emailSubscriptions: await prisma.emailSubscription.findMany(),
    };

    writeFileSync('backup.json', JSON.stringify(data, null, 2));
    console.log('Backup completed successfully!');
  } catch (error) {
    console.error('Error during backup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
