import { gql } from '@apollo/client'

import { PhotographDetailFragment } from '../fragments/photograph'

export const ADD_PHOTOGRAPH = gql`
  mutation addPhotograph($data: AddPhotographInput!) {
    addPhotograph(data: $data) {
      ...PhotographDetail
    }
  }
  ${PhotographDetailFragment}
`

export const EDIT_PHOTOGRAPH = gql`
  mutation editPhotograph($id: ID!, $data: EditPhotographInput!) {
    editPhotograph(id: $id, data: $data) {
      ...PhotographDetail
    }
  }
  ${PhotographDetailFragment}
`

export const DELETE_PHOTOGRAPH = gql`
  mutation deletePhotograph($id: ID!) {
    deletePhotograph(id: $id)
  }
`
