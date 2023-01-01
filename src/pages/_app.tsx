// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { RecoilRoot } from 'recoil'
import type { AppProps } from 'next/app.js'

import createEmotionCache from 'common/createEmotionCache.mts'
import theme from 'common/Theme.mts'
import NavBar from 'components/Nav/NavBar.tsx'
import { selectedCollectionState, selectedDatabaseState } from 'store/globalAtoms.mts'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

declare interface MyAppProps extends AppProps {
  collections: Mongo['collections']
  databases: Mongo['databases']
}

function MyApp(props: MyAppProps) {
  const {
    collections,
    databases,
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
        if ('dbName' in props) {
          set(selectedDatabaseState, props.dbName)
        }
        if ('collectionName' in props) {
          set(selectedCollectionState, props.collectionName)
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
            collections={collections}
            databases={databases}
            show={{
              databases: 'dbName' in props,
              collections: 'collectionName' in props
            }}
          />

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
  return {
    databases: global.mongo.databases,
    collections: global.mongo.collections,
    ...'dbName' in router.query && { dbName: router.query.dbName },
    ...'collectionName' in router.query && { collectionName: router.query.collectionName }
  }
}

export default MyApp