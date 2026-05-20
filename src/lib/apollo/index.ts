import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import { relayStylePagination } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { APOLLO_STATE_PROP_NAME, GRAPHQL_ENDPOINT } from '~/graphql/constants'

let apolloClient

function createLink() {
  return new HttpLink({
    uri: GRAPHQL_ENDPOINT || '/api/graphql',
    credentials: 'include',
  })
}

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message }) => {
      try {
        toast.error(message)
      } catch {
        console.error({ message })
      }
    })
    return
  }

  const networkError = error as ServerError
  try {
    const result = networkError.bodyText
      ? JSON.parse(networkError.bodyText)
      : null
    toast.error(result?.error || networkError.message)
  } catch {
    console.error({ networkError })
  }
})

const TYPE_POLICIES = {
  Query: {
    fields: {
      bookmarks: relayStylePagination(['filter']),
      questions: relayStylePagination(['filter']),
      stacks: relayStylePagination(),
      photographs: relayStylePagination(['filter']),
    },
  },
  Comments: {
    keyFields: ['id'],
    fields: {
      id: {
        merge: false,
      },
    },
  },
  Bookmark: {
    keyFields: ['id', 'url'],
    fields: {
      id: {
        merge: false,
      },
      url: {
        merge: false,
      },
    },
  },
} as const

export function createApolloClient({
  initialState = {},
  link,
}: {
  initialState?: any
  link?: ApolloLink
} = {}) {
  const finalLink = link ?? ApolloLink.from([errorLink, createLink()])
  const ssrMode = typeof window === 'undefined'
  const cache = new InMemoryCache({
    typePolicies: TYPE_POLICIES,
  }).restore(initialState ?? {})

  return new ApolloClient({
    ssrMode,
    link: finalLink,
    cache,
    ssrForceFetchDelay: 1000, // prevents immediate refetch of SSR queries on the client
  })
}

export function initApolloClient({
  initialState = null,
  link,
}: {
  initialState?: any
  link?: ApolloLink
} = {}) {
  const _apolloClient =
    apolloClient ?? createApolloClient({ initialState, link })

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const initialState = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(
    () => initApolloClient({ initialState }),
    [initialState]
  )
  return store
}
