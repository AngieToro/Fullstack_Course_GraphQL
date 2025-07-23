import ReactDOM from 'react-dom/client'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import App from './App'

const authLink = setContext ( (_, { headers } ) => {
  
  const token = localStorage.getItem('phonebook-app-token')
  console.log('Token: ', token)

  return {
    headers: {
      ...headers,
      authorization: token 
        ? `Bearer ${ token }`
        : null
    }
  }
})

const httpLink = new createHttpLink({
  uri: 'http://localhost:4000'
})

const wsLink = new GraphQLWsLink( createClient ({
  url: `ws://localhost:4000`,
  options: {
    reconnect: true
  }
}))

const splitLink = split(
  ( { query }) => {
    const definition = getMainDefinition( query )

    return (
      definition.kind === 'OperationDefinition' && 
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  //link: authLink.concat( httpLink )
  link: splitLink,
  connectToDevTools: true
})

console.log('Cache: ', client.cache.extract())

/* const query = gql`
  query {
    allPersons {
      id,  
      name,
      phone, 
      address {
        street,
        city
      }
    }
  }
`

client.query( { query } )
.then( (response ) => {
  console.log( 'Response query: ', response.data )
}) */  

ReactDOM.createRoot(document.getElementById('root')).render(
   <ApolloProvider client={ client }> 
    <App/>
  </ApolloProvider>
)