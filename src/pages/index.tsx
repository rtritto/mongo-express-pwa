import { Alert, Box, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'

import StatsTable from 'components/Custom/StatsTable.tsx'
import ShowDatabases from 'components/Pages/Index/ShowDatabases.tsx'
import { mapServerStatus } from 'lib/mapStats.ts'

interface IndexProps {
  databases: string[]
  messageError: string | null
  options: {
    noDelete: boolean
    readOnly: boolean
  }
  serverStatus?: ReturnType<typeof mapServerStatus>
  title: string
}

const Index = ({ databases, messageError, options, serverStatus, title }: IndexProps) => {
  const { noDelete, readOnly } = options
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
  const { messageError } = global.session
  delete global.session.messageError

  const props = {
    databases: global.mongo.databases,
    ...messageError !== undefined && { messageError },
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