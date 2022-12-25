// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { RecoilRoot } from 'recoil'
import type { AppProps } from 'next/app.js'

import createEmotionCache from 'common/createEmotionCache.mts'
import theme from 'common/Theme.mts'
import NavBar from 'components/Nav/NavBar.tsx'
import { setConnection } from 'middlewares/connection.mts'
import { databasesState, selectedDbState } from 'store/globalAtoms.mts'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

function MyApp(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
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
        set(databasesState, props.databases)
        if ('dbName' in props) {
          set(selectedDbState, props.dbName)
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

          <NavBar />

          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </RecoilRoot>
  )
}

MyApp.getInitialProps = async ({ router /* or ctx.req */ }) => {
  const mongo = setConnection()

  // if (mongo.adminDb) {
  //   const rawInfo = await mongo.adminDb.serverStatus()
  //   const info = mapMongoDBInfo(rawInfo)
  //   // global.info = info

  //   return { info }
  // }
  return {
    databases: mongo.databases,
    ...'dbName' in router.query && { dbName: router.query.dbName }
  }
}

export default MyApp