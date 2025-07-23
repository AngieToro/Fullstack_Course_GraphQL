import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { secret } from '../../utils/config.js'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'

const userResolvers = {

    Query: {
        userCount: async() => User.collection.countDocuments(),

        allUser: async ( root, args, context ) => {

          return User.find()
        },

        me: ( root, args, context ) => {

            return context.currentUser
        }
    },

     Mutation: {

        createUser: async( root, args ) => {

            console.log('createUser Args: ', args)
            
            try {

                const saltRounds = 10
                const passwordHash = await bcrypt.hash(args.password, saltRounds)

                const user = new User( { 
                    username: args.username,
                    passwordHash,
                    favoriteGenre: args.favoriteGenre
                } )
                console.log('User to add: ', user)

                await user.save()

                return user
                
            } catch (error) {
                throw new GraphQLError('Creating the user failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },

        login: async( root, args ) => {


            console.log('login Args: ', args)

            const user = await User.findOne( { username: args.username } )
            console.log('Login user: ', user)

            if ( !user ){
                throw new GraphQLError('Wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const passwordCorrect = await bcrypt.compare(args.password, user.passwordHash) 
            console.log('Password comparation: ', passwordCorrect)

            if ( !passwordCorrect ){
                throw new GraphQLError('Wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userToken = {
                username: user.username,
                id: user._id
            }

            const token = jwt.sign( userToken, secret )
            console.log('Token: ', token)
            
            return { value:  token }
        }
     }
}

export default userResolvers