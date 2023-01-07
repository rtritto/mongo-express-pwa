// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { RecoilRoot } from 'recoil'
import type { EmotionCache } from '@emotion/cache'
import type { AppProps } from 'next/app.js'

import createEmotionCache from 'common/createEmotionCache.mts'
import theme from 'common/Theme.mts'
import AlertMessages from 'components/Custom/AlertMessages.tsx'
import NavBar from 'components/Nav/NavBar.tsx'
import { collectionsState, databasesState, selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.ts'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

declare interface MyAppProps extends AppProps {
  databases: Mongo['databases']
  dbName: string | null
  collections: Mongo['collections']
  collectionName: string | null
  emotionCache: EmotionCache
}

function MyApp(props: MyAppProps) {
  const {
    databases,
    dbName,
    collections,
    collectionName,
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps
  } = props
  // const router = useRouter()

  // useEffect(() => {
  //   const handleRouteChange = (url, { shallow }) => {
  //     console.log(
  //       `App is changing to ${url} ${shallow ? 'with' : 'without'
  //       } shallow routing`
  //     )
  //   }

  //   router.events.on('routeChangeStart', handleRouteChange)

  //   // If the component is unmounted, unsubscribe
  //   // from the event with the `off` method:
  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange)
  //   }
  // }, [])

  return (
    <RecoilRoot
      key="init"
      initializeState={({ set }) => {
        set(databasesState, databases)
        set(collectionsState, collections)
        if (dbName !== null) {
          set(selectedDatabaseState, dbName)
        }
        if (collectionName !== null) {
          set(selectedCollectionState, collectionName)
        }
      }}
    >
      <CacheProvider value={emotionCache}>
        {/* <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head> */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <NavBar
            show={{
              databases: 'dbName' in props,
              collections: 'collectionName' in props
            }}
          />

          <AlertMessages />

          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </RecoilRoot>
  )
}

MyApp.getInitialProps = async ({ router /* or ctx.req */ }) => {
  // if (global.mongo.adminDb) {
  //   const rawInfo = await global.mongo.adminDb.serverStatus()
  //   const info = mapMongoDBInfo(rawInfo)
  //   // global.global.info = info

  //   return { info }
  // }
  await global.mongo.connect()

  return {
    databases: global.mongo.databases,
    dbName: 'dbName' in router.query ? router.query.dbName : null,
    collections: Object.assign({}, global.mongo.collections),
    collectionName: 'collectionName' in router.query ? router.query.collectionName : null
  }
}

export default MyApp