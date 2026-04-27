import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { PhotographDetail } from '~/components/Photographs/PhotographDetail'
import { PhotographsList } from '~/components/Photographs/PhotographsList'
import { withProviders } from '~/components/Providers/withProviders'
import { getContext } from '~/graphql/context'
import { GET_PHOTOGRAPH, GET_PHOTOGRAPHS } from '~/graphql/queries/photographs'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function PhotographDetailPage({ slug }) {
  return <PhotographDetail slug={slug} />
}

export async function getServerSideProps({ params: { slug }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  const { data } = await apolloClient.query({
    query: GET_PHOTOGRAPH,
    variables: { slug },
  })

  if (!data?.photograph) {
    return { notFound: true }
  }

  await Promise.all([
    apolloClient.query({ query: GET_VIEWER }),
    apolloClient.query({ query: GET_PHOTOGRAPHS }),
  ])

  return addApolloState(apolloClient, {
    props: { slug },
  })
}

PhotographDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PhotographsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default PhotographDetailPage
