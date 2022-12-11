// import Head from 'next/head.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import type { AppProps } from 'next/app.js'
import { RecoilRoot } from 'recoil'

import theme from 'components/theme.mts'
import createEmotionCache from 'components/createEmotionCache.mts'
import NavBar from 'components/Nav/NavBar.tsx'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <RecoilRoot>
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