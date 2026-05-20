import { NextSeo } from 'next-seo'
import * as React from 'react'

import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { GET_QUESTIONS } from '~/graphql/queries/questions'
import { QuestionStatus } from '~/graphql/types.generated'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function AmaPage() {
  return (
    <NextSeo
      title={routes.ama.seo.title}
      description={routes.ama.seo.description}
      openGraph={routes.ama.seo.openGraph}
    />
  )
}

export async function getStaticProps() {
  const apolloClient = initStaticApolloClient()

  await apolloClient.query({
    query: GET_QUESTIONS,
    variables: {
      filter: { status: QuestionStatus.Answered },
    },
  })

  return {
    ...addApolloState(apolloClient, { props: {} }),
    revalidate: 60,
  }
}

AmaPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<QuestionsList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default AmaPage
