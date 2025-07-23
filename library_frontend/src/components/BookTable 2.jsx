const BookTable = ( { list } ) => {

    return (
         <table>
            <tbody>
                <tr>
                    <th></th>
                    <th>Published</th>
                    <th>Author</th>
                </tr>
                { list.map(( book ) => (
                    <tr key={ book.id }>
                    <td>{ book.title }</td>
                    <td>{ book.published }</td>
                    <td>{ book.author.name }</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )


}

export default BookTable