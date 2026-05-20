import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { PostDetail } from '~/components/Writing/PostDetail'
import { PostsList } from '~/components/Writing/PostsList'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_POST, GET_POSTS } from '~/graphql/queries/posts'
import { CommentType, useGetPostQuery } from '~/graphql/types.generated'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

function WritingPostPage({ slug }) {
  const { data } = useGetPostQuery({ variables: { slug } })
  if (data?.post && !data.post.publishedAt) return <PostEditor slug={slug} />
  return <PostDetail slug={slug} />
}

export async function getStaticPaths() {
  // Generate on-demand at runtime; each slug is statically cached after first
  // hit and revalidates every 60s.
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { slug } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_POST,
    variables: { slug },
  })

  if (!data?.post) {
    return { notFound: true, revalidate: 60 }
  }

  await Promise.all([
    apolloClient.query({ query: GET_POSTS }),
    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: data.post.id, type: CommentType.Bookmark },
    }),
  ])

  return {
    ...addApolloState(apolloClient, { props: { slug } }),
    revalidate: 60,
  }
}

WritingPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default WritingPostPage
