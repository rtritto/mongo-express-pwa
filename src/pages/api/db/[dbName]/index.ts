import { MandatoryReqBody, MandatoryReqBodyParam } from 'errors/index.mts'
import { checkDatabase, validateCollection } from 'lib/validations.ts'
import { withExceptionHandler } from 'middlewares/api.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // addCollection
    const { dbName } = req.query as Params
    checkDatabase(dbName)
    if (req.body === '') {
      throw new MandatoryReqBody()
    }
    let collection: string
    try {
      collection = req.body.collection
    } catch (error) {
      throw new MandatoryReqBodyParam('collection')
    }
    validateCollection(collection)
    const client = await global.mongo.connect()
    await client.db(dbName).createCollection(collection)
      .catch((error) => {
        console.debug(error)
        throw new Error(`Failed to create collection. ${error.message}`)
      })
    await global.mongo.updateCollections(global.mongo.connections[dbName])
    // res.redirect(buildCollectionURL(res.locals.baseHref, dbName, collection))
    res.end()
    return
  }
  if (req.method === 'DELETE') {  // deleteDatabase
    const { dbName } = req.query as Params
    checkDatabase(dbName)
    const client = await global.mongo.connect()
    await client.db(dbName).dropDatabase()
      .catch((error) => {
        console.debug(error)
        throw new Error(`Failed to delete database. ${error.message}`)
      })
    await global.mongo.updateDatabases()
    // res.redirect(res.locals.baseHref)
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)