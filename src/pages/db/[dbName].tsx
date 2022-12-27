import { Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import ShowCollections from 'components/Pages/Database/ShowCollections/index.tsx'
import DatabaseStatsTable from 'components/Pages/Database/DatabaseStatsTable.tsx'
import { getCtx } from 'utils/mapFuncs.ts'

const destination = '/'

declare interface Params extends ParsedUrlQuery {
  dbName: string
}

declare interface DatabasePageProps {
  ctx: ReturnType<typeof getCtx>
  dbName: string
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  title: string
}

const DatabasePage = ({ ctx, dbName, options, title }: DatabasePageProps) => {
  const { noDelete, noExport, readOnly } = options
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

        <ShowCollections
          collections={ctx.collections}
          showCreate={readOnly === false}
          showExport={noExport === false}
          showDelete={noDelete === false}
        />

        {/* TODO GridFS Buckets */}

        {/* TODO Create GridFS Bucket */}

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

  return {
    redirect: {
      destination,
      permanent: false
    }
  }
}

export default DatabasePage