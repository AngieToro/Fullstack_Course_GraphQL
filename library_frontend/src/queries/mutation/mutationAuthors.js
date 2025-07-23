import { gql } from '@apollo/client'

export const UPDATE_BORN_PERSON = gql`
    mutation updateBornPerson($name: String!, $born: Int!) {
        editAuthor(name: $name, born: $born )
        {
            name
            born
        }
    }
`