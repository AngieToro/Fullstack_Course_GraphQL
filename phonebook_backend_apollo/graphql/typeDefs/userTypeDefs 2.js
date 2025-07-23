import { gql } from 'apollo-server'

const userTypeDefs = gql `

    type Token {
        value: String!
    }

    type User {
        id: ID!
        username: String!
        password: String!
        friends: [ Person! ]!
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
        ) : User

        login(
            username: String!
            password: String!
        ): Token

        addAsFriend (
            name: String!
        ): User
    }
`

export default userTypeDefs