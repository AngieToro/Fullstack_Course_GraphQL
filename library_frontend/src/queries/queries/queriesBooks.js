import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      genres
      author {
        name
        born
      }
    }
  }
`

export const FIND_GENRE_BOOK= gql `
  query FindBookByGenre ($genre: String!) {
    findGenreBook(genre: $genre) {
      title
      published
      author {
        name
        born
      }
    }
  }
`