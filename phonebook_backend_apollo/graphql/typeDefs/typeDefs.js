import { mergeTypeDefs } from '@graphql-tools/merge'
import  personTypeDefs from './personTypeDefs.js'
import userTypeDefs from './userTypeDefs.js'

const typeDefs = mergeTypeDefs([
    personTypeDefs,
    userTypeDefs
])

export default typeDefs