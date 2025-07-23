import { mergeResolvers } from '@graphql-tools/merge'
import bookResolvers from './bookResolvers.js'
import authorResolvers from './authorResolvers.js'
import userResolvers from './userResolvers.js'

const resolvers = mergeResolvers([
    bookResolvers,
    authorResolvers,
    userResolvers
])

export default resolvers