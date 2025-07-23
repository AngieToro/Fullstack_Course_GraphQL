import React, { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Recommend from './components/Recommend'
import { BOOK_ADDED } from './queries/subscription/subscriptionBooks'
import { ALL_BOOKS } from './queries/queries/queriesBooks'

export const updateCache = ( cache, query, addedBook ) => {

    const uniqByTitle = ( books ) => {

      let seen = new Set()

      return books.filter(( book ) => {
        let key = book.title
        
        return seen.has( key ) ? false : seen.add( key )
      })
    }

    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: uniqByTitle( allBooks.concat( addedBook ) ),
      }
    })
}

const App = () => {

  const [page, setPage] = useState('authors')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ token, setToken ] = useState(null)
  const client = useApolloClient()

  useSubscription( BOOK_ADDED, {
    skip: !token, //ignorar cuando no hay token
   
    onData: ( { data, client } ) => {
      console.log('Subscription add book: ', data)
      const addedBook = data?.data?.bookAdded
      console.log('Added book: ', addedBook)
      
      
      if ( addedBook ){
        console.log('notifica')
        
        notify( `${ addedBook.title } added` )
        updateCache( client.cache, { query: ALL_BOOKS }, addedBook )
        setPage('books')
      }
    },
    onError: ( error ) => {
      console.error('Subscription error: ', error.message)
      
    }
  })

  const notify = ( message ) => {

    setErrorMessage(message)
    setTimeout( ( ) => {
      setErrorMessage(null)
    }, 10000)
  }

  if ( !token ){

    return (
      <div>
        <LoginForm
          show={ page === 'login' }
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
      <Notification message={ errorMessage } />

      <div>        
        { !token &&
          <button onClick={() => setPage( 'login' )}>Login</button>
        }
        { token &&
          <div>
            <button onClick={ () => setPage( 'authors' ) }>Authors</button>
            <button onClick={ () => setPage( 'books'  )}>Books</button>
            <button onClick={ () => setPage( 'add' ) }>Add Book</button>
            <button onClick={ () => setPage( 'recommend' ) }>Recommend</button>
            <button onClick={ logOut }> Logout </button>
          </div>
        }
      </div>
      <div>
        { token && 
          <div>
            <Authors 
              show={ page === 'authors'} 
              notify={ notify }
            />

            <Books show={ page === 'books'} />

            <NewBook 
              show={ page === 'add'}
              notify={ notify }
            />

            <Recommend show={ page === 'recommend'} />
          </div>
      }
      </div>
    </div>
  )
}

export default App