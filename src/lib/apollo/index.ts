import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { relayStylePagination } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { APOLLO_STATE_PROP_NAME, GRAPHQL_ENDPOINT } from '~/graphql/constants'

let apolloClient

function createLink() {
  // Use HttpLink for both client and server side
  // This simplifies the setup and removes dependency on deprecated @apollo/link-schema
  return new HttpLink({
    uri: GRAPHQL_ENDPOINT || '/api/graphql',
    credentials: 'include',
  })
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      try {
        toast.error(message)
      } catch {
        console.error({ message })
      }
    })
  }

  if (networkError) {
    const err = networkError as ServerError
    try {
      toast.error((err.result as Record<string, unknown>).error as string)
    } catch {
      console.error({ err })
    }
  }
})

export function createApolloClient({ initialState = {}, context = {} }) {
  const link = ApolloLink.from([errorLink, createLink()])
  const ssrMode = typeof window === 'undefined'
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          bookmarks: relayStylePagination(['filter']),
          questions: relayStylePagination(['filter']),
          stacks: relayStylePagination(),
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
    },
  }).restore(initialState)

  return new ApolloClient({
    ssrMode,
    link,
    cache,
    ssrForceFetchDelay: 1000, // prevents immediate refetch of SSR queries on the client
  })
}

export function initApolloClient({ initialState = null, context = {} }) {
  const _apolloClient =
    apolloClient ?? createApolloClient({ initialState, context })

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
