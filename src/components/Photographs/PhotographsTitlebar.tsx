import * as React from 'react'
import { Plus } from 'react-feather'

import { GhostButton } from '~/components/Button'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useViewerQuery } from '~/graphql/types.generated'

import { AddPhotographDialog } from './AddPhotographDialog'

export function PhotographsTitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function trailingAccessory() {
    if (data?.viewer?.isAdmin) {
      return (
        <AddPhotographDialog
          trigger={
            <GhostButton aria-label="Add Photograph" size="small-square">
              <Plus size={16} />
            </GhostButton>
          }
        />
      )
    }
    return null
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Photographs"
      trailingAccessory={trailingAccessory()}
    />
  )
}
