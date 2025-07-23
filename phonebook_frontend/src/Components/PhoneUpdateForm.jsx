import React from 'react'
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UPDATE_PHONE, ALL_PERSONS } from '../queries/queries'

const PhoneUpdateForm = ( { notify } ) => {

    const [ name, setName ] = useState('')
    const [ phone, setPhone ] = useState('')
    
    const [ updatePhone, result ] = useMutation( UPDATE_PHONE, {
        refetchQueries: [{ query: ALL_PERSONS }],
        awaitRefetchQueries: true,
        onError : ( error ) => console.log(error.message) 
    } )

    useEffect( () => {

        console.log('Mutation edit result: ', result.data)
        

        if (result.data && result.data.editNumber === null){
            notify('Person not found')
        }
    }, [ result.data ])

    const submitUpdateForm = ( event ) => {

        event.preventDefault()

        updatePhone( { variables: {
                name,
                phone
            }
        } )

        setName('')
        setPhone('')
       
    }

    return (

        <div>
            <h2>Change Number</h2>
            <form onSubmit={ submitUpdateForm }>
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
                <button type='submit'>
                    Chage number
                </button>
            </form>
        </div>
    )
}

export default PhoneUpdateForm
