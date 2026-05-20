import * as React from 'react'

import { QuestionDetail } from '~/components/AMA/QuestionDetail'
import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_QUESTION, GET_QUESTIONS } from '~/graphql/queries/questions'
import { CommentType, QuestionStatus } from '~/graphql/types.generated'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function QuestionDetailPage({ id }) {
  return <QuestionDetail id={id} />
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { id } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_QUESTION,
    variables: { id },
  })

  if (!data?.question) {
    return { notFound: true, revalidate: 60 }
  }

  await Promise.all([
    apolloClient.query({
      query: GET_QUESTIONS,
      variables: { filter: { status: QuestionStatus.Answered } },
    }),
    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: id, type: CommentType.Question },
    }),
  ])

  return {
    ...addApolloState(apolloClient, { props: { id } }),
    revalidate: 60,
  }
}

QuestionDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<QuestionsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default QuestionDetailPage
