import { gql } from '@apollo/client'

export const USER_CONNECTED = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`