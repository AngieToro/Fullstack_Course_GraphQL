import React from 'react'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_PERSONS, CREATE_PERSON } from '../queries/queries'
import { updateCache } from '../App'

const PersonForm = ( { notify } ) => {

    const [ name, setName ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ city, setCity ] = useState('')

    const [ createPerson ] = useMutation( CREATE_PERSON, {
        //obligar a actualizar la cache del query. Para que cuando se agregue una persona el resultado se actualice
        //el inconveniente es que la consulta siempre se vuelve a ejecutar con las actualizaciones.
        //refetchQueries: [ { query: ALL_PERSONS } ], 
        //En algunas situaciones, la única forma sensata de mantener el caché actualizado es usando la devolución de llamada update.
        update: ( cache, response ) => {

            console.log('Response: ', response)
            
            /* cache.updateQuery( { query: ALL_PERSONS }, ( { allPersons } ) => {
                return {
                    allPersons: allPersons.concat( response.data.addPerson )
                }
            }) */

            updateCache( cache, { query: ALL_PERSONS }, response.data.addPerson )
        },
        
        onError: ( error ) => {
            const message = error.graphQLErrors?.[0]?.message || error.message || 'Unknown error'
            console.log(message)
            notify( message )
        }
    } )

    const submitCreateForm = ( event ) => {

        event.preventDefault()

        createPerson( { variables: {
                name,
                phone: phone.length > 0 ? phone : undefined,
                street,
                city
            }
        } )

        setName('')
        setPhone('')
        setStreet('')
        setCity('')
    }

    return (
        <div>
            <h2>Create Person</h2>
            <form onSubmit={ submitCreateForm }>
                <div>
                    Name:
                    <input 
                        value={ name } 
                        onChange={ ( { target } ) => setName( target.value ) }
                    />
                </div>
                <div>
                    Phone:
                    <input 
                        value={ phone } 
                        onChange={ ( { target } ) => setPhone( target.value ) }
                    />
                </div>
                <div>
                    Street:
                    <input 
                        value={ street } 
                        onChange={ ( { target } ) => setStreet( target.value ) }
                    />
                </div>
                <div>
                    City:
                    <input 
                        value={ city } 
                        onChange={ ( { target } ) => setCity( target.value ) }
                    />
                </div>
                <button type='submit'>
                    Create
                </button>
            </form>
        </div>
    )
}

export default PersonForm
