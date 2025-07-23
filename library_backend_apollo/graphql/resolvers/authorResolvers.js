import Author from './../../models/Author.js'
import Book from '../../models/Book.js'
import { GraphQLError } from 'graphql'

const authorResolvers = {

  Query: {

        authorCount: async() => Author.collection.countDocuments(),

        allAuthors: async() => {

            return await Author.find( {} ).populate('books')
        }
    },

    Author: {

        //parent es el author
        bookCount: async( parent ) => {

            return await Book.countDocuments ( { author: parent._id } )
        }
    },

    Mutation: {
    
        addAuthor: async (root, args, { currentUser } ) => {

            console.log('Add author args: ', args)
            console.log('current user addAuthor: ', currentUser)

            if (!currentUser){
                throw new GraphQLError ('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            
            try {

                const author = new Author ( { ...args } )
                console.log('Author to add: ', author)

                return  await author.save()

            } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error: error.message
                    }
                })
            }
        },

        editAuthor: async (root, args, { currentUser } ) => {

            console.log('editAuthor Args: ', args)
            console.log('current user addAuthor: ', currentUser)

            if (!currentUser){
                throw new GraphQLError ('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const author = await Author.findOne( { name: args.name} )
            console.log('Author: ', author)            

            if ( !author ) return null

            author.born = args.born
            console.log('Author to edit: ', author)

            try {

                return await author.save()
                
            } catch (error) {
                 throw new GraphQLError('Editing born failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error: error.message
                    }
                })
            }
        }
    }
}

export default authorResolvers