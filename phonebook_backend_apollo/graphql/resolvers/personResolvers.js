import Person from '../../models/Person.js'
import User from '../../models/User.js'
import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

// la comunicación ocurre usando el principio publicar-suscribir
const pubSub = new PubSub()

//con mongoose y apollo, 
// en Mongo el campo de ID de un objeto se llama _id y previamente se tuvo que hacer un trabajo para quitarl el _. Ahora GraphQL puede hacer esto automáticamente.
// las funciones de resolución ahora devuelven una promesa, cuando antes devolvían objetos normales. Cuando un resolutor devuelve una promesa, el servidor Apollo devuelve el valor al que se resuelve la promesa.
const personResolvers = {
    
    Query: {
        
        personCount: async() => Person.collection.countDocuments(),

        allPersons: async ( root, args ) => {

          if ( !args.phone ){
            return Person.find( { } ).populate( 'friendOf' )
          }

          return Person.find( {  phone : { $exists: args.phone === 'YES '} } ).populate( 'friendOf' )
        },

        findPerson: async ( root, args ) => Person.findOne( { name: args.name } ).populate( 'friendOf' )
    },
    
    Person: {
        address: ( { street, city }) => {       
            
            if (!street || !city ){
                return null
            }

            return {
                street,
                city
            }
        },
       //no es necesarioo ya que se agrego friendOf en el esquema de Person  
       /*  friendOf: async( root ) => {

            // se busca entre todos los objetos User los que tienen root._id (Person) en su lista de amigos
            const friends = await User.find( {
                friends: {
                    $in: [ root._id ]
                }
            })

            return friends
        }  */
    },

    Mutation: {

        addPerson: async ( root, args, context ) => {

            console.log('AddPerson Args: ', args)

            const person = new Person ( { ...args })

            const currentUser = context.currentUser
            console.log('Current user to add person: ', currentUser.username)
            
            if ( !currentUser ){
                throw new GraphQLError ('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            try {
                
                await person.save()

                currentUser.friends = currentUser.friends.concat (person)
                await currentUser.save()

                //Agregar una nueva persona publica una notificación sobre la operación a todos los suscriptores
                pubSub.publish('PERSON_ADDED', { personAdded: person } )
                
                return person

            } catch (error) {
                console.error('Error to add person')

                const validationErrors = Object.values(error.errors || {})
                .map(e => e.message)
                .join(', ')
                
                throw new GraphQLError(`Saving user failed ${ validationErrors }`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error: error.message
                    }
                })
            }
        },

        editNumber: async ( root, args ) => {

            console.log('EditNumber Args: ', args)

            const person = await Person.findOne( { name: args.name } )      
            person.phone = args.phone

            console.log('Person to edit: ', person)
            
            try {

                await person.save()
                return person
                
            } catch (error) {
                throw new GraphQLError('Editing number failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error: error.message
                    }
                } )
            }
        }
    },

    Subscription: {

       personAdded: {

        subscribe: () => pubSub.asyncIterableIterator( [ 'PERSON_ADDED' ] )
       } 
    }
}

export default personResolvers