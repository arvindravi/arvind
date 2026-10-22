/**
 * Mock Prisma client for local development without a database.
 *
 * Enable with MOCK_DB=true in .env.local. Implements the subset of the
 * Prisma query API this app actually uses:
 *
 *   findMany / findUnique / findFirst  (where, orderBy, skip, take, cursor,
 *                                       include: relations + _count)
 *   count                              (where)
 *   create / update / upsert / delete  (where, data, include)
 *
 * `where` supports: scalar equality, null, { not }, { equals }, { in },
 * { contains }, { lt/gt/lte/gte }, and M2M { some / every / none } filters.
 * findUnique/findFirst results are thenables that also expose one-level
 * relation queries (e.g. comment.author()), matching Prisma's queryable
 * model pattern.
 *
 * Data lives in memory (mock-data.ts) and resets on server restart.
 */

import { db } from './mock-data'

type Row = Record<string, any>

interface ManyHas {
  model: string
  fk: string
}
interface OneHas {
  model: string
  fk: string
}
interface Foreign {
  model: string
  field: string
}
interface M2M {
  join: string
  local: string
  foreign: string
  foreignModel: string
}

interface ModelSpec {
  table: string
  hasMany?: Record<string, ManyHas>
  hasOne?: Record<string, OneHas>
  fk?: Record<string, Foreign>
  m2m?: Record<string, M2M>
}

const MODELS: Record<string, ModelSpec> = {
  user: {
    table: 'user',
    hasMany: {
      posts: { model: 'post', fk: 'userId' },
      comments: { model: 'comment', fk: 'userId' },
      questions: { model: 'question', fk: 'userId' },
      reactions: { model: 'reaction', fk: 'userId' },
    },
    m2m: {
      stacks: {
        join: 'stackToUser',
        local: 'userId',
        foreign: 'stackId',
        foreignModel: 'stack',
      },
    },
  },
  post: {
    table: 'post',
    fk: { author: { model: 'user', field: 'userId' } },
    hasMany: {
      comments: { model: 'comment', fk: 'postId' },
      reactions: { model: 'reaction', fk: 'postId' },
      history: { model: 'postEdit', fk: 'postId' },
    },
  },
  postEdit: {
    table: 'postEdit',
    fk: { post: { model: 'post', field: 'postId' } },
  },
  comment: {
    table: 'comment',
    fk: {
      author: { model: 'user', field: 'userId' },
      post: { model: 'post', field: 'postId' },
      bookmark: { model: 'bookmark', field: 'bookmarkId' },
      question: { model: 'question', field: 'questionId' },
      stack: { model: 'stack', field: 'stackId' },
    },
    hasOne: { audio: { model: 'audio', fk: 'commentId' } },
    hasMany: { reactions: { model: 'reaction', fk: 'commentId' } },
  },
  audio: {
    table: 'audio',
    fk: { comment: { model: 'comment', field: 'commentId' } },
  },
  bookmark: {
    table: 'bookmark',
    m2m: {
      tags: {
        join: 'bookmarkToTag',
        local: 'bookmarkId',
        foreign: 'tagId',
        foreignModel: 'tag',
      },
    },
    hasMany: {
      comments: { model: 'comment', fk: 'bookmarkId' },
      reactions: { model: 'reaction', fk: 'bookmarkId' },
    },
  },
  photograph: {
    table: 'photograph',
    m2m: {
      tags: {
        join: 'photographToTag',
        local: 'photographId',
        foreign: 'tagId',
        foreignModel: 'tag',
      },
    },
  },
  stack: {
    table: 'stack',
    m2m: {
      tags: {
        join: 'stackToTag',
        local: 'stackId',
        foreign: 'tagId',
        foreignModel: 'tag',
      },
      users: {
        join: 'stackToUser',
        local: 'stackId',
        foreign: 'userId',
        foreignModel: 'user',
      },
    },
    hasMany: {
      comments: { model: 'comment', fk: 'stackId' },
      reactions: { model: 'reaction', fk: 'stackId' },
    },
  },
  question: {
    table: 'question',
    fk: { author: { model: 'user', field: 'userId' } },
    hasMany: {
      comments: { model: 'comment', fk: 'questionId' },
      reactions: { model: 'reaction', fk: 'questionId' },
    },
  },
  tag: {
    table: 'tag',
    m2m: {
      bookmarks: {
        join: 'bookmarkToTag',
        local: 'tagId',
        foreign: 'bookmarkId',
        foreignModel: 'bookmark',
      },
      stacks: {
        join: 'stackToTag',
        local: 'tagId',
        foreign: 'stackId',
        foreignModel: 'stack',
      },
      photographs: {
        join: 'photographToTag',
        local: 'tagId',
        foreign: 'photographId',
        foreignModel: 'photograph',
      },
    },
  },
  reaction: {
    table: 'reaction',
    fk: {
      user: { model: 'user', field: 'userId' },
      post: { model: 'post', field: 'postId' },
      comment: { model: 'comment', field: 'commentId' },
      bookmark: { model: 'bookmark', field: 'bookmarkId' },
      question: { model: 'question', field: 'questionId' },
      stack: { model: 'stack', field: 'stackId' },
    },
  },
  emailSubscription: { table: 'emailSubscription' },
}

