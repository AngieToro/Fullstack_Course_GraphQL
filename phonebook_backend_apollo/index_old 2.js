import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag'
import { v4 as uuid } from 'uuid'
import { GraphQLError } from 'graphql'

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

//esquema graphql
//! (no-nullable) 
const typeDefs = gql `

    enum YesNo {
        YES
        NO
    }
    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address
        id: ID!
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
`
//objeto que contiene los resolutores del servidor. Son el código, que define cómo se responde a las consultas GraphQL
// tambien se pueden tener para los otros que no sean Query (Person, por ejemplo  Person: { name: (root) => root.name, })
//El solucionador predeterminado devuelve el valor del campo correspondiente del objeto. 
const resolvers = {
    Query: {
        personCount: () => persons.length,

        allPersons: ( root, args ) => {
            
            if (!args.phone){
                return persons      //devuelve todas las personas.
            }
            
            const byPhone = ( person ) => 
                args.phone === 'YES'
                ? person.phone      //devuelve las personas que tienen número de teléfono.
                : !person.phone     //devuelve las personas que no tienen teléfono.
                 

            return persons.filter(byPhone)
        },

        findPerson: ( root, args ) => persons.find( person => person.name === args.name )
    },
    
    Person: {
        address: ( { street, city }) => {        //tambien sirve poner como parametro root y luego street: root.street
            if (!street || !city ){
                return null
            }

            return {
                street,
                city
            }
        },
        phone: ( { phone } ) => {
            if (!phone) return null
            
            return  phone 
        }
    },

    Mutation: {
        addPerson: ( root, args ) => {
            console.log('AddPerson Args: ', args)

            if (persons.find( person => person.name === args.name )){
                throw new GraphQLError('Name must be unique', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name
                    }
                })
            }
            
            const id = uuid()
            const person = { ...args, id }
            persons = persons.concat(person)
            return person
        },

        editNumber: ( root, args ) => {

            console.log('EditNumber Args: ', args)

            const person = persons.find( p => p.name === args.name )
            console.log('Person: ', person)
            

            if (!person) return null

            const updatedPerson = {
                ...person,
                phone: args.phone
             }

             persons = persons.map( person => 
                person.name === args.name 
                ? updatedPerson
                : person
            )

            console.log('Edit number result: ', updatedPerson)
            

            return updatedPerson
        }
    }
    /* Person: {
        name: ( root ) => root.name,        //no es necesario ponerlo, es por defecto
        phone: ( root ) => root.phone,      //no es necesario ponerlo, es por defecto
        street: ( root ) => "Manhatan",     //esa direccion va a estar para todas las personas
        city: ( root ) => "New York",
        id: ( root ) => root.id,            //no es necesario ponerlo, es por defecto
    } */
}

//principal
const server = new ApolloServer({
    typeDefs,
    resolvers
})

//run in 4000 port
startStandaloneServer (server, 
    { listen: { port: 4000 }, 
}).then(  ( { url } ) => {
    console.log(`Server ready at ${ url } `)
})