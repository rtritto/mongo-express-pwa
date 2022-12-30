export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      config: import('config.default.mts')
    }
  }
  var mongo: Mongo
  var session: {
    messageError?: string
    messageSuccess?: string
  }
}