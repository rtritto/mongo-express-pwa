import { Alert, Box, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'

import ServerStatusTable from 'components/Pages/Index/ServerStatusTable.tsx'
import ShowDatabases from 'components/Pages/Index/ShowDatabases/index.tsx'
import { mapMongoDBInfoForTable } from 'utils/mapFuncs.ts'

interface IndexProps {
  databases: string[]
  messageError: string | null
  options: {
    noDelete: boolean
    readOnly: boolean
  }
  stats?: ReturnType<typeof mapMongoDBInfoForTable>
}

const Index = ({ databases, messageError, options, stats }: IndexProps) => {
  const { noDelete, readOnly } = options
  return (
    <div>
      <Head>
        <title>Home - Mongo Express</title>

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
          showCreateDatabase={readOnly === false}
          showDeleteDatabases={noDelete === false && readOnly === false}
        />

        <Box sx={{ my: 2 }}>
          {stats ? <ServerStatusTable fields={stats} /> : (
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
    databases: global.req.databases,
    ...messageError !== undefined && { messageError },
    options: process.env.config.options
  }

  if (global.req.adminDb) {
    const rawInfo = await global.req.adminDb.serverStatus()
    console.log('rawInfo: ', rawInfo);
    props.stats = mapMongoDBInfoForTable(rawInfo)
    // global.stats = stats
  }

  return {
    props
  }
}

export default Index