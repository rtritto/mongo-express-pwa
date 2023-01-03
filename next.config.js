// import withPWA from 'next-pwa'
// import runtimeCaching from 'next-pwa/cache.js'
import { loadSync } from 'ts-import'

// const isDev = process.env.NODE_ENV === 'development'

const loadOptions = { compiledJsExtension: '.cjs' }

const { default: configDefault } = loadSync('config.default.mts', loadOptions)
loadSync('src/middlewares/db.mts', loadOptions)

// TODO handle custom config
const config = configDefault

await global.mongo.connect(config)

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
  }
}

export default nextConfig
// export default withPWA({
//   dest: 'public',
//   disable: isDev,
//   runtimeCaching
// })(nextConfig)