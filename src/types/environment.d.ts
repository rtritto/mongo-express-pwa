import type { Admin } from 'mongodb'

import { setConnection } from 'middlewares/connection.mts'

export { }

declare type ReqType = ReturnType<typeof setConnection>

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      config: import('config.default.mts')
    }
  }
  var mongo: Mongo
  var req: ReqType
  var session: {
    messageError?: string
    messageSuccess?: string
  }
}