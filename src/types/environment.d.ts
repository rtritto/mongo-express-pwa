export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      config: import('config.default.mts')
    }
  }
  var mongo: Mongo
  var messageError: string | undefined
  var messageSuccess: string | undefined
}