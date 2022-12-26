import { Container, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { getCtx } from 'utils/mapFuncs.ts'
import DatabaseStatsTable from 'components/Pages/Database/DatabaseStatsTable.tsx'

const destination = '/'

declare interface Params extends ParsedUrlQuery {
  dbName: string
}

const CollectionTable = () => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: 'none', p: 1.5, verticalAlign: 'top' }}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold' }}>
                Collections
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* {rows.map((row, index) => (
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
            ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const DbPage = ({ ctx, dbName, title }: { dbName: string, title: string }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        <Typography component="h4" gutterBottom variant="h4">
          Viewing Database: {dbName}
        </Typography>

        <Divider sx={{ border: 1, my: 1.5 }} />

        <CollectionTable />

        <DatabaseStatsTable fields={ctx.stats} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, req }) => {
  const { dbName } = params as Params

  // Make sure database exists
  if (!(dbName in global.mongo.connections)) {
    global.session.messageError = `Database "${dbName}" not found!`

    return {
      redirect: {
        destination,
        permanent: false
      }
    }
  }

  // TODO ???
  // global.req.dbName = dbName
  // global.req.db = global.mongo.connections[dbName].db

  try {
    await global.req.updateCollections(global.mongo.connections[dbName])

    try {
      const data = await global.mongo.connections[dbName].db.stats()
      const ctx = getCtx(data, dbName)

      return {
        props: {
          ctx,
          dbName,
          title: `${dbName} - Mongo Express`
        }
      }
    } catch (error) {
      console.error(error)
      global.session.messageError = `Could not get stats. ${error}`
    }
  } catch (error) {
    console.error(error)
    global.session.messageError = `Could not refresh collections. ${error}`
  }

  return {
    redirect: {
      destination,
      permanent: false
    }
  }
}

export default DbPage