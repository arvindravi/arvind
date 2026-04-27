import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { AddPhotographForm } from './AddPhotographForm'

export function AddPhotographDialog({ trigger }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'New photograph'}
      modalContent={({ closeModal }) => (
        <AddPhotographForm closeModal={closeModal} />
      )}
    />
  )
}
