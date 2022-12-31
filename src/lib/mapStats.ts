import { bytesToSize } from 'lib/utils.ts'

// TODO add global lock time stats and replica set stats
export const getServerStatus = (info: Info) => ({
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
  ...'globalLock' in info && {
    ...'activeClients' in info.globalLock && {
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
    ...'currentQueue' in info.globalLock && {
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
  /* deprecated */ ...'backgroundFlushing' in info && {
    diskFlushes: {
      label: 'Disk Flushes',
      value: info.backgroundFlushing.flushes
    },
    lastFlush: {
      label: 'Last Flush',
      value: 'last_finished' in info.backgroundFlushing
        ? info.backgroundFlushing.last_finished.toDateString()
        : null
    },
    timeSpentFlushing: {
      label: 'Time Spent Flushing',
      value: 'total_ms' in info.backgroundFlushing
        ? `${info.backgroundFlushing.total_ms} ms`
        : null
    },
    averageFlushTime: {
      label: 'Average Flush Time',
      value: 'average_ms' in info.backgroundFlushing
        ? `${info.backgroundFlushing.average_ms} ms`
        : null
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

export const getDatabaseStats = (data: DbStats) => ({
  avgObjSize: {
    label: 'Avg Obj Size #',
    value: bytesToSize(data.avgObjSize || 0)
  },
  collections: {
    label: 'Collections (incl. system.namespaces)',
    value: data.collections
  },
  /* deprecated */ dataFileVersion: {
    label: 'Data File Version',
    value: 'dataFileVersion' in data
      ? `${data.dataFileVersion.major}.${data.dataFileVersion.minor}`
      : null
  },
  dataSize: {
    label: 'Data Size',
    value: bytesToSize(data.dataSize)
  },
  /* deprecated */ extentFreeListNum: {
    label: 'Extents Free List',
    value: 'extentFreeList' in data ? data.extentFreeList.num : null
  },
  /* deprecated */ fileSize: {
    label: 'File Size',
    value: 'fileSize' in data ? bytesToSize(data.fileSize) : null
  },
  indexes: {
    label: 'Indexes #',
    value: data.indexes
  },
  indexSize: {
    label: 'Index Size',
    value: bytesToSize(data.indexSize)
  },
  /* deprecated */ numExtents: {
    label: 'Extents #',
    value: 'numExtents' in data ? data.numExtents.toString() : null
  },
  objects: {
    label: 'Objects #',
    value: data.objects
  },
  storageSize: {
    label: 'Storage Size',
    value: bytesToSize(data.storageSize)
  }
})