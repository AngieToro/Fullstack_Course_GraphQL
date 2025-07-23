import { gql } from '@apollo/client'

//fragmentos se usa cuando múltiples consultas devuelvan resultados similares
//Los fragmentos son no definidos en el esquema GraphQL, sino en el cliente. Los fragmentos deben declararse cuando el cliente los utilice para consultas.
const PERSON_DETAILS = gql `
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`

export const ALL_PERSONS = gql`
  query {
    allPersons {
      ...PersonDetails
    }
  }
  ${ PERSON_DETAILS }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${ PERSON_DETAILS }
`

export const CREATE_PERSON = gql`
    mutation createPerson($name: String!, $phone: String, $street: String!, $city: String!) {
        addPerson(name: $name, phone: $phone, street: $street, city: $city ) 
        { 
            name
            phone
            address {
                street
                city
            }
        }
    }
`

export const UPDATE_PHONE = gql`
    mutation updatePhone($name: String!, $phone: String!) {
        editNumber(name: $name, phone: $phone )
        {
            name
            phone
            address {
                street
                city
            }
        }
    }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const PERSON_ADDED = gql `
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${ PERSON_DETAILS }
`