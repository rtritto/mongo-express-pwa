import { Box, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowDatabases from 'components/Pages/Index/ShowDatabases.tsx'
import { mapServerStatus } from 'lib/mapInfo.ts'
import { getGlobalValueAndReset } from 'lib/GlobalRef.ts'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

interface IndexProps {
  messageError: string | undefined
  messageSuccess: string | undefined
  options: {
    noDelete: boolean
    readOnly: boolean
  }
  serverStatus?: ReturnType<typeof mapServerStatus>
  title: string
}

const Index = (props: IndexProps) => {
  const {
    options: { noDelete, readOnly },
    serverStatus,
    title
  } = props

  const databases = useRecoilValue<Mongo['databases']>(databasesState)
  const [error, setError] = useRecoilState<string | undefined>(messageErrorState)
  const [success, setSuccess] = useRecoilState<string | undefined>(messageSuccessState)

  // Show alerts if messages exist
  useEffect(() => {
    if (error !== props.messageError) {
      setError(props.messageError)
    }
    if (success !== props.messageSuccess) {
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

export async function getServerSideProps() {
  // Get messages from redirect
  const messageError = getGlobalValueAndReset('messageError')
  const messageSuccess = getGlobalValueAndReset('messageSuccess')

  const props = {
    ...messageError !== undefined && { messageError },
    ...messageSuccess !== undefined && { messageSuccess },
    options: process.env.config.options,
    title: 'Home - Mongo Express'
  }

  if (global.mongo.adminDb !== null) {
    const serverStatus = await global.mongo.adminDb.serverStatus()
    props.serverStatus = mapServerStatus(serverStatus)
    // global.stats = stats
  }

  return {
    props
  }
}

export default Index