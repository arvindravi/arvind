const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting restore process...');
  
  try {
    // Read backup file
    const backup = JSON.parse(readFileSync('backup.json', 'utf8'));
    
    // Restore data in order of dependencies
    console.log('Restoring users...');
    await prisma.user.createMany({
      data: backup.users,
      skipDuplicates: true,
    });

    console.log('Restoring tags...');
    await prisma.tag.createMany({
      data: backup.tags,
      skipDuplicates: true,
    });

    console.log('Restoring bookmarks...');
    await prisma.bookmark.createMany({
      data: backup.bookmarks,
      skipDuplicates: true,
    });

    console.log('Restoring questions...');
    await prisma.question.createMany({
      data: backup.questions,
      skipDuplicates: true,
    });

    console.log('Restoring posts...');
    await prisma.post.createMany({
      data: backup.posts,
      skipDuplicates: true,
    });

    console.log('Restoring stacks...');
    await prisma.stack.createMany({
      data: backup.stacks,
      skipDuplicates: true,
    });

    console.log('Restoring comments...');
    await prisma.comment.createMany({
      data: backup.comments,
      skipDuplicates: true,
    });

    console.log('Restoring audio...');
    await prisma.audio.createMany({
      data: backup.audio,
      skipDuplicates: true,
    });

    console.log('Restoring post edits...');
    await prisma.postEdit.createMany({
      data: backup.postEdits,
      skipDuplicates: true,
    });

    console.log('Restoring reactions...');
    await prisma.reaction.createMany({
      data: backup.reactions,
      skipDuplicates: true,
    });

    console.log('Restoring email subscriptions...');
    await prisma.emailSubscription.createMany({
      data: backup.emailSubscriptions,
      skipDuplicates: true,
    });

    console.log('Restore completed successfully!');
  } catch (error) {
    console.error('Error during restore:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the restore
main()
  .catch((error) => {
    console.error('Restore failed:', error);
    process.exit(1);
  });
