// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { createStore, Provider } from 'jotai'
import type { EmotionCache } from '@emotion/cache'
import type { AppProps, AppContext } from 'next/app.js'

import createEmotionCache from 'common/createEmotionCache.mts'
import theme from 'common/Theme.mts'
import AlertMessages from 'components/Custom/AlertMessages.tsx'
import NavBar from 'components/Nav/NavBar.tsx'
import { selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.ts'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const store = createStore()

type App = typeof import('next/app.js').default
interface MyAppProps extends AppProps {
  dbName?: string
  collectionName?: string
  emotionCache: EmotionCache
}

const MyApp: App = ({
  dbName,
  collectionName,
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}: MyAppProps) => {
  // ThemeProvider makes the theme available down the React tree thanks to React context.
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
  store.set(selectedCollectionState, collectionName)
  store.set(selectedDatabaseState, dbName)
  return (
    <Provider key="init" store={store}>
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

          <Component {...pageProps} />

          <AlertMessages />
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
    ...'dbName' in router.query && { dbName: router.query.dbName },
    ...'collectionName' in router.query && { collectionName: router.query.collectionName }
  } as MyAppProps
}

export default MyApp