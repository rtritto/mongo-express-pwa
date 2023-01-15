import { Box, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import type { GetServerSideProps } from 'next'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowDatabases from 'components/Pages/Index/ShowDatabases.tsx'
import { mapServerStatus } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset } from 'lib/GlobalRef.ts'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

interface IndexProps {
  messageError?: string
  messageSuccess?: string
  options: {
    noDelete: boolean
    readOnly: boolean
  }
  serverStatus?: ReturnType<typeof mapServerStatus>
  title: string
}

const Index = ({
  messageError,
  messageSuccess,
  options: { noDelete, readOnly },
  serverStatus,
  title
}: IndexProps) => {
  const databases = useAtomValue<Mongo['databases']>(databasesState)
  const [error, setError] = useAtom<string | undefined>(messageErrorState)
  const [success, setSuccess] = useAtom<string | undefined>(messageSuccessState)

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
  // Get messages from redirect
  const messageError = getGlobalValueAndReset('messageError')
  const messageSuccess = getGlobalValueAndReset('messageSuccess')

  const props: IndexProps = {
    ...messageError !== undefined && { messageError },
    ...messageSuccess !== undefined && { messageSuccess },
    options: process.env.config.options,
    ...global.mongo.adminDb !== null && {
      serverStatus: mapServerStatus(await global.mongo.adminDb.serverStatus())
    },
    title: 'Home - Mongo Express'
  }

  return {
    props
  }
}

export default Index