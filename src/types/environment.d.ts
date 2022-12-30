import type { Admin } from 'mongodb'

// import type config from 'config.default.mts'
import { setConnection } from 'middlewares/connection.mts'

export { }

declare type ReqType = ReturnType<typeof setConnection>

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      config: import('config.default.mts')
    }
  }
  var mongo: {
    clients: Array<ClientInfo>
    collections?: Object<string, Array<string>>
    connections?: Object<string, Array<Connection>>
    // gridFSBuckets?
    mainClient?: {
      adminDb?: Admin | undefined
    }
    addConnection: (info: ClientInfo, db: Db, dbName: string) => Connection
    getDatabases: () => Array<string>
    updateCollections: (dbConnection: Connection) => Promise<void>
    updateDatabases: () => Promise<void>
    connect: (config: Config) => Promise  // TODO globalThis.mongo not work
  }
  var req: ReqType
  var session: {
    messageError?: string
    messageSuccess?: string
  }
}