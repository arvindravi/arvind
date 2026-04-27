import { gql } from '@apollo/client'

export const PhotographCoreFragment = gql`
  fragment PhotographCore on Photograph {
    __typename
    id
    slug
    title
    imageUrl
    width
    height
  }
`

export const PhotographListItemFragment = gql`
  fragment PhotographListItem on Photograph {
    ...PhotographCore
  }
  ${PhotographCoreFragment}
`

export const PhotographDetailFragment = gql`
  fragment PhotographDetail on Photograph {
    ...PhotographCore
    createdAt
    publishedAt
    caption
    capturedAt
    location
    camera
    lens
    tags {
      name
    }
  }
  ${PhotographCoreFragment}
`

export const PhotographsConnectionFragment = gql`
  fragment PhotographsConnection on PhotographsConnection {
    pageInfo {
      hasNextPage
      totalCount
      endCursor
    }
    edges {
      cursor
      node {
        ...PhotographListItem
      }
    }
  }
  ${PhotographListItemFragment}
`
