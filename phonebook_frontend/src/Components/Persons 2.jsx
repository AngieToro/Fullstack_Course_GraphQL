import React from 'react'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Person from './Person'
import { FIND_PERSON } from '../queries/queries'


const Persons = ( { persons }) => {

    // getPerson funcion que se  llama cuando se quiere hacer la consulta (no se ejecuta de inmediato)
    // result es un objeto que contiene el estado de la query (loading, data, etc.).
    const [ getPerson, result ] = useLazyQuery(FIND_PERSON)
    const [ person, setPerson ] = useState(null)

    //consulta GraphQL para obtener los detalles de las personas
    const showPerson = ( name ) => {
        getPerson( { variables: { nameToSearch: name } } )
    }

    //cuando en algun momeno se llena result entonces activa el useEffect
    useEffect(() => {

        if ( result.data ){

            console.log('Result show person: ', result)
            setPerson( result.data.findPerson )
        }
    }, [ result ])

    if (person){

        return (
            <Person
                person= { result.data.findPerson }
                onClose = { () => setPerson( null ) }>    
            </Person>
        )
    }

    return (

        <div>
            <h2>Persons</h2>
            { persons.map(person => 
                <div key={ person.id }>
                    { person.name } - { person.phone }
                    <button onClick={ () => showPerson( person.name ) }>
                        Show Info
                    </button>
                </div>
            ) }
        </div>
    )

}

export default Persons