/** Composite unique names → their constituent fields. */
const COMPOSITE_UNIQUE: Record<string, Record<string, string[]>> = {
  emailSubscription: { emailAndType: ['email', 'type'] },
}

// ── where matching ────────────────────────────────────────────────────────

function matchValue(actual: unknown, cond: unknown): boolean {
  if (cond === null) return actual === null
  if (cond !== null && typeof cond === 'object' && !Array.isArray(cond)) {
    const c = cond as Record<string, any>
    if ('not' in c) return c.not === null ? actual !== null : actual !== c.not
    if ('equals' in c)
      return c.equals === null ? actual === null : actual === c.equals
    if ('in' in c) return c.in.includes(actual)
    if ('contains' in c)
      return String(actual ?? '')
        .toLowerCase()
        .includes(String(c.contains).toLowerCase())
    if ('lt' in c) return actual !== null && actual < c.lt
    if ('gt' in c) return actual !== null && actual > c.gt
    if ('lte' in c) return actual !== null && actual <= c.lte
    if ('gte' in c) return actual !== null && actual >= c.gte
  }
  return actual === cond
}

function m2mRows(model: string, row: Row, m2m: M2M): Row[] {
  const join = db[m2m.join] as Row[]
  const ids = join
    .filter((j) => j[m2m.local] === row.id)
    .map((j) => j[m2m.foreign])
  return (db[m2m.foreignModel] as Row[]).filter((r) => ids.includes(r.id))
}

function matches(model: string, row: Row, where: Row | undefined): boolean {
  if (!where) return true
  const spec = MODELS[model]
  return Object.entries(where).every(([key, cond]) => {
    // Composite unique, e.g. { emailAndType: { email, type } }
    const composite = COMPOSITE_UNIQUE[model]?.[key]
    if (composite && cond && typeof cond === 'object') {
      return composite.every((f) => matchValue(row[f], cond[f]))
    }
    // M2M relation filter, e.g. { tags: { some: { name: { equals } } } }
    if (
      cond &&
      typeof cond === 'object' &&
      !Array.isArray(cond) &&
      ('some' in cond || 'every' in cond || 'none' in cond)
    ) {
      const m2m = spec.m2m?.[key]
      if (m2m) {
        const related = m2mRows(model, row, m2m)
        const sub = related.filter((r) =>
          matches(m2m.foreignModel, r, cond.some ?? cond.every ?? cond.none)
        )
        if ('some' in cond) return sub.length > 0
        if ('none' in cond) return sub.length === 0
        if ('every' in cond)
          return related.length > 0 && sub.length === related.length
      }
      return true
    }
    return matchValue(row[key], cond)
  })
}

function filterRows(model: string, rows: Row[], where?: Row): Row[] {
  if (!where) return rows
  return rows.filter((row) => matches(model, row, where))
}

