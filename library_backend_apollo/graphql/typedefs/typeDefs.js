import { mergeTypeDefs } from '@graphql-tools/merge'
import bookTypeDefs from './bookTypeDefs.js'
import authorTypeDefs from './authorTypeDefs.js'
import baseTypeDefs from './baseTypeDefs.js'
import userTypeDefs from './userTypeDefs.js'

const typeDefs = mergeTypeDefs([
    baseTypeDefs,
    bookTypeDefs,
    authorTypeDefs,
    userTypeDefs
])

export default typeDefs