import { MandatoryReqBodyError, MandatoryReqBodyParamError } from 'errors/index.mts'
import { validateDatabase } from 'lib/validations.ts'
import { withExceptionHandler } from 'middlewares/api.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // addDatabase
    if (req.body === '') {
      throw new MandatoryReqBodyError()
    }
    let database: string
    try {
      database = req.body.database
    } catch (error) {
      throw new MandatoryReqBodyParamError('database')
    }
    validateDatabase(database)

    const client = await global.mongo.connect()
    const ndb = client.db(database)

    await ndb.createCollection('delete_me').catch((error) => {
      console.debug(error)
      throw new Error(`Could not create collection. ${error.message}`)
    })
    await global.mongo.updateDatabases()
    await ndb.dropCollection('delete_me')/* .then(() => {
      res.redirect(res.locals.baseHref + 'db/' + name)
    }) */.catch((error) => {
      console.debug(error)
      // Comment to prevent permission error:
      // MongoServerError: user is not allowed to do action [dropDatabase] on [<database>.]
      // throw new Error(`Could not delete collection. ${error.message}`)
    })
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)