// ── ordering / pagination ─────────────────────────────────────────────────

function sortRows(rows: Row[], orderBy?: Row | Row[]): Row[] {
  if (!orderBy) return rows
  const fields = (Array.isArray(orderBy) ? orderBy : [orderBy]) as Row[]
  return [...rows].sort((a, b) => {
    for (const [field, dir] of Object.entries(fields)) {
      const direction = String(dir)
      const av = a[field]
      const bv = b[field]
      if (av === bv) continue
      if (av === null || av === undefined) return 1
      if (bv === null || bv === undefined) return -1
      const cmp = av < bv ? -1 : 1
      return direction === 'asc' ? cmp : -cmp
    }
    return 0
  })
}

function applyCursor(rows: Row[], cursor?: Row): Row[] {
  if (!cursor) return rows
  const id = cursor.id
  if (!id) return rows
  const idx = rows.findIndex((r) => r.id === id)
  return idx === -1 ? rows : rows.slice(idx + 1)
}

// ── include resolution ────────────────────────────────────────────────────

function countRelated(model: string, row: Row, rel: string): number {
  const spec = MODELS[model]
  const hasMany = spec.hasMany?.[rel]
  if (hasMany)
    return (db[hasMany.model] as Row[]).filter((r) => r[hasMany.fk] === row.id)
      .length
  const hasOne = spec.hasOne?.[rel]
  if (hasOne)
    return (db[hasOne.model] as Row[]).some((r) => r[hasOne.fk] === row.id)
      ? 1
      : 0
  const m2m = spec.m2m?.[rel]
  if (m2m) return m2mRows(model, row, m2m).length
  return 0
}

function resolveInclude(model: string, row: Row, include?: Row): Row {
  if (!row) return row
  if (!include) return { ...row }
  const spec = MODELS[model]
  const out: Row = { ...row }
  for (const [key, value] of Object.entries(include)) {
    if (key === '_count') {
      out._count = {}
      const select = (value as Row)?.select ?? {}
      for (const [rel, wanted] of Object.entries(select)) {
        if (!wanted) continue
        out._count[rel] = countRelated(model, row, rel)
      }
      continue
    }
    if (value !== true) continue // only boolean includes are used by this app
    const hasMany = spec.hasMany?.[key]
    const hasOne = spec.hasOne?.[key]
    const fk = spec.fk?.[key]
    const m2m = spec.m2m?.[key]
    if (hasMany)
      out[key] = (db[hasMany.model] as Row[]).filter(
        (r) => r[hasMany.fk] === row.id
      )
    else if (hasOne)
      out[key] =
        (db[hasOne.model] as Row[]).find((r) => r[hasOne.fk] === row.id) ?? null
    else if (fk)
      out[key] =
        (db[fk.model] as Row[]).find((r) => r.id === row[fk.field]) ?? null
    else if (m2m) out[key] = m2mRows(model, row, m2m)
  }
  return out
}

/**
 * Wrap a row so it is both awaitable and supports one-level relation
 * queries (Prisma's queryable model pattern), e.g. comment.author().
 *
 * Returns a real Promise (resolving to the plain row) with relation
 * methods attached — NOT a hand-rolled thenable, which would recurse
 * through Promise.resolve(thenable) adoption and leak the heap.
 */
function queryable(model: string, row: Row | null, include?: Row): any {
  const spec = MODELS[model]
  const data = row ? resolveInclude(model, row, include) : null
  const relations: Record<string, { model: string; field: string }> = {
    ...(spec.fk ?? {}),
    ...Object.fromEntries(
      Object.entries(spec.hasOne ?? {}).map(([k, v]) => [
        k,
        { model: v.model, field: v.fk },
      ])
    ),
  }
  const result: any = Promise.resolve(data)
  // Relation methods exist even when the row is null — real Prisma
  // queryables resolve them to null/[] in that case, and resolvers call
  // them on the promise before awaiting (e.g. findUnique(...).comments()).
  for (const [rel, target] of Object.entries(relations)) {
    if (row && rel in data) continue // include already populated this key
    result[rel] = () =>
      Promise.resolve(
        row
          ? ((db[target.model] as Row[]).find(
              (r) => r.id === row[target.field]
            ) ?? null)
          : null
      )
  }
  // hasMany relation queries, e.g. post.comments()
  for (const [rel, target] of Object.entries(spec.hasMany ?? {})) {
    if (row && rel in data) continue
    result[rel] = () =>
      Promise.resolve(
        row
          ? (db[target.model] as Row[]).filter((r) => r[target.fk] === row.id)
          : []
      )
  }
  return result
}

