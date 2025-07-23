import gql from 'graphql-tag'

const bookTypeDefs = gql `

    type Book {
        id: ID!
        title: String!
        published: String!
        author: Author!
        genres: [ String! ]!
    }

    extend type Author {
        bookCount: Int!
    }

    extend type Query {
        bookCount: Int!
        allBooks: [ Book! ]!
        findGenreBook ( genre: String! ) : [ Book! ]!
        allBooksAuthor( author: String! ): [ Book! ]!
    }

    extend type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [ String! ]!
        ) : Book
    }

    type Subscription {
        bookAdded: Book!
    }
`

export default bookTypeDefs
