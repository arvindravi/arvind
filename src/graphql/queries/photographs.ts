import { gql } from '@apollo/client'

import {
  PhotographDetailFragment,
  PhotographsConnectionFragment,
} from '../fragments/photograph'

export const GET_PHOTOGRAPHS = gql`
  query getPhotographs($first: Int, $after: String, $filter: PhotographFilter) {
    photographs(first: $first, after: $after, filter: $filter) {
      ...PhotographsConnection
    }
  }
  ${PhotographsConnectionFragment}
`

export const GET_PHOTOGRAPH = gql`
  query getPhotograph($slug: String!) {
    photograph(slug: $slug) {
      ...PhotographDetail
    }
  }
  ${PhotographDetailFragment}
`
