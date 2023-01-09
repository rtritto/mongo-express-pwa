import { Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import type { GetServerSideProps } from 'next'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowCollections from 'components/Pages/Database/ShowCollections.tsx'
import { mapDatabaseStats } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { collectionsState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

interface DatabasePageProps {
  databaseStats?: ReturnType<typeof mapDatabaseStats>
  dbName: string
  messageError?: string
  messageSuccess?: string
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  title: string
}

const getRedirect = (): { redirect: Redirect } => ({
  redirect: {
    destination: '/',
    permanent: false
  }
})

const DatabasePage = ({
  dbName,
  databaseStats,
  messageError,
  messageSuccess,
  options: { noDelete, noExport, readOnly },
  title
}: DatabasePageProps) => {

  const collections = useRecoilValue<Mongo['collections']>(collectionsState)
  const [error, setError] = useRecoilState<string | undefined>(messageErrorState)
  const [success, setSuccess] = useRecoilState<string | undefined>(messageSuccessState)

  // Show alerts if messages exist
  useEffect(() => {
    if (error !== messageError) {
      setError(messageError)
    }
    if (success !== messageSuccess) {
      setSuccess(messageSuccess)
    }
  }, [messageError, messageSuccess])

  return (
    <div>
      <Head>
        <title>{title}</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        <Typography component="h4" gutterBottom variant="h4">
          Viewing Database: <strong>{dbName}</strong>
        </Typography>

        <Divider sx={{ border: 1, my: 1.5 }} />

        <ShowCollections
          collections={collections[dbName]}
          dbName={dbName}
          show={{
            create: readOnly === false,
            export: noExport === false,
            delete: noDelete === false
          }}
        />

        {/* TODO GridFS Buckets grids.length && settings.gridFSEnabled */}

        {/* TODO Create GridFS Bucket */}

        <StatsTable label="Database Stats" fields={databaseStats} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<DatabasePageProps, Params> = async ({ params }) => {
  const { dbName } = params as Params

  // Make sure database exists
  if (!(dbName in global.mongo.connections)) {
    setGlobalValue('messageError', `Database '${dbName}' not found!`)
    return getRedirect()
  }
  // TODO ???
  // global.req.dbName = dbName
  // global.req.db = global.mongo.connections[dbName].db

  try {
    await global.mongo.updateCollections(global.mongo.connections[dbName])
  } catch (error) {
    console.error(error)
    setGlobalValue('messageError', `Could not refresh collections. ${error}`)
    return getRedirect()
  }

  let databaseStats
  try {
    const dbStats = await global.mongo.connections[dbName].db.stats()
    databaseStats = mapDatabaseStats(dbStats)
  } catch (error) {
    console.error(error)
    setGlobalValue('messageError', `Could not get stats. ${error}`)
    return getRedirect()
  }

  // Get messages from redirect
  const messageError = getGlobalValueAndReset('messageError')
  const messageSuccess = getGlobalValueAndReset('messageSuccess')

  return {
    props: {
      databaseStats,
      dbName,
      // TODO grids: global.mongo.gridFSBuckets[dbName],
      ...messageError !== undefined && { messageError },
      ...messageSuccess !== undefined && { messageSuccess },
      options: process.env.config.options,
      title: `${dbName} - Mongo Express`
    }
  }
}

export default DatabasePage