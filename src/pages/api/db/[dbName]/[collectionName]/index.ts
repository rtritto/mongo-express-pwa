import { isValidCollectionName } from 'lib/validations.ts'
import { withExceptionFilter } from 'middlewares/api.ts'
import { MandatoryReqBody, MandatoryReqBodyParam } from 'errors/index.mts'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {  // renameCollection
    const { collectionName, dbName } = req.query
    if (req.body === '') {
      throw new MandatoryReqBody()
    }
    let collection
    try {
      collection = req.body.collection
    } catch (error) {
      throw new MandatoryReqBodyParam('collection')
    }
    // Make sure database exists
    if (!(dbName in global.mongo.connections)) {
      throw new Error(`Database '${dbName}' not found!`)
    }
    // Make sure collection exists
    if (!global.mongo.collections[dbName].includes(collectionName)) {
      throw new Error(`Collection '${collectionName}' not found!`)
    }
    const validation = isValidCollectionName(collection)
    if ('error' in validation) {
      throw new Error(validation.error)
    }
    try {
      const client = await global.mongo.connect()
      await client.db(dbName).collection(collectionName).rename(collection)
      await global.mongo.updateCollections(global.mongo.connections[dbName])
      // res.redirect(utils.buildCollectionURL(res.locals.baseHref, req.query.dbName, collection))
      res.end()
      return
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong: ${error.message}`)
    }
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionFilter(handler)