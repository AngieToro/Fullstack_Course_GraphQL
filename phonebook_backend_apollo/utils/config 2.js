import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT

export const HOST = process.env.HOST

const userDB = process.env.MONGO_DB_USER
console.log('User: ', userDB)

const nameDB = process.env.MONGO_DB_NAME
console.log('DB: ', nameDB)

const clusterDB = process.env.MONGO_DB_CLUSTER
console.log('Cluster: ', clusterDB)

const passwordDB = process.env.MONGO_DB_PASSWORD
console.log('Password: ', passwordDB)

export const MONGO_DB_URL = `mongodb+srv://${ userDB }:${ passwordDB }@${ clusterDB }/${ nameDB }?retryWrites=true&w=majority`

export const secret = process.env.JWT_SECRET