import { NextSeo } from 'next-seo'
import * as React from 'react'

import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { GET_HACKER_NEWS_POSTS } from '~/graphql/queries/hackerNews'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function HNPage() {
  return (
    <NextSeo
      title={routes.hn.seo.title}
      description={routes.hn.seo.description}
      openGraph={routes.hn.seo.openGraph}
    />
  )
}

export async function getStaticProps() {
  const apolloClient = initStaticApolloClient()

  await apolloClient.query({ query: GET_HACKER_NEWS_POSTS })

  return {
    ...addApolloState(apolloClient, { props: {} }),
    revalidate: 60,
  }
}

HNPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export default HNPage
