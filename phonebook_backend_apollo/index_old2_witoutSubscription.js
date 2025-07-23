import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { MONGO_DB_URL, PORT } from './utils/config.js'
import typeDefs from './graphql/typeDefs/typeDefs.js'
import resolvers from './graphql/resolvers/resolvers.js'
import User from './models/User.js'

mongoose.set('strictQuery', false)

mongoose.connect(MONGO_DB_URL)
.then( () => {
  console.log('Connected to MongoDB')
})
.catch ( ( error ) => {
  console.error('Error connecting to MongoDB: ', error.message)  
})

const server = new ApolloServer({
    typeDefs,
    resolvers
})

//El objeto devuelto por el contexto se le da a todos los resolutores como su tercer parámetro. 
// El contexto es el lugar adecuado para hacer cosas que comparten varios resolutores, como identificación de usuario.
startStandaloneServer ( server, 
    { listen: { port: PORT }, 
    //contexto de autenticación en Apollo Server, lo cual es clave para manejar usuarios autenticados.
    context: async ( { req } ) => {
        
        const auth = req?.headers?.authorization

        console.log('Auth: ', auth)
        
        if ( auth && auth.startsWith('Bearer ')){
            const decodedToken = jwt.verify(
                auth.substring(7),
                process.env.JWT_SECRET
            )
            console.log('Decoded token: ', decodedToken)
            
            const currentUser = await User.findById( decodedToken.id ).populate('friends')
            console.log('currentUser: ', currentUser)

            return { currentUser }
        }

        return {}
    }    
}).then(  ( { url, subscriptionsUrl } ) => {
    console.log(`Server ready at ${ url } `)
})