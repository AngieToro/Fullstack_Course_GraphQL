import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuid } from 'uuid'
import { GraphQLError } from 'graphql'


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `

    type Book {
        title: String!
        published: String!
        author: String!
        genres: [ String! ]!
        id: ID!
    }

    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks: [ Book! ]!
        allAuthors: [ Author! ]!
        findAuthorBook( author: String! ): [ Book! ]!
        findGenreBook ( genre: String! ) : [ Book! ]!
    }

    type Mutation {
        addBook(
            title: String!
            published: String!
            author: String!
            genres: [ String! ]!
        ) : Book

        editAuthor(
            name: String!
            born: Int!
        ) : Author
    }
`

const resolvers = {
  Query: {
        bookCount: () => books.length,

        authorCount: () => authors.length,
    
        allBooks: () => books,

        allAuthors: () => {

            return authors.map( author => ({
                ...author,
                bookCount: books.filter( book => book.author === author.name ).length
            }))
        },

        findAuthorBook: ( root, args ) => {

            if ( !args.author ) return books 

            return books.filter( book => book.author === args.author )
        },

        findGenreBook: ( root, args ) => {

            if ( !args.genre ) return books

            return books.filter(book => book.genres.includes(args.genre))
        }
    },
    Mutation: {
         addBook: ( root, args ) => {

          console.log('addBook args: ', args)
            
            if ( books.find( book => book.title === args.title )){
                throw new GraphQLError('Title must be unique', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title
                    }
                })
            }
            
            const id = uuid()
            const book = { ...args, id }
            books = books.concat(book)
            return book
        },

        editAuthor: (root, args) => {

            console.log('editAuthor Args: ', args)

            const author = authors.find( a => a.name === args.name )
            console.log('Author: ', author)            

            if ( !author ) return null

            const updatedAuthor = {
                ...author,
                born: Number(args.born)
             }

             authors = authors.map( author => 
                author.name === args.name 
                ? updatedAuthor
                : author
            )

            console.log('Authors: ', authors)   

            return updatedAuthor
        }
    }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})