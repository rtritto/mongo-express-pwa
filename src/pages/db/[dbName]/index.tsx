import { Alert, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import ShowCollections from 'components/Pages/Database/ShowCollections.tsx'
import DatabaseStatsTable from 'components/Pages/Database/DatabaseStatsTable.tsx'
import { getCtx } from 'utils/mapFuncs.ts'

const destination = '/'

declare interface Params extends ParsedUrlQuery {
  dbName: string
}

declare interface DatabasePageProps {
  ctx: ReturnType<typeof getCtx>
  dbName: string
  messageError: string | null
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  title: string
}

const DatabasePage = ({ ctx, dbName, messageError, options, title }: DatabasePageProps) => {
  const { noDelete, noExport, readOnly } = options
  return (
    <div>
      <Head>
        <title>{title}</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        {messageError && (
          <Alert severity="error" onClose={() => { }} sx={{ my: 2 }}>
            {messageError}
          </Alert>
        )}

        <Typography component="h4" gutterBottom variant="h4">
          Viewing Database: {dbName}
        </Typography>

        <Divider sx={{ border: 1, my: 1.5 }} />

        <ShowCollections
          collections={ctx.collections}
          database={dbName}
          show={{
            create: readOnly === false,
            export: noExport === false,
            delete: noDelete === false
          }}
        />

        {/* TODO GridFS Buckets grids.length && settings.gridFSEnabled */}

        {/* TODO Create GridFS Bucket */}

        <DatabaseStatsTable fields={ctx.stats} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, req }) => {
  const { dbName } = params as Params

  // Make sure database exists
  if (dbName in global.mongo.connections) {
    // TODO ???
    // global.req.dbName = dbName
    // global.req.db = global.mongo.connections[dbName].db

    try {
      await global.req.updateCollections(global.mongo.connections[dbName])

      try {
        const data = await global.mongo.connections[dbName].db.stats()
        const ctx = getCtx(data, dbName)

        const { messageError } = global.session
        delete global.session.messageError

        return {
          props: {
            ctx,
            dbName,
            ...messageError !== undefined && { messageError },
            options: process.env.config.options,
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
  } else {
    global.session.messageError = `Database "${dbName}" not found!`
  }

  return {
    redirect: {
      destination,
      permanent: false
    }
  }
}

export default DatabasePage