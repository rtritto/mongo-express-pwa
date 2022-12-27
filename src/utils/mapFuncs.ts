import * as validators from 'utils/validations.ts'

// TODO add global lock time stats and replica set stats
export const mapMongoDBInfoForTable = (info: Info) => ({
  dbHost: {
    label: 'Hostname',
    value: info.host
  },
  dbVersion: {
    label: 'MongoDB Version',
    value: info.version
  },
  uptime: {
    label: 'Uptime',
    value: `${info.uptime} seconds ${info.uptime > 86400
      ? `(${Math.floor(info.uptime / 86400)} days)`
      : ''}`
  },
  nodeVersion: {
    label: 'Node Version',
    value: process.versions.node
  },
  serverTime: {
    label: 'Server Time',
    value: info.localTime.toUTCString()
  },
  v8Version: {
    label: 'V8 Version',
    value: process.versions.v8
  },
  currentConnections: {
    label: 'Current Connections',
    value: info.connections.current
  },
  availableConnections: {
    label: 'Available Connections',
    value: info.connections.available
  },
  ...info.globalLock && {
    ...info.globalLock.activeClients && {
      activeClients: {
        label: 'Active Clients',
        value: info.globalLock.activeClients.total
      },
      clientsReading: {
        label: 'Clients Reading',
        value: info.globalLock.activeClients.readers
      },
      clientsWriting: {
        label: 'Clients Writing',
        value: info.globalLock.activeClients.writers
      }
    },
    ...info.globalLock.currentQueue && {
      queuedOperations: {
        label: 'Queued Operations',
        value: info.globalLock.currentQueue.total
      },
      readLockQueue: {
        label: 'Read Lock Queue',
        value: info.globalLock.currentQueue.readers
      },
      writeLockQueue: {
        label: 'Write Lock Queue',
        value: info.globalLock.currentQueue.writers
      }
    }
  },
  ...info.backgroundFlushing && {
    diskFlushes: {
      label: 'Disk Flushes',
      value: info.backgroundFlushing.flushes
    },
    lastFlush: {
      label: 'Last Flush',
      value: info.backgroundFlushing.last_finished && info.backgroundFlushing.last_finished.toDateString()
    },
    timeSpentFlushing: {
      label: 'Time Spent Flushing',
      value: info.backgroundFlushing.total_ms && `${info.backgroundFlushing.total_ms} ms`
    },
    averageFlushTime: {
      label: 'Average Flush Time',
      value: info.backgroundFlushing.average_ms && `${info.backgroundFlushing.average_ms} ms`
    }
  },
  totalInserts: {
    label: 'Total Inserts',
    value: info.opcounters.insert
  },
  totalQueries: {
    label: 'Total Queries',
    value: info.opcounters.query
  },
  totalUpdates: {
    label: 'Total Updates',
    value: info.opcounters.update
  },
  totalDeletes: {
    label: 'Total Deletes',
    value: info.opcounters.delete
  }
})

export const getCtx = (data, dbName: string) => ({
  databases: global.req.databases,
  colls: global.req.collections[dbName],
  // TODO
  // grids: global.req.gridFSBuckets[dbName],
  stats: {
    avgObjSize: {
      label: 'Avg Obj Size #',
      value: validators.bytesToSize(data.avgObjSize || 0)
    },
    collections: {
      label: 'Collections (incl. system.namespaces)',
      value: data.collections
    },
    dataFileVersion: {
      label: 'Data File Version',
      value: data.dataFileVersion
        ? `${data.dataFileVersion.major}.${data.dataFileVersion.minor}`
        : null
    },
    dataSize: {
      label: 'Data Size',
      value: validators.bytesToSize(data.dataSize)
    },
    extentFreeListNum: {
      label: 'Extents Free List',
      value: data.extentFreeList ? data.extentFreeList.num : null
    },
    fileSize: {
      label: 'File Size',
      value: data.fileSize === undefined
        ? null
        : validators.bytesToSize(data.fileSize)
    },
    indexes: {
      label: 'Indexes #',
      value: data.indexes
    },
    indexSize: {
      label: 'Index Size',
      value: validators.bytesToSize(data.indexSize)
    },
    numExtents: {
      label: 'Extents #',
      value: data.numExtents ? data.numExtents.toString() : null
    },
    objects: {
      label: 'Objects #',
      value: data.objects
    },
    storageSize: {
      label: 'Storage Size',
      value: validators.bytesToSize(data.storageSize)
    }
  }
})