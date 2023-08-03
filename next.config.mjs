// import withPWA from 'next-pwa'
// import runtimeCaching from 'next-pwa/cache.js'
import { loadSync } from 'ts-import'

// const isDev = process.env.NODE_ENV === 'development'

const loadOptions = { compiledJsExtension: '.cjs' }
const { default: configDefault } = loadSync('./config.default.mts', loadOptions)
const { mongo } = loadSync('./src/lib/db.ts', loadOptions)

// TODO https://github.com/radarsu/ts-import/issues/39
// const { default: configDefault } = await load('./config.default.mts', loadOptions)
// await load('./src/lib/db.ts', loadOptions)

// TODO handle custom config
const config = configDefault

await mongo.connect(config)

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { config },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  // https://stackoverflow.com/a/72400455/10413113
  webpack(config, { dev, isServer }) {
    // why did you render
    if (dev && process.env.NEXT_PUBLIC_WDYR === 'true' && !isServer) {
      const originalEntry = config.entry
      config.entry = async () => {
        const path = await import('node:path')
        const wdrPath = path.resolve('src/scripts/wdyr.mts')
        const entries = await originalEntry()
        if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
          entries['main.js'].unshift(wdrPath)
        }
        return entries
      }
    }
    return config
  }
}

export default nextConfig
// export default withPWA({
//   dest: 'public',
//   disable: isDev,
//   runtimeCaching
// })(nextConfig)