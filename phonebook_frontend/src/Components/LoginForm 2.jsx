import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries/queries'

const LoginForm = ( { setToken, setErrorMessage } ) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        onError: ( error ) => {
            setErrorMessage( error.graphQLErrors[0].message )
        }
    })

    useEffect(() => {

        console.log('Result login: ', result.data)

        if ( result.data ){
            const token = result.data.login.value
            setToken( token )
            localStorage.setItem('phonebook-app-token', token)
        }
    }, [ result.data ] )
    
    const handleLoginSubmit = (event) => {
        
        event.preventDefault()

        login( { variables: { username, password } } )

        setUsername('')
        setPassword('')
  }

    return (

        <div>
            <h2>Login</h2>
            <form onSubmit={ handleLoginSubmit }>
                <div>
                    Username
                    <input
                        type="text"
                        value={ username }
                        name="Username"
                        onChange={ ( { target }) => setUsername( target.value ) }
                    />
                </div>
                <div>
                    Password
                    <input
                        type="password"
                        value={ password }
                        name="Password"
                        onChange={ ( { target }) => setPassword( target.value ) }
                    />
                </div>
                <p>
                    <button type="submit">Login</button>
                </p>
            </form>
        </div>
    )
}

export default LoginForm