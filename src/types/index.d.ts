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
    value: string | null
  }
}

// type of connections<connectionInfo> or clients<{info}>
interface ClientInfo {
  connectionName: string
  client: import('mongodb').MongoClient
  adminDb: import('mongodb').Admin | undefined
  info: import('config.default.mts').MongoDb
}


interface Connection {
  info: ClientInfo
  dbName: string
  fullName: string
  db: import('mongodb').Db
}