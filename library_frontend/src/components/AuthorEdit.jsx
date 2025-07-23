import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ALL_AUTHORS } from '../queries/queries/queriesAuthors'
import { UPDATE_BORN_PERSON } from '../queries/mutation/mutationAuthors'

const AuthorEditForm = ( { refetchAuthors, notify }) => {

    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [ updateBornPerson, result ] = useMutation( UPDATE_BORN_PERSON, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        awaitRefetchQueries: true,
        onError : ( error ) => console.log(error.message) 
    })

    const authors = useQuery(ALL_AUTHORS)

    useEffect( () => {
    
        console.log('Mutation edit result: ', result.data)
            
    
        if (result.data && result.data.editAuthor === null){
            console.log('Author not found')
            const message = 'Author not found'
            notify( message )
        }
    }, [ result.data ])

    const submit = ( event ) => {

        event.preventDefault()

        updateBornPerson( { variables: {
                name,
                born: Number(born)
            }
        } ).then(() => {
            refetchAuthors()
        })

        setName('')
        setBorn('')
    }

    return (

        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={ submit }>
                <label>
                    Select an Author: 
                    <select value={ name } onChange={ ( { target } ) => setName( target.value ) }>
                        <option value="">Choose an author</option>
                        { authors.data?.allAuthors?.map(( author ) => ( 
                            <option key={ author.id } value={ author.name }> { author.name } </option>
                        ))}
                    </select>
                </label>
                <div>
                    Born
                    <input
                        type='number'
                        value={ born }
                        onChange={ ( { target } ) => setBorn( target.value ) }
                    />
                </div>
                <button type="submit">Update Person</button>
            </form>
        </div>
    )
}

export default AuthorEditForm