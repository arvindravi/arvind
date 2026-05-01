# Arvind - Personal Site

Personal website and blog built with Next.js, GraphQL, Apollo Client, and Prisma.

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **GraphQL:** Apollo Client, Apollo Server
- **Database:** PostgreSQL (via PlanetScale or direct)
- **ORM:** Prisma
- **Auth:** Auth0 (Twitter OAuth)
- **Styling:** Tailwind CSS
- **Analytics:** Fathom / Plausible

## Development Setup

### Prerequisites

- Node.js 18+ 
- Yarn (`npm install -g yarn`)
- PostgreSQL database or PlanetScale account
- Auth0 account with Twitter connection

### 1. Install Dependencies

```bash
yarn install
```

This will automatically run `graphql-codegen` and `prisma generate` via postinstall hooks.

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

- **Auth0:** Set up an Auth0 application with Twitter connection
- **Database:** Configure your PostgreSQL connection string
- **Postmark:** Add your server token for email notifications
- **Vercel Blob:** See below

### 3. Vercel Blob Setup

Photograph and stack image uploads go through [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). You need:

- **`BLOB_READ_WRITE_TOKEN`** — create a Blob store in the Vercel dashboard under *Storage → Blob*, connect it to your project, and copy the read/write token into `.env.local` for local development. On Vercel deployments the token is injected automatically once the store is linked.

The upload implementation lives in `src/lib/storage/upload.ts` (client-side) and `src/lib/storage/delete.ts` (server-side). To swap to a different provider in the future, replace the bodies of those two files and update `src/pages/api/images/upload.ts`.

### 4. Database Setup

```bash
# If using PlanetScale
yarn db:dev

# Or manually run Prisma migrations
npx prisma migrate dev
```

### 4. Run Development Server

```bash
yarn dev
```

Visit http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn generate` | Generate GraphQL types |
| `yarn lint` | Run ESLint |
| `yarn cypress:run` | Run E2E tests |
| `yarn db:dev` | Connect to development database |
| `yarn db:prod` | Connect to production database |

## Deployment

Deployed on Vercel. Push to `main` branch to trigger deployment.

### Environment Variables (Production)

Ensure all variables from `.env.example` are set in Vercel project settings.

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── graphql/        # GraphQL schema, types, resolvers
│   ├── lib/            # Utilities (apollo, auth0, prisma)
│   └── pages/          # Next.js pages and API routes
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── cypress/            # E2E tests
```

## License

MIT
