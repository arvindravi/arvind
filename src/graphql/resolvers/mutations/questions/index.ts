import { GraphQLError } from 'graphql'

import { baseUrl } from '~/config/seo'
import { Context } from '~/graphql/context'
import {
  MutationAddQuestionArgs,
  MutationDeleteQuestionArgs,
  MutationEditQuestionArgs,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'
import { emailMe } from '~/lib/postmark'

export async function editQuestion(
  _,
  args: MutationEditQuestionArgs,
  ctx: Context
) {
  const { data, id } = args
  const { prisma, viewer } = ctx

  const question = await prisma.question.findUnique({ where: { id } })
  if (!question) {
    throw new GraphQLError('Question doesn’t exist', { extensions: { code: 'BAD_USER_INPUT' } })
  }

  if (viewer.isAdmin || viewer.id === question.userId) {
    return await prisma.question
      .update({
        where: { id },
        data,
        include: {
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })
      .then((question) => {
        graphcdn.purgeList('questions')
        return question
      })
      .catch((err) => {
        console.error({ err })
        throw new GraphQLError('Unable to edit question', { extensions: { code: 'BAD_USER_INPUT' } })
      })
  }

  throw new GraphQLError('No permission to delete this question', { extensions: { code: 'BAD_USER_INPUT' } })
}

export async function addQuestion(
  _,
  args: MutationAddQuestionArgs,
  ctx: Context
) {
  const { data } = args
  const { title, description } = data
  const { viewer, prisma } = ctx

  const question = await prisma.question
    .create({
      data: {
        title,
        description,
        userId: viewer.id,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
    .then((question) => {
      graphcdn.purgeList('questions')
      return question
    })
    .catch((err) => {
      console.error({ err })
      throw new GraphQLError('Unable to add question', { extensions: { code: 'BAD_USER_INPUT' } })
    })

  emailMe({
    subject: `AMA: ${title}`,
    body: `${title}\n\n${baseUrl}/ama/${question.id}`,
  })

  return question
}

export async function deleteQuestion(
  _,
  args: MutationDeleteQuestionArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma, viewer } = ctx

  const question = await prisma.question.findUnique({ where: { id } })
  if (!question) return true

  if (viewer.isAdmin || viewer.id === question.userId) {
    return await prisma.question
      .delete({ where: { id } })
      .then(() => {
        graphcdn.purgeList('questions')
        return true
      })
      .catch((err) => {
        console.error({ err })
        throw new GraphQLError('Unable to delete question', { extensions: { code: 'BAD_USER_INPUT' } })
      })
  }

  throw new GraphQLError('No permission to delete this question', { extensions: { code: 'BAD_USER_INPUT' } })
}
