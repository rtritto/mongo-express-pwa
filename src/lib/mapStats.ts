import { bytesToSize } from 'lib/utils.ts'

// TODO add global lock time stats and replica set stats
export const mapServerStatus = (serverStatus: ServerStatus) => ({
  dbHost: {
    label: 'Hostname',
    value: serverStatus.host
  },
  dbVersion: {
    label: 'MongoDB Version',
    value: serverStatus.version
  },
  uptime: {
    label: 'Uptime',
    value: `${serverStatus.uptime} seconds ${serverStatus.uptime > 86400
      ? `(${Math.floor(serverStatus.uptime / 86400)} days)`
      : ''}`
  },
  nodeVersion: {
    label: 'Node Version',
    value: process.versions.node
  },
  serverTime: {
    label: 'Server Time',
    value: serverStatus.localTime.toUTCString()
  },
  v8Version: {
    label: 'V8 Version',
    value: process.versions.v8
  },
  currentConnections: {
    label: 'Current Connections',
    value: serverStatus.connections.current
  },
  availableConnections: {
    label: 'Available Connections',
    value: serverStatus.connections.available
  },
  ...'globalLock' in serverStatus && {
    ...'activeClients' in serverStatus.globalLock && {
      activeClients: {
        label: 'Active Clients',
        value: serverStatus.globalLock.activeClients.total
      },
      clientsReading: {
        label: 'Clients Reading',
        value: serverStatus.globalLock.activeClients.readers
      },
      clientsWriting: {
        label: 'Clients Writing',
        value: serverStatus.globalLock.activeClients.writers
      }
    },
    ...'currentQueue' in serverStatus.globalLock && {
      queuedOperations: {
        label: 'Queued Operations',
        value: serverStatus.globalLock.currentQueue.total
      },
      readLockQueue: {
        label: 'Read Lock Queue',
        value: serverStatus.globalLock.currentQueue.readers
      },
      writeLockQueue: {
        label: 'Write Lock Queue',
        value: serverStatus.globalLock.currentQueue.writers
      }
    }
  },
  /* deprecated */ ...'backgroundFlushing' in serverStatus && {
    diskFlushes: {
      label: 'Disk Flushes',
      value: serverStatus.backgroundFlushing.flushes
    },
    lastFlush: {
      label: 'Last Flush',
      value: 'last_finished' in serverStatus.backgroundFlushing
        ? serverStatus.backgroundFlushing.last_finished.toDateString()
        : null
    },
    timeSpentFlushing: {
      label: 'Time Spent Flushing',
      value: 'total_ms' in serverStatus.backgroundFlushing
        ? `${serverStatus.backgroundFlushing.total_ms} ms`
        : null
    },
    averageFlushTime: {
      label: 'Average Flush Time',
      value: 'average_ms' in serverStatus.backgroundFlushing
        ? `${serverStatus.backgroundFlushing.average_ms} ms`
        : null
    }
  },
  totalInserts: {
    label: 'Total Inserts',
    value: serverStatus.opcounters.insert
  },
  totalQueries: {
    label: 'Total Queries',
    value: serverStatus.opcounters.query
  },
  totalUpdates: {
    label: 'Total Updates',
    value: serverStatus.opcounters.update
  },
  totalDeletes: {
    label: 'Total Deletes',
    value: serverStatus.opcounters.delete
  }
})

export const mapDatabaseStats = (dbStats: DbStats) => ({
  avgObjSize: {
    label: 'Avg Obj Size #',
    value: bytesToSize(dbStats.avgObjSize || 0)
  },
  collections: {
    label: 'Collections (incl. system.namespaces)',
    value: dbStats.collections
  },
  /* deprecated */ dataFileVersion: {
    label: 'Data File Version',
    value: 'dataFileVersion' in dbStats
      ? `${dbStats.dataFileVersion.major}.${dbStats.dataFileVersion.minor}`
      : null
  },
  dataSize: {
    label: 'Data Size',
    value: bytesToSize(dbStats.dataSize)
  },
  /* deprecated */ extentFreeListNum: {
    label: 'Extents Free List',
    value: 'extentFreeList' in dbStats ? dbStats.extentFreeList.num : null
  },
  /* deprecated */ fileSize: {
    label: 'File Size',
    value: 'fileSize' in dbStats ? bytesToSize(dbStats.fileSize) : null
  },
  indexes: {
    label: 'Indexes #',
    value: dbStats.indexes
  },
  indexSize: {
    label: 'Index Size',
    value: bytesToSize(dbStats.indexSize)
  },
  /* deprecated */ numExtents: {
    label: 'Extents #',
    value: 'numExtents' in dbStats ? dbStats.numExtents.toString() : null
  },
  objects: {
    label: 'Objects #',
    value: dbStats.objects
  },
  storageSize: {
    label: 'Storage Size',
    value: bytesToSize(dbStats.storageSize)
  }
})