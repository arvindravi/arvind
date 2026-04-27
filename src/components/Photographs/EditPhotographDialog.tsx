import * as React from 'react'

import { DialogComponent } from '~/components/Dialog'

import { EditPhotographForm } from './EditPhotographForm'

export function EditPhotographDialog({ trigger, photograph }) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Edit photograph'}
      modalContent={({ closeModal }) => (
        <EditPhotographForm photograph={photograph} closeModal={closeModal} />
      )}
    />
  )
}
