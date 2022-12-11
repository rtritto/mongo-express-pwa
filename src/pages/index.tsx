import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import Head from 'next/head.js'
import { RecoilRoot } from 'recoil'
// import nextConnect from 'next-connect'

// import { setConnection } from 'utils/db.mts'
import { setConnection } from 'middlewares/middlewareDb.mts'

// import middleware from 'middleware/database'

// const handler = nextConnect()

// handler.use(middleware)

const TableRowStyle = {
  // '&:last-child td, &:last-child th': { border: 0 },
  '&:nth-of-type(odd)': {
    backgroundColor: "white"
  },
  '&:nth-of-type(even)': {
    backgroundColor: "grey"
  }
}

const TableCellStyle = {
  border: 1
}

const mapMongoDBInfoForTable = (info: ReturnType<typeof mapMongoDBInfo>) => [
  [
    { id: 'dbHost', name: 'Hostname', value: info.host },
    { id: 'dbVersion', name: 'MongoDB Version', value: info.version.DBVersion }
  ],
  [
    { id: 'uptime', name: 'Uptime', value: `${info.uptime > 86400 ? `${Math.floor(info.uptime / 86400)} days` : `${info.uptime} seconds`}` },
    { id: 'nodeVersion', name: 'Node Version', value: info.version.node }
  ],
  [
    { id: 'serverTime', name: 'Server Time', value: new Date(info.localTime).toDateString() },
    { id: 'v8Version', name: 'V8 Version', value: info.version.v8 }
  ],
  [{}, {}],
  [
    { id: 'currentConnections', name: 'Current Connections', value: info.connections.current },
    { id: 'availableConnections', name: 'Available Connections', value: info.connections.available }
  ],
  [
    { id: 'activeClients', name: 'Active Clients', value: info.globalLock.activeClients?.total },
    { id: 'queuedOperations', name: 'Queued Operations', value: info.globalLock.currentQueue?.total }
  ],
  [
    { id: 'clientsReading', name: 'Clients Reading', value: info.globalLock.activeClients?.readers },
    { id: 'clientsWriting', name: 'Clients Writing', value: info.globalLock.activeClients?.writers }
  ],
  [
    { id: 'readLockQueue', name: 'Read Lock Queue', value: info.globalLock.currentQueue?.readers },
    { id: 'writeLockQueue', name: 'Write Lock Queue', value: info.globalLock.currentQueue?.writers }
  ],
  [{}, {}],
  [
    { id: 'diskFlushes', name: 'Disk Flushes', value: info.backgroundFlushing.flushes },
    { id: 'lastFlush', name: 'Last Flush', value: info.backgroundFlushing.last_finished && new Date(info.backgroundFlushing.last_finished).toDateString() }
  ],
  [
    { id: 'timeSpentFlushing', name: 'Time Spent Flushing', value: info.backgroundFlushing.total_ms && `${info.backgroundFlushing.total_ms} ms` },
    { id: 'averageFlushTime', name: 'Average Flush Time', value: info.backgroundFlushing.average_ms && `${info.backgroundFlushing.average_ms} ms` }
  ],
  [{}, {}],
  [
    { id: 'totalInserts', name: 'Total Inserts', value: info.opcounters.insert },
    { id: 'totalQueries', name: 'Total Queries', value: info.opcounters.query }
  ],
  [
    { id: 'totalUpdates', name: 'Total Updates', value: info.opcounters.update },
    { id: 'totalDeletes', name: 'Total Deletes', value: info.opcounters.delete }
  ]
]

const mapMongoDBInfo = (info: Info) => ({
  backgroundFlushing: {
    ...info.backgroundFlushing && {
      average_ms: info.backgroundFlushing.average_ms,
      flushes: info.backgroundFlushing.flushes,
      last_finished: info.backgroundFlushing.last_finished,
      total_ms: info.backgroundFlushing.total_ms
    }
  },
  connections: {
    available: info.connections.available,
    current: info.connections.current
  },
  globalLock: {
    ...info.globalLock?.activeClients && {
      activeClients: {
        readers: info.globalLock.activeClients.readers,
        total: info.globalLock.activeClients.total
      }
    },
    ...info.globalLock?.currentQueue && {
      currentQueue: {
        total: info.globalLock.currentQueue.total,
        writers: info.globalLock.currentQueue.writers
      }
    }
  },
  host: info.host,
  localTime: JSON.parse(JSON.stringify(info.localTime)),
  opcounters: {
    delete: info.opcounters.delete,
    insert: info.opcounters.insert,
    query: info.opcounters.query,
    update: info.opcounters.update
  },
  uptime: info.uptime,
  version: {
    DBVersion: info.version,
    node: process.versions.node,
    v8: process.versions.v8
  }
})

const DenseTable = ({ rows }: { rows: ReturnType<typeof mapMongoDBInfoForTable> }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="a dense table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`row${index}`} sx={TableRowStyle}>
              <TableCell sx={TableCellStyle} align="right"><strong>{row[0].name}</strong></TableCell>
              <TableCell sx={TableCellStyle} id={row[0].id}>{row[0].value}</TableCell>
              {/* {row.at(1) && [ */}
              <TableCell sx={TableCellStyle} align="right"><strong>{row[1].name}</strong></TableCell>
              <TableCell sx={TableCellStyle} id={row[1].id}>{row[1].value}</TableCell>
              {/* ]} */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Index = ({ info }: { info?: ReturnType<typeof mapMongoDBInfo> }) => {
  return (
    <div>
      <Head>
        <title>Home - Mongo Express</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>
      <RecoilRoot
        key="initInfo"
      // initializeState={({ set }) => {

      // }}
      >
        <Container>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {info ? <DenseTable rows={mapMongoDBInfoForTable(info)} /> : [
                <h2>Server Status</h2>,
                <p>Turn on admin in config.js to view server stats!</p>
              ]}
            </Typography>
          </Box>
        </Container>
      </RecoilRoot>
    </div>
  )
}

export async function getServerSideProps() {
  const mongodb = setConnection()

  if (mongodb.adminDb) {
    const rawInfo = mongodb.adminDb && await mongodb.adminDb.serverStatus()
    const info = mapMongoDBInfo(rawInfo)

    return {
      props: {
        info
      }
    }
  }

  return { props: {} }
}

export default Index