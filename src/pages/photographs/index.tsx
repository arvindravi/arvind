import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { PhotographsList } from '~/components/Photographs/PhotographsList'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { GET_PHOTOGRAPHS } from '~/graphql/queries/photographs'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function PhotographsPage() {
  return (
    <>
      <NextSeo
        title={routes.photographs.seo.title}
        description={routes.photographs.seo.description}
        openGraph={routes.photographs.seo.openGraph}
      />
    </>
  )
}

PhotographsPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<PhotographsList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export async function getStaticProps() {
  const apolloClient = initStaticApolloClient()

  await apolloClient.query({ query: GET_PHOTOGRAPHS })

  return {
    ...addApolloState(apolloClient, { props: {} }),
    revalidate: 60,
  }
}

export default PhotographsPage
