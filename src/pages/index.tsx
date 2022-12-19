import { Box, Container, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Head from 'next/head.js'

import CreateDatabase from 'components/CreateDatabase/index.tsx'
import { mapMongoDBInfo, mapMongoDBInfoForTable } from 'utils/mapFuncs.ts'

const TableCellStyle = {
  // border: 1,
  padding: 1
}

const DenseTable = ({ rows }: { rows: ReturnType<typeof mapMongoDBInfoForTable> }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table aria-label="a dense table">
        <TableHead>
          <TableRow style={{ backgroundColor: 'darkgrey' }}>
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
  noDelete: boolean
  readOnly: boolean
  stats?: ReturnType<typeof mapMongoDBInfo>
}

const Index = ({ noDelete, readOnly, stats }: IndexProps) => {
  return (
    <div>
      <Head>
        <title>Home - Mongo Express</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ padding: 1 }}>
        <Typography component="h4" gutterBottom variant="h4">Mongo Express</Typography>

        <Divider sx={{ border: 1 }} />

        {noDelete === false && <CreateDatabase />}

        {/* {(noDelete === false && readOnly === false) && } */}

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

  if (global.req.adminDb) {
    const rawInfo = await global.req.adminDb.serverStatus()
    const stats = mapMongoDBInfo(rawInfo)
    // global.stats = stats

    return {
      props: {
        noDelete,
        readOnly,
        stats
      }
    }
  }

  return {
    props: {
      noDelete,
      readOnly
    }
  }
}

export default Index