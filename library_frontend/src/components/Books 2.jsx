import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, FIND_GENRE_BOOK } from '../queries/queries/queriesBooks'
import BookTable from './BookTable'

const Books = ( props ) => {

  const [genre, setGenre] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])

  const books = useQuery( ALL_BOOKS ) 

  const [getGenreBooks, result] = useLazyQuery(FIND_GENRE_BOOK)

  useEffect( () => {

    if ( result.data?.findGenreBook) {
       setFilteredBooks ( result.data.findGenreBook )
    }

  }, [ result.data ] )

  if (!props.show) {
    return null
  }

  if ( books.loading && !books.data ){
    return <div> Loading data....</div>
  }

  const allBooks = books.data?.allBooks
  console.log('All books: ', allBooks)

  const booksToDisplay = genre
    ? filteredBooks
    : allBooks

  //flatMap, trae todos los géneros de todos los libros.
	//new Set(...), elimina los duplicados.
	//Array.from(...), convierte el Set en un array nuevamente.
  const genres = Array.from( new Set ( allBooks.flatMap ( book => book.genres )))
  console.log('Genres: ', genres)  

  const handleChangeGenre = ( event ) => {

        const genre = event.target.value
        console.log('Genre to find: ', genre)  
        setGenre( genre )

        if ( genre ){
          getGenreBooks( { variables: { genre } } )
        } else {
          setGenre('')
          setFilteredBooks([])
        }        
    }

  return (
    <div>
      <h2>Books</h2>
      <div>
         <label>
          Select a Genre: 
          <select value={ genre } onChange={ handleChangeGenre }>
            <option value="">Choose a Genre</option>
            { genres.map( genre => ( 
              <option key={ genre } value={ genre }> { genre } </option>
            ))}
          </select>
        </label>
      </div>

      { booksToDisplay &&
        <BookTable list={ booksToDisplay }/>
      }
    </div>
  )
}

export default Books
