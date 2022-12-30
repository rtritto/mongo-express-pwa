// import type { MongoDb } from 'config.default.mts'
// import type { Db as MongoDbDb } from 'mongodb'
// export declare type Db = MongoDbDb
// import type { MongoClient } from 'mongodb';

// class Db from import('mongodb').Db { }

// declare class Db extends import('mongodb').Db { }

// Db = typeof import('mongodb').Db

// interface ConnectionInfo {
//   connectionString
//   connectionName
//   admin
//   connectionOptions
//   blacklist: Array<string>
//   whitelist: Array<string>
// }

declare type Info = import('mongodb').Document

declare interface Fields {
  [key: string]: {
    label: string
    value: string | false
  }
}

// type of connections<connectionInfo> or clients<{info}>
interface ClientInfo {
  connectionName: string
  client: import('mongodb').MongoClient
  adminDb: import('mongodb').Admin | null
  info: import('config.default.mts').MongoDb
}


interface Connection {
  info: ClientInfo
  dbName: string
  fullName: string
  db: import('mongodb').Db
}

declare type Mongo = {
  clients: Array<ClientInfo>
  collections: Object<string, Array<string>>
  connections: Object<string, Array<Connection>>
  databases: Array<string>
  // gridFSBuckets?  TODO
  mainClient: ClientInfo | null
  adminDb: ClientInfo['adminDb'] | null
  addConnection: (info: ClientInfo, db: Db, dbName: string) => Connection
  getDatabases: () => Array<string>
  updateCollections: (dbConnection: Connection) => Promise<void>
  updateDatabases: () => Promise<void>
  connect: (config: Config) => Promise<Mongo>
}