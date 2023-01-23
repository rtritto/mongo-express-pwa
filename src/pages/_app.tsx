// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { Provider } from 'jotai'
import type { EmotionCache } from '@emotion/cache'
import type { AppProps, AppContext } from 'next/app.js'

import createEmotionCache from 'common/createEmotionCache.mts'
import theme from 'common/Theme.mts'
import AlertMessages from 'components/Custom/AlertMessages.tsx'
import NavBar from 'components/Nav/NavBar.tsx'
import { collectionsState, databasesState, selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.ts'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

type App = typeof import('next/app.js').default
interface MyAppProps extends AppProps {
  databases: Mongo['databases']
  dbName?: string
  collections: Mongo['collections']
  collectionName?: string
  emotionCache: EmotionCache
}

const MyApp: App = ({
  databases,
  dbName,
  collections,
  collectionName,
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}: MyAppProps) => {
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
    <Provider
      key="init"
      initialValues={[
        [collectionsState, collections],
        [selectedCollectionState, collectionName],
        [databasesState, databases],
        [selectedDatabaseState, dbName]
      ]}
    >
      <CacheProvider value={emotionCache}>
        {/* <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head> */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline enableColorScheme />

          <NavBar
            show={{
              databases: dbName !== undefined,
              collections: collectionName !== undefined
            }}
          />

          <AlertMessages />

          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  )
}

MyApp.getInitialProps = async ({ router /* or ctx.req */ }: AppContext): Promise<MyAppProps> => {
  // if (global.mongo.adminDb) {
  //   const rawInfo = await global.mongo.adminDb.serverStatus()
  //   const info = mapMongoDBInfo(rawInfo)
  //   // global.global.info = info

  //   return { info }
  // }
  await global.mongo.connect()

  return {
    databases: global.mongo.databases,
    ...'dbName' in router.query && { dbName: router.query.dbName },
    collections: Object.assign({}, global.mongo.collections),
    ...'collectionName' in router.query && { collectionName: router.query.collectionName }
  } as MyAppProps
}

export default MyApp