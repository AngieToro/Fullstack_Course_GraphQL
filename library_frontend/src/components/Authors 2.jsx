import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries/queries/queriesAuthors'
import AuthorEditForm from './AuthorEdit'

const Authors = ( props ) => {

  const authors = useQuery(ALL_AUTHORS)
  console.log('All authors: ', authors.data)
    
  if ( authors.loading || !authors.data ){
    return <div> Loading author....</div>
  }

  if ( !props.show ) {
    return null
  }
  
  return (

    <div>
      <h2>Authors</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>Born</th>
              <th>Books</th>
            </tr>
            { authors.data?.allAuthors?.map(( author ) => (
              <tr key={ author.id || author.name }>
                <td>{ author.name }</td>
                <td>{ author.born }</td>
                <td>{ author.bookCount }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <AuthorEditForm 
          refetchAuthors={ authors.refetch }
          notify={ props.notify }
        />
      </div>
    </div>

  )
}

export default Authors
