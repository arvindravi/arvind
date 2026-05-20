import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { StackDetail } from '~/components/Stack/StackDetail'
import { StackList } from '~/components/Stack/StackList'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_STACK, GET_STACKS } from '~/graphql/queries/stack'
import { CommentType } from '~/graphql/types.generated'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function StackDetailPage({ slug }) {
  return <StackDetail slug={slug} />
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { slug } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_STACK,
    variables: { slug },
  })

  if (!data?.stack) {
    return { notFound: true, revalidate: 60 }
  }

  await Promise.all([
    apolloClient.query({ query: GET_STACKS }),
    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: data.stack.id, type: CommentType.Stack },
    }),
  ])

  return {
    ...addApolloState(apolloClient, { props: { slug } }),
    revalidate: 60,
  }
}

StackDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<StackList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default StackDetailPage
