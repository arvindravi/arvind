import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { useGetPhotographsQuery } from '~/graphql/types.generated'

import { ListLoadMore } from '../ListDetail/ListLoadMore'
import { LoadingSpinner } from '../LoadingSpinner'
import { PhotographListItem } from './PhotographListItem'
import { PhotographsTitlebar } from './PhotographsTitlebar'

export function PhotographsList() {
  const router = useRouter()
  const [isVisible, setIsVisible] = React.useState(false)
  const [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, loading, fetchMore } = useGetPhotographsQuery()

  function handleFetchMore() {
    return fetchMore({
      variables: {
        after: data.photographs.pageInfo.endCursor,
      },
    })
  }

  React.useEffect(() => {
    if (isVisible) handleFetchMore()
  }, [isVisible])

  if (loading && !data?.photographs) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <PhotographsTitlebar scrollContainerRef={scrollContainerRef} />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListContainer>
    )
  }

  const edges = data?.photographs?.edges ?? []

  return (
    <ListContainer data-cy="photographs-list" onRef={setScrollContainerRef}>
      <PhotographsTitlebar scrollContainerRef={scrollContainerRef} />

      {edges.length === 0 ? (
        <div className="p-6 text-sm text-gray-1000 text-opacity-40 dark:text-white dark:text-opacity-40">
          No photographs yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {edges.map((edge) => {
            const active = router.query.slug === edge.node.slug
            return (
              <PhotographListItem
                key={edge.node.id}
                photograph={edge.node}
                active={active}
              />
            )
          })}
        </div>
      )}

      {data?.photographs?.pageInfo?.hasNextPage && (
        <ListLoadMore setIsVisible={setIsVisible} />
      )}
    </ListContainer>
  )
}
