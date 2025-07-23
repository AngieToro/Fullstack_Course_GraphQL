import { useQuery } from '@apollo/client'
import { USER_CONNECTED } from '../queries/queries/queriesUser'
import { ALL_BOOKS } from "../queries/queries/queriesBooks"
import BookTable from './BookTable'

const Recommend = ( { show } ) => {

    const user = useQuery( USER_CONNECTED )
    console.log('User conected: ', user)

    const books = useQuery( ALL_BOOKS ) 
    console.log('Book: ', books)

    if (!show) {
        return null
    }

    const genre = user.data?.me.favoriteGenre
    console.log('Favorite genre: ', genre)

    const booksToDisplay = books.data?.allBooks.filter(book => book.genres.includes(genre))
    console.log('Favorite books by genre: ', booksToDisplay)

    return (
        <div>
            <h2> Books recommended by my favorite genre </h2>
            { booksToDisplay &&
                <BookTable list={ booksToDisplay }/>
            }
        </div>
    )
}

export default Recommend