/**
 * In-memory fixture data for the mock Prisma client (MOCK_DB=true).
 *
 * Shapes mirror prisma/schema.prisma. Dates are relative to "now" so
 * ordering/pagination behave like a real, recently-used database.
 */

const now = Date.now()
const daysAgo = (n: number) => new Date(now - n * 86_400_000)

export const db = {
  user: [
    {
      id: 'usr_arvind',
      createdAt: daysAgo(400),
      role: 'ADMIN',
      username: 'arvind',
      twitterId: 'mock-twitter-sub',
      email: 'arvind@example.com',
      pendingEmail: null,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256',
      description:
        'Software engineer. I write about code, design, and the open web.',
      location: 'London',
      name: 'Arvind Ravi',
      nickname: 'arvind',
    },
  ],

  post: [
    {
      id: 'post_ssr_500s',
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12),
      publishedAt: daysAgo(12),
      slug: 'fixing-ssr-500s-with-prism',
      title: 'Fixing SSR 500s with Prism',
      text: [
        '## The bug',
        '',
        'Every article page was returning a 500 on the server. The stack',
        'trace pointed at Prism: `Cannot use import statement outside a module`.',
        '',
        '## The fix',
        '',
        'Prism language builds ship as CJS. Under Next.js SSR the dynamic',
        'import resolved to the ESM wrapper, which Node refused to load.',
        'Importing the CJS builds directly fixed it.',
      ].join('\n'),
      excerpt:
        'How a CJS/ESM mismatch in Prism language builds turned every article into a 500 — and the one-line fix.',
      featureImage:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
      userId: 'usr_arvind',
    },
    {
      id: 'post_isr_practice',
      createdAt: daysAgo(40),
      updatedAt: daysAgo(40),
      publishedAt: daysAgo(40),
      slug: 'isr-in-practice',
      title: 'ISR in Practice',
      text: [
        '## Why ISR',
        '',
        'Static generation at build time is fast but stale. Full SSR is',
        'fresh but slow. ISR sits in the middle: render once, serve from',
        'cache, regenerate in the background.',
        '',
        '## What we changed',
        '',
        'Converted the public pages to ISR with a 60s revalidate and an',
        'in-process SchemaLink. TTFP dropped without giving up freshness.',
      ].join('\n'),
      excerpt:
        'Converting public pages to ISR with a 60s revalidate — what worked, what broke, and the TTFP numbers.',
      featureImage:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
      userId: 'usr_arvind',
    },
    {
      id: 'post_designing_for_density',
      createdAt: daysAgo(90),
      updatedAt: daysAgo(90),
      publishedAt: daysAgo(90),
      slug: 'designing-for-density',
      title: 'Designing for Density',
      text: [
        '## The problem',
        '',
        'Most personal sites are designed for one reader at a time. Yours',
        'should be designed for the reader who comes back every week.',
        '',
        '## Density is a feature',
        '',
        'Tight type, clear hierarchy, no decorative waste. Every pixel',
        'earns its place or gets cut.',
      ].join('\n'),
      excerpt:
        'Why your personal site should be designed for the reader who comes back every week, not the one who stumbles in once.',
      featureImage:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
      userId: 'usr_arvind',
    },
    {
      id: 'post_draft',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
      publishedAt: null,
      slug: 'draft-mock-post',
      title: 'Untitled Draft (mock)',
      text: 'This is a draft. Only admins should see it.',
      excerpt: 'A draft post used to verify admin filtering in mock mode.',
      featureImage: null,
      userId: 'usr_arvind',
    },
  ],

  postEdit: [],

  tag: [
    { id: 'tag_engineering', name: 'engineering' },
    { id: 'tag_web', name: 'web' },
    { id: 'tag_design', name: 'design' },
    { id: 'tag_photography', name: 'photography' },
  ],

  photograph: [
    {
      id: 'phog_london_rain',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(30),
      publishedAt: daysAgo(30),
      slug: 'london-rain',
      title: 'London Rain',
      caption: 'Evening drizzle over the city.',
      imageUrl:
        'https://scxzlme4vlwjvlsa.public.blob.vercel-storage.com/IMG_0759.png',
      width: 1600,
      height: 1067,
      capturedAt: daysAgo(31),
      location: 'London, UK',
      camera: 'Sony A7 IV',
      lens: '24-70mm f/2.8 GM',
    },
    {
      id: 'phog_menlo_fog',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(60),
      publishedAt: daysAgo(60),
      slug: 'menlo-fog',
      title: 'Menlo Fog',
      caption: null,
      imageUrl:
        'https://scxzlme4vlwjvlsa.public.blob.vercel-storage.com/IMG_0836.png',
      width: 1600,
      height: 1067,
      capturedAt: daysAgo(61),
      location: 'Menlo Park, CA',
      camera: 'Fujifilm X-T5',
      lens: '35mm f/1.4',
    },
    {
      id: 'phog_alps_light',
      createdAt: daysAgo(120),
      updatedAt: daysAgo(120),
      publishedAt: daysAgo(120),
      slug: 'alps-first-light',
      title: 'First Light, Alps',
      caption: '6:12am. Worth the alarm.',
      imageUrl:
        'https://scxzlme4vlwjvlsa.public.blob.vercel-storage.com/IMG_4344.jpg',
      width: 1600,
      height: 1067,
      capturedAt: daysAgo(121),
      location: 'Chamonix, FR',
      camera: 'Sony A7 IV',
      lens: '70-200mm f/2.8 GM',
    },
  ],

  bookmark: [
    {
      id: 'bm_ssr_patterns',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(20),
      url: 'https://example.com/ssr-rendering-patterns',
      host: 'example.com',
      title: 'SSR Rendering Patterns',
      image: 'https://picsum.photos/seed/bm1/640/360',
      description:
        'A survey of server-side rendering patterns and when to reach for each one.',
      twitterHandle: 'exampledev',
      faviconUrl: 'https://picsum.photos/seed/fav1/32/32',
    },
    {
      id: 'bm_typography_web',
      createdAt: daysAgo(55),
      updatedAt: daysAgo(55),
      url: 'https://example.com/typography-on-the-web',
      host: 'example.com',
      title: 'Typography on the Web',
      image: 'https://picsum.photos/seed/bm2/640/360',
      description:
        'Fluid type scales, optical sizing, and the case for system fonts.',
      twitterHandle: 'typography',
      faviconUrl: 'https://picsum.photos/seed/fav2/32/32',
    },
  ],

  stack: [
    {
      id: 'stack_nextjs',
      createdAt: daysAgo(80),
      updatedAt: daysAgo(80),
      name: 'Next.js 14',
      slug: 'nextjs-14',
      description:
        'The stack behind this site: Next.js 14, Prisma, and GraphQL.',
      image: 'https://picsum.photos/seed/stack1/1200/630',
      url: 'https://nextjs.org',
    },
  ],

  question: [
    {
      id: 'q_mock',
      createdAt: daysAgo(15),
      updatedAt: daysAgo(15),
      title: 'How do you handle auth on static pages?',
      description: 'Curious how others keep ISR pages fast with per-user data.',
      userId: 'usr_arvind',
    },
  ],

  comment: [
    {
      id: 'cmt_1',
      createdAt: daysAgo(11),
      updatedAt: daysAgo(11),
      text: 'The CJS/ESM one got me too. Great writeup.',
      userId: 'usr_arvind',
      bookmarkId: null,
      questionId: null,
      postId: 'post_ssr_500s',
      stackId: null,
    },
    {
      id: 'cmt_2',
      createdAt: daysAgo(39),
      updatedAt: daysAgo(39),
      text: '60s revalidate is a sweet spot for a personal site.',
      userId: 'usr_arvind',
      bookmarkId: null,
      questionId: null,
      postId: 'post_isr_practice',
      stackId: null,
    },
  ],

  audio: [],

  reaction: [
    {
      id: 'react_1',
      createdAt: daysAgo(10),
      userId: 'usr_arvind',
      commentId: null,
      bookmarkId: null,
      questionId: null,
      postId: 'post_ssr_500s',
      stackId: null,
    },
  ],

  emailSubscription: [],

  // ── Many-to-many join tables ────────────────────────────────────────────
  bookmarkToTag: [
    { bookmarkId: 'bm_ssr_patterns', tagId: 'tag_web' },
    { bookmarkId: 'bm_typography_web', tagId: 'tag_design' },
  ],
  stackToTag: [{ stackId: 'stack_nextjs', tagId: 'tag_engineering' }],
  photographToTag: [
    { photographId: 'phog_london_rain', tagId: 'tag_photography' },
    { photographId: 'phog_menlo_fog', tagId: 'tag_photography' },
    { photographId: 'phog_alps_light', tagId: 'tag_photography' },
  ],
  stackToUser: [{ stackId: 'stack_nextjs', userId: 'usr_arvind' }],
}

export type Db = typeof db
