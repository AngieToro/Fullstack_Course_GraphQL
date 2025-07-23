import React from 'react'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries/queries/queriesBooks'
import { CREATE_BOOK } from '../queries/mutation/mutationBooks'

const NewBook = ( { show, notify } ) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation( CREATE_BOOK )

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook( { variables: {
        title,
        published: Number(published),
        author,
        genres
      },
      onCompleted: () => {
        //notify(`Book ${ title } added successfully`)
        setTitle('')
        setPublished('')
        setAuthor('')
        setGenres([])
        setGenre('')
      },
      onError: ( error ) => {
        const message = error.graphQLErrors?.[0]?.message || error.message || 'Unknown error'
        console.log('Error create book: ', message)
        notify ( message )
      },
      refetchQueries: [ { query: ALL_BOOKS } ]
    } )
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (

    <div>
      <br /> 
      <form onSubmit={ submit }>
        <div>
          Title
          <input
            value={ title }
            onChange={ ( { target } ) => setTitle( target.value ) }
          />
        </div>
        <div>
          Author
          <input
            value={ author }
            onChange={ ( { target } ) => setAuthor( target.value ) }
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={ published }
            onChange={ ( { target } ) => setPublished( target.value ) }
          />
        </div>
        <div>
          <input
            value={ genre }
            onChange={ ( { target } ) => setGenre( target.value ) }
          />
          <button onClick={addGenre} type="button">
            Add Genre
          </button>
        </div>
        <div>Genres: { genres.join(' ') }</div>
        <button type="submit">Create Book</button>
      </form>
    </div>

  )
}

export default NewBook