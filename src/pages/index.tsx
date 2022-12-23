import { Box, Container, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Head from 'next/head.js'

import ShowDatabases from 'components/ShowDatabases/index.tsx'
import { mapMongoDBInfo, mapMongoDBInfoForTable } from 'utils/mapFuncs.ts'

const TableCellStyle = {
  // border: 1,
  padding: 0.8
}

const DenseTable = ({ rows }: { rows: ReturnType<typeof mapMongoDBInfoForTable> }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ px: 1.5, py: 1 }}>
          <TableRow style={{ backgroundColor: '#616161' }}>
            <TableCell sx={TableCellStyle} colSpan={4}>
              <Box margin={0.5}>
                <Typography component='h6' sx={{ fontWeight: 'bold' }} variant='h6'>
                  Server Status
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`row${index}`}>
              {row.length > 0
                ? row.map((cell) => [
                  <TableCell key={`cellName${index}`} sx={TableCellStyle}>
                    <strong>{cell.name}</strong>
                  </TableCell>,
                  <TableCell key={`cellValue${index}`} sx={TableCellStyle} id={cell.id}>
                    {cell.value}
                  </TableCell>
                ])
                : <TableCell key={`cellEmpty${index}`} sx={TableCellStyle} colSpan={4} />
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface IndexProps {
  databases: string[]
  noDelete: boolean
  readOnly: boolean
  stats?: ReturnType<typeof mapMongoDBInfo>
}

const Index = ({ databases, noDelete, readOnly, stats }: IndexProps) => {
  return (
    <div>
      <Head>
        <title>Home - Mongo Express</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        <Typography component="h4" gutterBottom variant="h4">Mongo Express</Typography>

        <Divider sx={{ border: 1, my: 1.5 }} />

        <ShowDatabases
          databases={databases}
          showCreateDb={readOnly === false}
          showDeleteDatabases={noDelete === false && readOnly === false}
        />

        <Box sx={{ my: 2 }}>
          {stats ? <DenseTable rows={mapMongoDBInfoForTable(stats)} /> : (
            <>
              <Typography component="h4" gutterBottom variant="h4">Server Status</Typography>

              <Typography>Turn on admin in <b>config.js</b> to view server stats!</Typography>
            </>
          )}
        </Box>
      </Container>
    </div>
  )
}

export async function getServerSideProps() {
  const { options: { noDelete, readOnly } } = process.env.config
  const { databases } = global.req

  if (global.req.adminDb) {
    const rawInfo = await global.req.adminDb.serverStatus()
    const stats = mapMongoDBInfo(rawInfo)
    // global.stats = stats

    return {
      props: {
        databases,
        noDelete,
        readOnly,
        stats
      }
    }
  }

  return {
    props: {
      databases,
      noDelete,
      readOnly
    }
  }
}

export default Index