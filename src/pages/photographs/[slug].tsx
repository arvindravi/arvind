import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { PhotographDetail } from '~/components/Photographs/PhotographDetail'
import { PhotographsList } from '~/components/Photographs/PhotographsList'
import { withProviders } from '~/components/Providers/withProviders'
import { GET_PHOTOGRAPH, GET_PHOTOGRAPHS } from '~/graphql/queries/photographs'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function PhotographDetailPage({ slug }) {
  return <PhotographDetail slug={slug} />
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { slug } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_PHOTOGRAPH,
    variables: { slug },
  })

  if (!data?.photograph) {
    return { notFound: true, revalidate: 60 }
  }

  await apolloClient.query({ query: GET_PHOTOGRAPHS })

  return {
    ...addApolloState(apolloClient, { props: { slug } }),
    revalidate: 60,
  }
}

PhotographDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PhotographsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default PhotographDetailPage
