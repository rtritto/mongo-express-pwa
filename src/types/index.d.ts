type Admin = import('mongodb').Admin
/**
 * @public
 * @see https://docs.mongodb.org/manual/reference/command/collStats
 */
type CollStats = import('mongodb').CollStats
type Document = import('mongodb').Document
type Db = import('mongodb').Db
type MongoClient = import('mongodb').MongoClient

/**
 * Type definition is missing in mongodb
 * @see https://www.mongodb.com/docs/manual/reference/command/serverStatus
 */
type ServerStatus = Document & {
  host: string
  version: string
  uptime: number
  localTime: Date
  connections: {
    current: number
    available: number
  }
  globalLock: {
    activeClients: {
      readers: number
      total: number
      writers: number
    }
    currentQueue: {
      readers: number
      total: number
      writers: number
    }
  }
  opcounters: {
    insert: number
    query: number
    update: number
    delete: number
  }
  // missing in doc, are they deprecated?
  backgroundFlushing: {
    flushes: number
    last_finished: Date
    total_ms: number
    average_ms: number
  }
}

/**
 * Type definition is missing in mongodb
 * @see https://www.mongodb.com/docs/manual/reference/command/dbStats
 */
type DbStats = Document & {
  db: string
  collections: number
  view: number
  objects: number
  avgObjSize: number // float
  dataSize: number
  storageSize: number
  freeStorageSize: number
  indexes: number
  indexSize: number
  indexFreeStorageSize: number
  totalSize: number
  totalFreeStorageSize: number
  scaleFactor: number
  fsUsedSize: number
  fsTotalSize: number
  ok: number
  // missing in doc, are they deprecated?
  fileSize: number
  dataFileVersion: {
    major: number
    minor: number
  }
  extentFreeList: {
    num: number
  }
  numExtents: number
}

type Index = {
  v: number
  key: {
    [name: string]: number
  }
  name: string
  size: number
}

type Indexes = Array<Index>

type Fields = {
  [field: string]: {
    label: string
    value: string | undefined
  }
}

// type of connections<connectionInfo> or clients<{info}>
type ClientInfo = {
  connectionName: string
  client: MongoClient
  adminDb: Admin | null
  info: import('config.default.mts').MongoDb
}

type Collections = {
  [dbName: string]: Array<string>
}

type Connection = {
  info: ClientInfo
  dbName: string
  fullName: string
  db: Db
}

type Connections = {
  [key: string]: Connection
}

type Mongo = {
  clients: Array<ClientInfo>
  collections: Collections
  connections: Connections
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