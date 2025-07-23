import { createServer } from 'http'
import express from 'express'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { useServer } = require('./utils/graphqlWsUseServer.cjs')
import { WebSocketServer } from 'ws'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { MONGO_DB_URL, PORT, HOST } from './utils/config.js'
import typeDefs from './graphql/typedefs/typeDefs.js'
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

const start = async() => {

    const app = express()
    const httpServer = createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })

    const serverCleanup = useServer(
        { schema: makeExecutableSchema({ typeDefs, resolvers }) },
        wsServer
    )

    const schema = makeExecutableSchema({ typeDefs, resolvers })

    const apolloServer = new ApolloServer({
        schema,
        plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }),
             {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        }
                    }
                }
            }       
        ]
    })

    await apolloServer.start()

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }) => {
            try {
                const auth = req?.headers?.authorization
                console.log('Auth: ', auth)
                console.log('-----------------------------')

                if (auth && auth.startsWith('Bearer ')) {
                    const token = auth.substring(7)
                    console.log('Token:', token)
                    console.log('-----------------------------')

                    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
                    console.log('Decoded Token:', decodedToken)
                    console.log('-----------------------------')

                    const currentUser = await User.findById( decodedToken.id )
                    console.log('Current User:', currentUser.username)
                    console.log('-----------------------------')

                    return { currentUser }
                }
            } catch (error) {
                console.error('Token error: ', error.message)
            }

            return {}
            }
        })
    )

    httpServer.listen(PORT, () => {
        const url = `http://${HOST}:${PORT}`
        const wsUrl = `ws://${HOST}:${PORT}`

        console.log(`Server ready at ${url}`)
        console.log(`Subscriptions ready at ${wsUrl}`)
    })
}

start()