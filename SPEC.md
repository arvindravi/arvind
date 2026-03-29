# arvindravi.com — Full Issue Audit & Fix Spec

## Context

This is a Next.js 14 personal website (formerly Brian Lovin's site) that has been partially migrated to Arvind Ravi's identity. The site is deployed on Vercel at arvindravi.com. This spec documents every known issue and provides exact instructions for fixing them.

---

## PART 1: BUILD-BREAKING TypeScript Errors

The project fails `next build` due to TypeScript errors. These MUST be fixed first.

### 1.1 — Auth0 v4 API Changes

**Files:**
- `src/graphql/context/index.ts` (line 1)
- `src/pages/api/auth/[...auth0].ts` (lines 2-5)
- `src/pages/api/images/sign.ts` (line 1)

**Problem:** The project uses `@auth0/nextjs-auth0@^4.16.0` but imports the v2/v3 named exports (`getSession`, `handleAuth`, `handleCallback`, `handleLogin`, `handleLogout`). In v4, the API changed to a class-based approach.

**Fix:** Replace all Auth0 imports with v4 API:

In `src/graphql/context/index.ts`:
```ts
// BEFORE
import { getSession } from '@auth0/nextjs-auth0'
// AFTER
import { Auth0Client } from '@auth0/nextjs-auth0/server'
const auth0 = new Auth0Client()
```
Update `isAuthenticated` to use `auth0.getSession()` (which is async and takes no args in Pages Router, or takes req/res).

In `src/pages/api/auth/[...auth0].ts`:
```ts
// BEFORE
import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0'
// AFTER — v4 uses a different handler pattern
import { Auth0Client } from '@auth0/nextjs-auth0/server'
const auth0 = new Auth0Client()
```
Rewrite the auth handlers using the v4 API. The v4 `handleAuth` is accessed differently.

**Alternative (simpler) fix:** Downgrade `@auth0/nextjs-auth0` to `^3.5.0` in `package.json` which supports the existing import pattern. This is the recommended approach since it requires zero code changes.

### 1.2 — Next.js Image Component Props

**Files:**
- `src/components/AppDissection/AppDissectionListItem.tsx` (lines 23-25)
- `src/components/Crit/Testimonial.tsx` (lines 34, 53)
- `src/components/Stack/StackImageUploader.tsx` (line 61)

**Problem:** `width` and `height` are passed as strings like `'48px'` instead of numbers. Also, `layout="fixed"` is deprecated in Next.js 14. Missing `alt` props on `<Image>`.

**Fix for AppDissectionListItem.tsx:**
```tsx
// BEFORE
width={'48px'}
height={'48px'}
layout="fixed"
// AFTER
width={48}
height={48}
```
Remove `layout="fixed"` — it's not needed with width/height set.

**Fix for Crit/Testimonial.tsx:**
Add `alt` prop to both `<Image>` components (e.g., `alt={testimonial.name}` and `alt=""`).
Change `width="56"` → `width={56}`, `height="56"` → `height={56}`, etc.

**Fix for StackImageUploader.tsx:**
Add `alt="Stack image"` prop. Change string dimensions to numbers. Remove `layout` prop.

### 1.3 — HeadlessUI v2 Breaking Changes

**File:** `src/components/Dialog/index.tsx` (line 64)

**Problem:** `Dialog.Overlay` was removed in `@headlessui/react` v2.

**Fix:** Replace `Dialog.Overlay` with a custom overlay `<div>` inside `<Transition.Child>`:
```tsx
// BEFORE
<Dialog.Overlay ... />
// AFTER
<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
```

### 1.4 — Dropzone Accept Type

**Files:**
- `src/components/Dropzone/index.tsx` (line 65)
- `src/components/Stack/StackImageUploader.tsx` (line 54)

**Problem:** `accept` prop expects `Accept` type (object with MIME keys), but strings are passed.

**Fix:**
```tsx
// BEFORE
accept="image/png,image/gif,image/jpeg"
// AFTER
accept={{ 'image/png': [], 'image/gif': [], 'image/jpeg': [] }}
```

### 1.5 — Apollo Cache Type Errors

**Files:**
- `src/components/Bookmarks/AddBookmarkForm.tsx` (line 34)
- `src/components/Bookmarks/EditBookmarkForm.tsx` (line 104)
- `src/components/Comments/Comment.tsx` (line 42)
- `src/components/Comments/CommentForm.tsx` (line 50)
- `src/components/HackerNews/SubscriptionForm.tsx` (line 39)
- `src/components/Stack/StackUsedBy.tsx` (line 49)
- `src/components/UserSettings/Email.tsx` (lines 28, 55, 82)

**Problem:** Apollo Client cache `readQuery` returns untyped `{}` and properties like `bookmarks`, `comments`, `viewer`, `stack` don't exist on `{}`.

**Fix:** Add type assertions to all `readQuery` calls:
```tsx
// BEFORE
const data = cache.readQuery({ query: GET_BOOKMARKS })
data.bookmarks...
// AFTER
const data = cache.readQuery<{ bookmarks: any }>({ query: GET_BOOKMARKS })
data?.bookmarks...
```
Apply similar typing for each affected cache read.

### 1.6 — react-hot-toast Theme API

**File:** `src/components/Providers/Toaster.tsx` (lines 17, 24)

**Problem:** `theme` property doesn't exist on the Toast options type in the installed version.

**Fix:** Remove the `theme` property or wrap it in a style object:
```tsx
// BEFORE
{ theme: 'dark', ... }
// AFTER — just remove the theme property, use style/className instead
{ style: { background: '#333', color: '#fff' }, ... }
```

### 1.7 — date-fns v4 Import Change

**File:** `src/pages/api/hn/send.ts` (line 1)

**Problem:** `import format from 'date-fns/format'` — default export removed in date-fns v4.

**Fix:**
```ts
// BEFORE
import format from 'date-fns/format'
// AFTER
import { format } from 'date-fns'
```

### 1.8 — JSX Namespace Missing

**File:** `src/components/SegmentedController/index.tsx` (line 20)

**Problem:** `Cannot find namespace 'JSX'` — TypeScript 5.x removed the global JSX namespace.

**Fix:** Add import at top of file:
```tsx
import type { JSX } from 'react'
```

### 1.9 — textarea-autosize Props

**File:** `src/components/Input/index.tsx` (line 13)

**Problem:** Missing required props `onPointerEnterCapture` and `onPointerLeaveCapture`.

**Fix:** This is a types mismatch. Pin `@types/react` version or add `// @ts-ignore` above the line. Better: update the TextareaAutosize import or spread required props.

### 1.10 — useInterval Hook

**File:** `src/hooks/useInterval.ts` (line 9)

**Problem:** `Expected 1 arguments, but got 0` — likely calling `clearInterval()` without the right signature.

**Fix:** Check the call and ensure it passes the interval ID.

### 1.11 — Apollo Client Error Type

**File:** `src/lib/apollo/index.ts` (line 42)

**Problem:** `Property 'error' does not exist on type 'string | Record<string, any>'`.

**Fix:** Add type narrowing:
```ts
if (typeof initialState !== 'string' && 'error' in initialState) {
  // handle error
}
```

### 1.12 — Apollo Server Micro Config

**File:** `src/pages/api/graphql/index.ts` (line 12)

**Problem:** `'uploads' does not exist in type 'Config<any>'`.

**Fix:** Remove the `uploads` property from the Apollo Server config — it's no longer supported in apollo-server-micro v3.

---

## PART 2: "Brian Lovin" → "Arvind Ravi" Replacements

Every reference to Brian Lovin, brianlovin, or brian_lovin must be replaced.

### 2.1 — Analytics Domain (CRITICAL — Analytics broken)

**File:** `src/components/Providers/Fathom.tsx` (line 9)

```tsx
// BEFORE
includedDomains: ['brianlovin.com'],
// AFTER
includedDomains: ['arvindravi.com'],
```

### 2.2 — Markdown Link Renderer

**File:** `src/components/MarkdownRenderer/index.tsx` (line 29)

```tsx
// BEFORE
if (url.origin === 'https://brianlovin.com') {
// AFTER
if (url.origin === 'https://arvindravi.com') {
```

### 2.3 — Email Templates

**File:** `src/emails/hnDigest.txt` (lines 8, 11)

Replace all `brianlovin.com` → `arvindravi.com`:
- `https://brianlovin.com/hn/{{ id }}` → `https://arvindravi.com/hn/{{ id }}`
- `https://brianlovin.com/hn` → `https://arvindravi.com/hn`

**File:** `src/emails/hnDigest.html` (lines 377, 408, 409)

Replace all `brianlovin.com` → `arvindravi.com`.

### 2.4 — GitHub Actions

**File:** `.github/workflows/hndigest.yml` (lines 14, 18)

```yaml
# BEFORE
args: 'https://brianlovin.com/api/hn/send?warmup=true'
args: 'https://brianlovin.com/api/hn/send?token=${{secrets.HN_TOKEN}}'
# AFTER
args: 'https://arvindravi.com/api/hn/send?warmup=true'
args: 'https://arvindravi.com/api/hn/send?token=${{secrets.HN_TOKEN}}'
```

**File:** `.github/dependabot.yml` (line 9)

```yaml
# BEFORE
assignees:
  - brianlovin
# AFTER
assignees:
  - arvindravi
```

### 2.5 — Database References

**File:** `package.json` (lines 14-15)

```json
// BEFORE
"db:dev": "pscale connect brianlovin dev --port 3309",
"db:prod": "pscale connect brianlovin main --port 3309",
// AFTER — update to actual PlanetScale db name or remove if using PostgreSQL
"db:dev": "pscale connect arvindravi dev --port 3309",
"db:prod": "pscale connect arvindravi main --port 3309",
```

**File:** `.env.example` (line 11)

```
# BEFORE
DATABASE_URL=postgresql://user:password@localhost:5432/brianlovin?schema=public
# AFTER
DATABASE_URL=postgresql://user:password@localhost:5432/arvindravi?schema=public
```

### 2.6 — Crit Page (Major Content Rewrite Needed)

**File:** `src/components/Crit/index.tsx`

This page is entirely about Brian Lovin's design critique service. It contains:
- Multiple testimonials mentioning "Brian" by name (these are real third-party quotes)
- Links to `brianlovin.notion.site` reports (3 URLs)
- FAQ saying "Hey! I'm Brian, I'm a product designer at GitHub" (line 198)
- `@brian_lovin` Twitter handle mention in a testimonial (line 61)

**Decision: Remove the /crit page entirely.**

Steps:
1. Delete `src/pages/crit.tsx`
2. Delete `src/components/Crit/index.tsx` and `src/components/Crit/Testimonial.tsx` (entire Crit directory)
3. Remove the `crit` entry from `src/config/routes.ts`
4. Remove `/crit` from sidebar navigation in `src/components/Sidebar/Navigation.tsx` (if present)
5. Remove the `speakingData` array entry in `src/components/Home/Intro.tsx` (line 81) which links to a Brian Lovin podcast interview, and remove the Speaking section from the homepage if it was the only entry
6. Delete static images in `public/static/img/crit/` directory

### 2.7 — Home Page Speaking Data

**File:** `src/components/Home/Intro.tsx` (line 81)

```tsx
// BEFORE
{
  href: 'https://uibreakfast.com/228-design-advisory-with-brian-lovin/',
  title: 'UI Breakfast',
  date: "Dec '21",
}
// AFTER — Remove this entry entirely, or replace with Arvind's speaking engagements
```

### 2.8 — App Dissection Content

**Files in `src/data/appDissections/`:**
- `lollipop/details.ts`: Contains `brianlovin.s3.amazonaws.com` image URLs (4 instances) and `twitter.com/brian_lovin` mentions (2 instances)
- `paper/index.ts`: Contains `blog.brianlovin.com` URL
- `inbox/details.ts`: Contains `brianlovin.com/app-dissection/google-search-for-ios/` URL
- `carousel/details.ts`: Contains `brianlovin.s3.amazonaws.com` image URLs (7+ instances, mostly commented out)
- `carousel/index.ts`: Contains `brianlovin.com/app-dissection` URL

**Fix:**
- Replace `brianlovin.com` → `arvindravi.com` in all internal URLs
- The S3 image URLs (`brianlovin.s3.amazonaws.com`) are external assets — these will break if the S3 bucket is no longer accessible. Check if these images still load. If not, either host them elsewhere or remove the inline images.
- Replace `twitter.com/brian_lovin` → `twitter.com/arvindravi_`
- Replace `blog.brianlovin.com` → remove or update

### 2.9 — Package Name

**File:** `package.json` (line 2)

```json
// BEFORE
"name": "brios",
// AFTER
"name": "arvindravi-site",
```

---

## PART 3: Broken Live Paths

### 3.1 — /writing Returns 500 Error

The `/writing` page returns a 500 server error on the live site. This is likely due to:
1. A database connection issue (the page queries posts via GraphQL/Prisma)
2. The GraphQL resolver for posts failing

**The database IS configured in Vercel**, so this is likely a code-level issue. Possible causes:
1. The `date-fns` import issue in `src/pages/api/hn/send.ts` may cascade
2. The `uploads` config in `src/pages/api/graphql/index.ts` may cause Apollo Server to fail to start
3. The Auth0 import errors in `src/graphql/context/index.ts` will break the GraphQL context setup
4. **Most likely:** The TypeScript build errors prevent the API routes from compiling, so `/api/graphql` returns 500

**Fix:** Resolving all Part 1 TypeScript errors should fix this. After deploying the fixes, verify `/writing` loads correctly.

### 3.2 — YouTube Redirect May Be Wrong

**File:** `next.config.js`

The `/youtube` redirect points to `https://www.youtube.com/channel/UC-esBYEUGQ6iK1wmw76f5MA` — verify this is Arvind's YouTube channel, not Brian's.

---

## PART 4: Cleanup & Miscellaneous

### 4.1 — Remove Leftover Merge Conflict Files

Delete these files that are artifacts of a previous merge:
- `src/components/Sidebar/Navigation.tsx.orig`
- `package.json.orig`
- `package.json.tmp`
- `yarn.lock.bak`
- `yarn.lock.orig`

### 4.2 — ESLint Configuration

The build warns about ESLint config format. The project uses `.eslintrc.json` (legacy flat config). Either:
- Migrate to `eslint.config.js` (ESLint 9 format)
- Or pin ESLint to v8 in `package.json`: `"eslint": "^8.56.0"`

**Recommendation:** Pin ESLint to v8 for now to avoid a large config migration.

### 4.3 — Vercel Build Command

**File:** `vercel.json`

The install command uses `--ignore-scripts` which skips `prisma generate` and `graphql-codegen`. This means Vercel must run these separately, or the build command must include them.

**Fix:** Update `vercel.json`:
```json
{
  "name": "arvind",
  "buildCommand": "npx graphql-codegen && npx prisma generate && npm run build",
  "installCommand": "npm install --legacy-peer-deps --ignore-scripts"
}
```

Or add a `prebuild` script to `package.json`:
```json
"prebuild": "npx graphql-codegen && prisma generate"
```

---

## PART 5: Recommended Dependency Fixes

### 5.1 — Auth0 Downgrade (Simplest Fix)

```json
"@auth0/nextjs-auth0": "^3.5.0"
```
This avoids rewriting all auth code.

### 5.2 — ESLint Downgrade

```json
"eslint": "^8.56.0"
```

### 5.3 — HeadlessUI Check

If downgrading to `@headlessui/react@^1.7.0`, the `Dialog.Overlay` issue is resolved. Otherwise fix the code per section 1.3.

---

## Execution Order

1. **Fix dependency versions** (Auth0, ESLint, optionally HeadlessUI) in `package.json`
2. **Fix all TypeScript errors** (Part 1) — in order of files
3. **Replace all Brian Lovin references** (Part 2)
4. **Fix Vercel build pipeline** (4.3)
5. **Clean up leftover files** (4.1)
6. **Test build locally** with `npm run build`
7. **Deploy and verify** all paths work on Vercel

---

## Files Changed Summary

| File | Changes |
|------|---------|
| `package.json` | Rename, fix deps, fix db scripts, add prebuild |
| `.env.example` | Update DB name |
| `vercel.json` | Update build command |
| `.github/workflows/hndigest.yml` | Update URLs |
| `.github/dependabot.yml` | Update assignee |
| `src/components/Providers/Fathom.tsx` | Fix domain |
| `src/components/MarkdownRenderer/index.tsx` | Fix domain check |
| `src/components/Home/Intro.tsx` | Remove Brian's speaking data |
| `src/components/Crit/index.tsx` | Remove/rewrite Brian's content |
| `src/components/AppDissection/AppDissectionListItem.tsx` | Fix Image props |
| `src/components/Crit/Testimonial.tsx` | Fix Image props |
| `src/components/Stack/StackImageUploader.tsx` | Fix Image/Dropzone props |
| `src/components/Dialog/index.tsx` | Fix Dialog.Overlay |
| `src/components/Dropzone/index.tsx` | Fix accept type |
| `src/components/Providers/Toaster.tsx` | Fix theme prop |
| `src/components/SegmentedController/index.tsx` | Add JSX import |
| `src/components/Input/index.tsx` | Fix textarea types |
| `src/components/Bookmarks/AddBookmarkForm.tsx` | Type cache reads |
| `src/components/Bookmarks/EditBookmarkForm.tsx` | Type cache reads |
| `src/components/Comments/Comment.tsx` | Type cache reads |
| `src/components/Comments/CommentForm.tsx` | Type cache reads |
| `src/components/HackerNews/SubscriptionForm.tsx` | Type cache reads |
| `src/components/Stack/StackUsedBy.tsx` | Type cache reads |
| `src/components/UserSettings/Email.tsx` | Type cache reads |
| `src/graphql/context/index.ts` | Fix Auth0 import (if not downgrading) |
| `src/pages/api/auth/[...auth0].ts` | Fix Auth0 imports (if not downgrading) |
| `src/pages/api/images/sign.ts` | Fix Auth0 import (if not downgrading) |
| `src/pages/api/graphql/index.ts` | Remove uploads config |
| `src/pages/api/hn/send.ts` | Fix date-fns import |
| `src/hooks/useInterval.ts` | Fix clearInterval call |
| `src/lib/apollo/index.ts` | Fix type narrowing |
| `src/emails/hnDigest.txt` | Update URLs |
| `src/emails/hnDigest.html` | Update URLs |
| `src/data/appDissections/lollipop/details.ts` | Update URLs |
| `src/data/appDissections/paper/index.ts` | Update URLs |
| `src/data/appDissections/inbox/details.ts` | Update URLs |
| `src/data/appDissections/carousel/details.ts` | Update URLs |
| `src/data/appDissections/carousel/index.ts` | Update URLs |
| **Delete:** `Navigation.tsx.orig`, `package.json.orig`, `package.json.tmp`, `yarn.lock.bak`, `yarn.lock.orig` | Cleanup |
