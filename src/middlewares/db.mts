import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb'

import type { Config, MongoDb } from 'config.default.mts'
// const { config } = process.env

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// let connectionData = global.mongo

// if (!connectionData) {
// connectionData = 
global.mongo = {
  // mainClient: {},
  clients: [],
  // connections: {},
  // collections: {},
  // update the collections list
  getDatabases() { return Object.keys(this.connections).sort() },
  async updateCollections(dbConnection: Connection) {
    if (!dbConnection.fullName) {
      console.error('Received db instead of db connection')
      return /* [] */
    }
    const collections = await dbConnection.db.listCollections().toArray()
    const names = []
    for (const collection of collections) {
      names.push(collection.name)
    }
    this.collections[dbConnection.fullName] = names.sort()
    // return collections
  },
  // update database list
  addConnection(info: ClientInfo, db: Db, dbName: string): Connection {
    const fullName = this.clients.length > 1
      ? `${info.connectionName}_${dbName}`
      : dbName
    const newConnection = {
      info,
      dbName,
      fullName,
      db
    }
    this.connections[fullName] = newConnection
    return newConnection
  },
  async updateDatabases() {
    this.connections = {}
    this.collections = {}
    await Promise.all(
      this.clients.map(async (clientInfo: ClientInfo) => {
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
              const connection = this.addConnection(clientInfo, clientInfo.client.db(dbName), dbName)
              // eslint-disable-next-line no-await-in-loop
              await this.updateCollections(connection)
            }
          }
        } else {
          const dbConnection = clientInfo.client.db()
          const dbName = dbConnection.databaseName
          const connection = this.addConnection(clientInfo, dbConnection, dbName)
          await this.updateCollections(connection)
        }
      })
    )
  },
  async connect(config: Config) {
    // if (connectionData) {
    //   return connectionData
    // }

    // database connections
    const connections = Array.isArray(config.mongodb) ? config.mongodb : [config.mongodb]
    this.clients = await Promise.all(connections.map(async (connectionInfo: MongoDb, index: number) => {
      const {
        connectionString, connectionName, admin, connectionOptions,
      } = connectionInfo
      try {
        const client = await MongoClient.connect(connectionString, connectionOptions)
        const adminDb = admin ? client.db().admin() : undefined
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
    if (!this.mainClient) {
      const [client] = this.clients
      this.mainClient = client
    }
    await this.updateDatabases()
    return this
  }
}
// }