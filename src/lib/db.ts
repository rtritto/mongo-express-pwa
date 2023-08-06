import { MongoClient } from 'mongodb'

import type { Db } from 'mongodb'
import type { Config, MongoDb } from 'config.default.mts'

// const { config } = process.env

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// let mongoClient: MongoClient
//  = global.mongo

const getDatabases = () => { return Object.keys(global._mongo.connections).sort() }

export const updateCollections = async (dbConnection: Connection) => {
  if (!dbConnection.fullName) {
    console.error('Received db instead of db connection')
    return /* [] */
  }
  const collections = await dbConnection.db.listCollections().toArray()
  const names = []
  for (const collection of collections) {
    names.push(collection.name)
  }
  global._mongo.collections[dbConnection.fullName] = names.sort()
  // return collections
}

const addConnection = (info: ClientInfo, db: Db, dbName: string): Connection => {
  const fullName = global._mongo.clients.length > 1
    ? `${info.connectionName}_${dbName}`
    : dbName
  const connection = {
    info,
    dbName,
    fullName,
    db
  }
  global._mongo.connections[fullName] = connection
  return connection
}

const updateDatabases = async () => {
  global._mongo.connections = {}
  global._mongo.collections = {}
  await Promise.all(
    global._mongo.clients.map(async (clientInfo: ClientInfo) => {
      if (clientInfo.adminDb) {
        const allDbs = await clientInfo.adminDb.listDatabases()
        for (const database of allDbs.databases) {
          const dbName = database.name
          if (dbName) {
            if (clientInfo.info.whitelist.length > 0 && !clientInfo.info.whitelist.includes(dbName)) {
              continue
            }

            if (clientInfo.info.blacklist.length > 0 && clientInfo.info.blacklist.includes(dbName)) {
              continue
            }
            const connection = addConnection(clientInfo, clientInfo.client.db(dbName), dbName)
            // eslint-disable-next-line no-await-in-loop
            await updateCollections(connection)
          }
        }
      } else {
        const dbConnection = clientInfo.client.db()
        const dbName = dbConnection.databaseName
        const connection = addConnection(clientInfo, dbConnection, dbName)
        await updateCollections(connection)
      }
      global._mongo.databases = getDatabases()
    })
  )
}

export const connectClient = async (config: Config = process.env.config) => {
  if (global._mongo !== undefined) {
    await updateDatabases()
    await Promise.all(
      Object.values(global._mongo.connections).map((connection) => updateCollections(connection))
    )
    return global._mongo.client
  }
  // database connections
  const connections = Array.isArray(config.mongodb) ? config.mongodb : [config.mongodb]
  global._mongo = {} as Mongo
  global._mongo.clients = await Promise.all(connections.map(async (connectionInfo: MongoDb, index: number) => {
    const {
      connectionString, connectionName, admin, connectionOptions,
    } = connectionInfo
    try {
      const client = await MongoClient.connect(connectionString, connectionOptions)
      const adminDb = admin ? client.db().admin() : null
      return {
        adminDb,
        client,
        connectionName: connectionName || `connection${index}`,
        info: connectionInfo
      }
    } catch (error) {
      console.error(`Could not connect to database using connectionString: ${connectionString.replace(/(mongo.*?:\/\/.*?:).*?@/, '$1****@')}"`)
      throw error
    }
  }))
  if (global._mongo.mainClient === undefined) {
    const [client] = global._mongo.clients
    global._mongo.mainClient = client
    global._mongo.adminDb = client.adminDb
    global._mongo.client = client.client
  }
  await updateDatabases()

  return global._mongo.client
}