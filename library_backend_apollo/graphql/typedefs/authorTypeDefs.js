import gql from 'graphql-tag'

const authorTypeDefs = gql`

    type Author {
        id: ID!
        name: String!
        born: Int
        books: [ Book! ]!
    }

    extend type Query {
        authorCount: Int!
        allAuthors: [ Author! ]!
    }

    extend type Mutation {
        editAuthor(
            name: String!
            born: Int!
        ) : Author

        addAuthor(
            name: String!
            born: Int!
        ) : Author
    }
`

export default authorTypeDefs