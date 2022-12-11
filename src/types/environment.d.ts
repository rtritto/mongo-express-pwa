import type { Admin } from 'mongodb'

export { }

declare global {
  var mongo: {
    clients: Array<ClientInfo>
    collections?: Object<string, Array<string>>
    connections?: Object<string, Array<Connection>>
    // gridFSBuckets?
    mainClient?: {
      adminDb?: Admin | undefined
    }
    getDatabases?: () => Array<string>
    updateCollections: (dbConnection: Connection) => Promise<void>
    updateDatabases: () => Promise<void>
  }
}