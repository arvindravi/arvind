import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { PostsList } from '~/components/Writing/PostsList'
import routes from '~/config/routes'
import { GET_POSTS } from '~/graphql/queries/posts'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function WritingPage() {
  return (
    <NextSeo
      title={routes.writing.seo.title}
      description={routes.writing.seo.description}
      openGraph={routes.writing.seo.openGraph}
    />
  )
}

export async function getStaticProps() {
  const apolloClient = initStaticApolloClient()

  await apolloClient.query({
    query: GET_POSTS,
    variables: { filter: { published: true } },
  })

  return {
    ...addApolloState(apolloClient, { props: {} }),
    revalidate: 60,
  }
}

WritingPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export default WritingPage
