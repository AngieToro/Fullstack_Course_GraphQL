import gql from 'graphql-tag'

const userTypeDefs = gql `

    type Token {
        value: String!
    }

    type User {
        id: ID!
        username: String!
        password: String!
        favoriteGenre: String!
    }

    type Query {
        me: User
        userCount: Int!
        allUser: [ User! ]!
    }

    type Mutation {
        createUser(
            username: String!
            password: String!
            favoriteGenre: String!
        ) : User

        login(
            username: String!
            password: String!
        ): Token
    }
`

export default userTypeDefs