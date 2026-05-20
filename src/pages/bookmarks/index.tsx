import { NextSeo } from 'next-seo'
import * as React from 'react'

import { BookmarksList } from '~/components/Bookmarks/BookmarksList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { GET_BOOKMARKS } from '~/graphql/queries/bookmarks'
import { GET_TAGS } from '~/graphql/queries/tags'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function BookmarksPage() {
  return (
    <NextSeo
      title={routes.bookmarks.seo.title}
      description={routes.bookmarks.seo.description}
      openGraph={routes.bookmarks.seo.openGraph}
    />
  )
}

export async function getStaticProps() {
  const apolloClient = initStaticApolloClient()

  await Promise.all([
    apolloClient.query({ query: GET_BOOKMARKS }),
    apolloClient.query({ query: GET_TAGS }),
  ])

  return {
    ...addApolloState(apolloClient, { props: {} }),
    revalidate: 60,
  }
}

BookmarksPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<BookmarksList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default BookmarksPage
