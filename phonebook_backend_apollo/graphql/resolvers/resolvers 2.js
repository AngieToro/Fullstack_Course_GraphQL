import { mergeResolvers } from '@graphql-tools/merge'
import personResolvers from './personResolvers.js'
import userResolvers from './userResolvers.js'

const resolvers = mergeResolvers([
    personResolvers,
    userResolvers
])

export default resolvers