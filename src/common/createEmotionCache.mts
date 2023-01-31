// import type { EmotionCache } from '@emotion/cache'

// import createCache from '@emotion/cache'

// Enable with ESM type module in package.json
// https://github.com/emotion-js/emotion/issues/2582
import emotionCache from '@emotion/cache'

const createCache = 'default' in emotionCache ? emotionCache.default : emotionCache

const isBrowser = typeof document !== 'undefined'

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  if (isBrowser === true) {
    const insertionPoint = document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]')
    if (insertionPoint !== null) {
      return createCache({ key: 'mui-style', insertionPoint })
    }
  }
  return createCache({ key: 'mui-style' })
}