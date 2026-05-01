import { Context } from '~/graphql/context'
import { UserInputError } from '~/graphql/helpers/errors'
import {
  MutationAddPhotographArgs,
  MutationDeletePhotographArgs,
  MutationEditPhotographArgs,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'
import { deleteImage } from '~/lib/storage/delete'

export async function addPhotograph(
  _,
  args: MutationAddPhotographArgs,
  ctx: Context
) {
  const { data } = args
  const {
    title,
    slug,
    caption,
    imageUrl,
    width,
    height,
    capturedAt,
    location,
    camera,
    lens,
    tag,
  } = data
  const { prisma } = ctx

  if (!title || title.length === 0)
    throw new UserInputError('Photograph must have a title')

  if (!slug || slug.length === 0)
    throw new UserInputError('Photograph must have a slug')

  if (!imageUrl || imageUrl.length === 0)
    throw new UserInputError('Photograph must have an image')

  const tags = tag
    ? {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
        },
      }
    : undefined

  return await prisma.photograph
    .create({
      data: {
        title,
        slug,
        caption: caption ?? null,
        imageUrl,
        width,
        height,
        capturedAt: capturedAt ?? null,
        location: location ?? null,
        camera: camera ?? null,
        lens: lens ?? null,
        publishedAt: new Date(),
        tags,
      },
      include: { tags: true },
    })
    .then((photograph) => {
      graphcdn.purgeList('photographs')
      return photograph
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to add photograph')
    })
}

export async function editPhotograph(
  _,
  args: MutationEditPhotographArgs,
  ctx: Context
) {
  const { id, data } = args
  const {
    title,
    slug,
    caption,
    capturedAt,
    location,
    camera,
    lens,
    tag,
    published,
  } = data
  const { prisma } = ctx

  if (!title || title.length === 0)
    throw new UserInputError('Photograph must have a title')

  if (!slug || slug.length === 0)
    throw new UserInputError('Photograph must have a slug')

  const existing = await prisma.photograph.findUnique({ where: { id } })
  if (!existing) throw new UserInputError('Photograph not found')

  await prisma.photograph.update({
    where: { id },
    data: { tags: { set: [] } },
  })

  const tags = tag
    ? {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
        },
      }
    : undefined

  let publishedAt: Date | null | undefined
  if (published === true && !existing.publishedAt) publishedAt = new Date()
  else if (published === false) publishedAt = null
  else publishedAt = undefined

  return await prisma.photograph
    .update({
      where: { id },
      data: {
        title,
        slug,
        caption: caption ?? null,
        capturedAt: capturedAt ?? null,
        location: location ?? null,
        camera: camera ?? null,
        lens: lens ?? null,
        ...(publishedAt !== undefined ? { publishedAt } : {}),
        tags,
      },
      include: { tags: true },
    })
    .then((photograph) => {
      graphcdn.purgeList('photographs')
      return photograph
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to edit photograph')
    })
}

export async function deletePhotograph(
  _,
  args: MutationDeletePhotographArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma } = ctx

  const existing = await prisma.photograph.findUnique({ where: { id } })
  if (existing?.imageUrl)
    await deleteImage(existing.imageUrl).catch(console.error)

  return await prisma.photograph
    .delete({ where: { id } })
    .then(() => {
      graphcdn.purgeList('photographs')
      return true
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to delete photograph')
    })
}
