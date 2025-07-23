import { gql } from 'apollo-server'

const personTypeDefs = gql `

    enum YesNo {
        YES
        NO
    }
        
    type Address {
        street: String!
        city: String!
    }

    type Person {
        id: ID!
        name: String!
        phone: String
        address: Address!
        friendOf: [ User! ]!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [ Person! ]!
        findPerson( name: String! ): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ) : Person

        editNumber(
            name: String!
            phone: String!
        ): Person
    }

    type Subscription {
        personAdded: Person!
    }
`

export default personTypeDefs