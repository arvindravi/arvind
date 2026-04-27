import * as React from 'react'

import Button from '~/components/Button'
import { useViewerQuery } from '~/graphql/types.generated'

import { EditPhotographDialog } from './EditPhotographDialog'

export function PhotographActions({ photograph }) {
  const { data } = useViewerQuery()

  if (!data?.viewer?.isAdmin) return null

  return (
    <div className="flex items-center space-x-2">
      <EditPhotographDialog
        photograph={photograph}
        trigger={<Button>Edit</Button>}
      />
    </div>
  )
}
