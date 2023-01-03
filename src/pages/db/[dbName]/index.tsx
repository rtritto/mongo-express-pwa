import { Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowCollections from 'components/Pages/Database/ShowCollections.tsx'
import { mapDatabaseStats } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.mts'

declare interface DatabasePageProps {
  collections: Collections
  dbName: string
  messageError: string | undefined
  messageSuccess: string | undefined
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  databaseStats: ReturnType<typeof mapDatabaseStats>
  title: string
}

const getRedirect = (): { redirect: Redirect } => ({
  redirect: {
    destination: '/',
    permanent: false
  }
})

const DatabasePage = (props: DatabasePageProps) => {
  const {
    collections, dbName,
    options: { noDelete, noExport, readOnly },
    databaseStats,
    title
  } = props

  const setError = useSetRecoilState<string | undefined | null>(messageErrorState)
  const setSuccess = useSetRecoilState<string | undefined | null>(messageSuccessState)

  // Show alerts if messages exist
  useEffect(() => {
    if ('messageError' in props) {
      setError(props.messageError)
    }
    if ('messageSuccess' in props) {
      setSuccess(props.messageSuccess)
    }
  }, [props.messageError, props.messageSuccess])

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
          collections={collections}
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

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
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
      collections: global.mongo.collections[dbName],
      databaseStats,
      dbName,
      // TODO grids: global.mongo.gridFSBuckets[dbName],
      ...messageSuccess !== undefined && { messageSuccess },
      ...messageError !== undefined && { messageError },
      options: process.env.config.options,
      title: `${dbName} - Mongo Express`
    }
  }
}

export default DatabasePage