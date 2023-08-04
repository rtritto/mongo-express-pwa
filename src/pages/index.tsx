import { Box, Container, Divider, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef, type ComponentType } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head.js'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowDatabases from 'components/Pages/Index/ShowDatabases.tsx'
import { mapServerStatus } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset } from 'lib/GlobalRef.ts'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'
import { connectClient } from 'src/lib/db.ts'

interface IndexProps {
  initDatabases: Mongo['databases']
  messageError?: string
  messageSuccess?: string
  options: {
    noDelete: boolean
    readOnly: boolean
  }
  serverStatus?: ReturnType<typeof mapServerStatus>
  title: string
}

const Index: ComponentType<IndexProps> = ({
  initDatabases,
  messageError,
  messageSuccess,
  options: { noDelete, readOnly },
  serverStatus,
  title
}) => {
  const { current: initialValues } = useRef([[databasesState, initDatabases]] as const)
  useHydrateAtoms(initialValues)
  const [databases, setDatabases] = useAtom(databasesState)
  const [error, setError] = useAtom(messageErrorState)
  const [success, setSuccess] = useAtom(messageSuccessState)

  useEffect(() => {
    setDatabases(initDatabases)
  }, [initDatabases, setDatabases])
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
        <Typography component="h4" gutterBottom variant="h4">Mongo Express</Typography>

        <Divider sx={{ border: 1, my: 1.5 }} />

        <ShowDatabases
          databases={databases}
          show={{
            create: readOnly === false,
            delete: noDelete === false && readOnly === false
          }}
        />

        <Box sx={{ mb: 2 }}>
          {serverStatus ? <StatsTable label="Server Status" fields={serverStatus} /> : (
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

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  await connectClient()
  // Get messages from redirect
  const messageError = getGlobalValueAndReset('messageError')
  const messageSuccess = getGlobalValueAndReset('messageSuccess')

  const props: IndexProps = {
    initDatabases: global._mongo.databases,
    ...messageError !== undefined && { messageError },
    ...messageSuccess !== undefined && { messageSuccess },
    options: process.env.config.options,
    ...global._mongo.adminDb !== null && {
      serverStatus: mapServerStatus(await global._mongo.adminDb.serverStatus() as ServerStatus)
    },
    title: 'Home - Mongo Express'
  }

  return {
    props
  }
}

export default Index