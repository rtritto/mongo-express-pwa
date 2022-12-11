// import withPWA from 'next-pwa'
// import runtimeCaching from 'next-pwa/cache.js'
import { loadSync } from 'ts-import'

const loadOptions = {
  compiledJsExtension: '.cjs'
}

const { default: configDefault } = loadSync('./config.default.mts', loadOptions)
const { connect } = loadSync('src/utils/db.mts', loadOptions)

const isDev = process.env.NODE_ENV === 'development'

// const mongodb = 
await connect(configDefault)
console.log('connect OK');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    config: configDefault,
    // mongodb
  },
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