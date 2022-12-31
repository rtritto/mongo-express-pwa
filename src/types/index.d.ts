type Admin = import('mongodb').Admin
type MongoClient = import('mongodb').MongoClient
type Document = import('mongodb').Document
type Db = import('mongodb').Db

// https://www.mongodb.com/docs/manual/reference/command/serverStatus
type Info = Document & {
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
  // deprecated
  backgroundFlushing: {
    flushes: number
    last_finished: Date
    total_ms: number
    average_ms: number
  }
}

// https://www.mongodb.com/docs/manual/reference/command/dbStats
interface DbStats extends Document {
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
  // deprecated from some MongoDB versions
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

interface Fields {
  [field: string]: {
    label: string
    value: string | null
  }
}

// type of connections<connectionInfo> or clients<{info}>
interface ClientInfo {
  connectionName: string
  client: MongoClient
  adminDb: Admin | null
  info: import('config.default.mts').MongoDb
}

interface Collections {
  [dbName: string]: Array<string>
}

interface Connection {
  info: ClientInfo
  dbName: string
  fullName: string
  db: Db
}

interface Connections {
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