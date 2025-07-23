import React, { useState } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Persons from './Components/Persons'
import PersonForm from './Components/PersonCreateForm'
import Notification from './Components/Notification'
import PhoneUpdateForm from './Components/PhoneUpdateForm'
import LoginForm from './Components/LoginForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries/queries'

//agregar a la cache la subscripcion pero garantizando que sea una sola vez
export const updateCache = ( cache, query, addedPerson ) => {

    const uniqByName = ( person ) => {

      let seen = new Set()
      return person.filter(( item ) => {
        let k = item.name
        
        return seen.has(k) ? false : seen.add(k)
      })
    }

    cache.updateQuery(query, ({ allPersons }) => {
      return {
        allPersons: uniqByName( allPersons.concat( addedPerson ) ),
      }
    })
  }

const App = () => {
  
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ token, setToken ] = useState(null)
  const client = useApolloClient()

  const result = useQuery(ALL_PERSONS)
  console.log('Result all persons: ', result.data)

  useSubscription( PERSON_ADDED, {
    onData: ( { data, client } ) => {
      console.log('Subscription add person: ', data)
      const addedPerson = data.data.personAdded
      notify( `${ addedPerson.name } added` )
      updateCache( client.cache, { query: ALL_PERSONS }, addedPerson)
    }
  })
  
  if (result.loading){
    return <div> Loading data....</div>
  }

  const notify = ( message ) => {

    setErrorMessage(message)
    setTimeout( ( ) => {
      setErrorMessage(null)
    }, 10000)
  }

  if ( !token ){

    return (
      <div>
        <Notification message={ errorMessage } />
        <LoginForm
          setToken={ setToken }
          setErrorMessage={ notify } 
        />
      </div>
    )
  }

  const logOut = () => {

    setToken(null)
    localStorage.clear()
    client.resetStore() // restablecer la caché de apollo
  }

  return (
      <div>
        <button onClick={ logOut }> Logout </button>
        <h1>Phonebook App</h1>
        <Notification message={ errorMessage } />
        <PersonForm notify={ notify }/>
        <PhoneUpdateForm notify={ notify }/>
        { result?.data?.allPersons && 
          <Persons persons = { result.data.allPersons } />
        }
      </div>
  )
}

export default App
