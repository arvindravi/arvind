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

### 3. Database Setup

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
