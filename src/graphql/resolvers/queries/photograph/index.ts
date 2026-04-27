import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { Context } from '~/graphql/context'
import {
  GetPhotographQueryVariables,
  GetPhotographsQueryVariables,
} from '~/graphql/types.generated'

export async function getPhotographs(
  _,
  args: GetPhotographsQueryVariables,
  ctx: Context
) {
  const { first = PAGINATION_AMOUNT, after = undefined, filter = null } = args
  const { prisma, viewer } = ctx

  const skip = after ? 1 : 0
  const cursor = after ? { id: after } : undefined
  const take = first + 1

  const where: any = {}
  if (filter?.tag) {
    where.tags = { some: { name: { equals: filter.tag } } }
  }

  // Non-admins can only see published photographs.
  // Admins viewing with `published: false` see drafts; otherwise see all.
  if (!viewer?.isAdmin) {
    where.publishedAt = { not: null }
  } else if (filter?.published === false) {
    where.publishedAt = { equals: null }
  }

  try {
    const edges = await prisma.photograph.findMany({
      take,
      skip,
      cursor,
      where,
      orderBy: [{ capturedAt: 'desc' }, { createdAt: 'desc' }],
      include: { tags: true },
    })

    const hasNextPage = edges.length > first
    const trimmedEdges = hasNextPage ? edges.slice(0, -1) : edges
    const edgesWithNodes = trimmedEdges.map((edge) => ({
      cursor: edge.id,
      node: edge,
    }))

    return {
      pageInfo: {
        hasNextPage,
        totalCount: await prisma.photograph.count({ where }),
        endCursor:
          edgesWithNodes.length > 0
            ? edgesWithNodes[edgesWithNodes.length - 1].cursor
            : null,
      },
      edges: edgesWithNodes,
    }
  } catch (e) {
    console.error({ error: e })
    return {
      pageInfo: { hasNextPage: false, totalCount: 0, endCursor: null },
      edges: [],
    }
  }
}

export async function getPhotograph(
  _,
  { slug }: GetPhotographQueryVariables,
  ctx: Context
) {
  const { prisma, viewer } = ctx

  const photograph = await prisma.photograph
    .findUnique({
      where: { slug },
      include: { tags: true },
    })
    .catch(() => null)

  if (!photograph) return null
  if (!photograph.publishedAt && !viewer?.isAdmin) return null

  return photograph
}
