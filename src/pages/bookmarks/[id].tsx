import * as React from 'react'

import { BookmarkDetail } from '~/components/Bookmarks/BookmarkDetail'
import { BookmarksList } from '~/components/Bookmarks/BookmarksList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { GET_BOOKMARK, GET_BOOKMARKS } from '~/graphql/queries/bookmarks'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_TAGS } from '~/graphql/queries/tags'
import { CommentType } from '~/graphql/types.generated'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function BookmarkPage({ id }) {
  return <BookmarkDetail id={id} />
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { id } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_BOOKMARK,
    variables: { id },
  })

  if (!data?.bookmark) {
    return { notFound: true, revalidate: 60 }
  }

  await Promise.all([
    apolloClient.query({ query: GET_BOOKMARKS }),
    apolloClient.query({ query: GET_TAGS }),
    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: id, type: CommentType.Bookmark },
    }),
  ])

  return {
    ...addApolloState(apolloClient, { props: { id } }),
    revalidate: 60,
  }
}

BookmarkPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<BookmarksList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default BookmarkPage
