import Book from './../../models/Book.js'
import Author from '../../models/Author.js'
import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

const bookResolvers = {

  Query: {

        bookCount: async() => Book.collection.countDocuments(),

        allBooks: async( ) => {
            
            return await Book.find( {} ).populate('author')
        },

        findGenreBook: async( root, args ) => {

            if ( !args.genre ) return await Book.find( {} ).populate('author')

            return await Book.find( { genres: { $in: [ args.genre ] } } ).populate('author')
        },

        allBooksAuthor: async( root, args ) => {

            console.log('findAuthorBook args: ', args)
            
            if ( !args.author ) return await Book.find( {} ).populate('author')

            const author = await Author.findOne( { name: args.author } )
            console.log('Author: ', author)
            
            if (!author) return []

            const book = await Book.find( { author: author._id}).populate('author')
            console.log('book: ', book)
            
            return book
        } 
    },
    
    Mutation: {

         addBook: async ( root, args, { currentUser } ) => {

            console.log('addBook args: ', args)

            if (!currentUser){
                throw new GraphQLError ('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
          
            try {

                const author = await Author.findOne( { name: args.author } )
                console.log('author exits? ', author)

                if ( !author ){
                    throw new GraphQLError('Author does not exits', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.title
                        }
                    })
                }
            
                const book = new Book( { 
                    title: args.title,
                    published: args.published,
                    genres: args.genres,
                    author: author._id
                } )
        
                const newBook = await book.save()
                console.log('Book to add: ', newBook)

                const populatedBook = await newBook.populate('author')
                pubSub.publish('BOOK_ADDED', { bookAdded: populatedBook } )
              
                return populatedBook

            } catch (error) {
                console.error('Error to add person')

                const validationErrors = Object.values(error.errors || {})
                    .map(e => e.message)
                    .join(', ')
                
                throw new GraphQLError(`Saving book failed ${ validationErrors }`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error: error.message
                    }
                })
            }
        }
    },

    Subscription: {
        
        bookAdded: {
            
            subscribe: () =>  {
                 console.log('Subscription bookAdded pubSub')
                 return pubSub.asyncIterableIterator(['BOOK_ADDED'])
            }
        }
    }
}

export default bookResolvers
