import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { UserDetail } from '~/components/UserProfile/UserDetail'
import { GET_USER } from '~/graphql/queries/user'
import { addApolloState } from '~/lib/apollo'
import { initStaticApolloClient } from '~/lib/apollo/static'

export default function UserPage({ username }) {
  return (
    <ListDetailView
      list={null}
      hasDetail
      detail={<UserDetail username={username} />}
    />
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params: { username } }) {
  const apolloClient = initStaticApolloClient()

  const { data } = await apolloClient.query<any>({
    query: GET_USER,
    variables: { username },
  })

  if (!data?.user) {
    return { notFound: true, revalidate: 60 }
  }

  return {
    ...addApolloState(apolloClient, { props: { username } }),
    revalidate: 60,
  }
}
