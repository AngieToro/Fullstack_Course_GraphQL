import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        street
        city
      }
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      id  
      name
      phone 
      address {
        street
        city
      }
    }
  }
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