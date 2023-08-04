export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      config: import('config.default.mts')
    }
  }
  var _mongo: Mongo
  // {
  //   client: MongoClient
  //   clients: ClientInfo[]
  //   connections: Connections
  //   collections: Collections
  //   databases: string[]
  // }
  var messageError: string | undefined
  var messageSuccess: string | undefined
}