import { Container, Divider, Typography } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head.js'

import DatabaseStats from 'components/Pages/Database/DatabaseStats.tsx'
import ShowCollections from 'components/Pages/Database/ShowCollections.tsx'
import { mapDatabaseStats } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { collectionsState, databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'
import { connectClient, updateCollections } from 'src/lib/db.ts'

interface DatabasePageProps {
  collections: Mongo['collections']
  databases: Mongo['databases']
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
  collections: collectionsInit,
  databases: databasesInit,
  dbName,
  databaseStats,
  messageError,
  messageSuccess,
  options: { noDelete, noExport, readOnly },
  title
}: DatabasePageProps) => {
  const { current: initialValues } = useRef([
    [collectionsState, collectionsInit],
    [databasesState, databasesInit]
  ] as const)
  useHydrateAtoms(initialValues)
  const [collections, setCollections] = useAtom(collectionsState)
  const setDatabases = useSetAtom(databasesState)
  const [error, setError] = useAtom(messageErrorState)
  const [success, setSuccess] = useAtom(messageSuccessState)

  useEffect(() => {
    setCollections(collectionsInit)
  }, [collectionsInit, setCollections])
  useEffect(() => {
    setDatabases(databasesInit)
  }, [databasesInit, setDatabases])
  // Show alerts if messages exist
  useEffect(() => {
    if (error !== messageError) {
      setError(messageError)
    }
    if (success !== messageSuccess) {
      setSuccess(messageSuccess)
    }
  }, [error, success, messageError, messageSuccess, setError, setSuccess])

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

        <Divider sx={{ border: 0.5 }} />

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

        <DatabaseStats databaseStats={databaseStats} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<DatabasePageProps, Params> = async ({ params }) => {
  await connectClient()
  const { dbName } = params as Params

  // Make sure database exists
  if (!(dbName in global._mongo.connections)) {
    setGlobalValue('messageError', `Database "${dbName}" not found!`)
    return getRedirect()
  }
  // TODO ???
  // global.req.dbName = dbName
  // global.req.db = mongo.connections[dbName].db

  try {
    await updateCollections(global._mongo.connections[dbName])
  } catch (error) {
    console.error(error)
    setGlobalValue('messageError', `Could not refresh collections. ${error}`)
    return getRedirect()
  }

  let databaseStats
  try {
    const dbStats = await global._mongo.connections[dbName].db.stats() as DbStats
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
      collections: global._mongo.collections,
      databases: global._mongo.databases,
      databaseStats,
      dbName,
      // TODO grids: global._mongo.gridFSBuckets[dbName],
      ...messageError !== undefined && { messageError },
      ...messageSuccess !== undefined && { messageSuccess },
      options: process.env.config.options,
      title: `${dbName} - Mongo Express`
    }
  }
}

export default DatabasePage