// ── CRUD ──────────────────────────────────────────────────────────────────

function table(model: string): Row[] {
  return db[MODELS[model].table] as Row[]
}

function nextId(model: string): string {
  return `mock_${model}_${Math.random().toString(36).slice(2, 10)}`
}

function create(model: string, args: Row): any {
  const rows = table(model)
  const row: Row = {
    id: nextId(model),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...args.data,
  }
  rows.push(row)
  return queryable(model, row, args.include)
}

function update(model: string, args: Row): any {
  const row = table(model).find((r) => matches(model, r, args.where))
  if (!row)
    throw new Error(
      `MockP2025: No ${model} found for update (where: ${JSON.stringify(
        args.where
      )})`
    )
  Object.assign(row, args.data, { updatedAt: new Date() })
  return queryable(model, row, args.include)
}

function upsert(model: string, args: Row): any {
  const existing = table(model).find((r) => matches(model, r, args.where))
  return existing
    ? update(model, {
        where: args.where,
        data: args.update,
        include: args.include,
      })
    : create(model, { data: args.create, include: args.include })
}

function remove(model: string, args: Row): any {
  const rows = table(model)
  const idx = rows.findIndex((r) => matches(model, r, args.where))
  if (idx === -1)
    throw new Error(
      `MockP2025: No ${model} found for delete (where: ${JSON.stringify(
        args.where
      )})`
    )
  const [deleted] = rows.splice(idx, 1)
  return deleted
}

// ── the client ────────────────────────────────────────────────────────────

function findMany(model: string, args: Row = {}): Promise<Row[]> {
  let rows = filterRows(model, table(model), args.where)
  rows = sortRows(rows, args.orderBy)
  rows = applyCursor(rows, args.cursor)
  if (typeof args.skip === 'number') rows = rows.slice(args.skip)
  if (typeof args.take === 'number') rows = rows.slice(0, args.take)
  return Promise.resolve(
    rows.map((r) => resolveInclude(model, r, args.include))
  )
}

function findOne(model: string, args: Row = {}): any {
  const rows = filterRows(model, table(model), args.where)
  const row = rows[0] ?? null
  return Promise.resolve(queryable(model, row, args.include))
}

export const mockPrisma: any = new Proxy(
  {},
  {
    get: (_target, model: string) => {
      if (!MODELS[model])
        throw new Error(`mock prisma: unknown model "${model}"`)
      return new Proxy(
        {},
        {
          // NOTE: not `async` — an async wrapper would return a fresh
          // Promise and hide the relation methods attached to the
          // queryable result (e.g. findUnique(...).comments()).
          get:
            (_t, method: string) =>
            (...args: Row[]) => {
              const a = args[0] ?? {}
              switch (method) {
                case 'findMany':
                  return findMany(model, a)
                case 'findUnique':
                case 'findFirst':
                  return findOne(model, a)
                case 'count':
                  return Promise.resolve(
                    filterRows(model, table(model), a.where).length
                  )
                case 'create':
                  return create(model, a)
                case 'update':
                  return update(model, a)
                case 'upsert':
                  return upsert(model, a)
                case 'delete':
                  return Promise.resolve(remove(model, a))
                case 'deleteMany':
                  return Promise.resolve({
                    count: filterRows(model, table(model), a.where).length,
                  })
                default:
                  throw new Error(
                    `mock prisma: ${model}.${method}() not implemented`
                  )
              }
            },
        }
      )
    },
  }
)
