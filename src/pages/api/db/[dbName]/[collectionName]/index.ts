import { MandatoryReqBodyError, MandatoryReqBodyParamError } from 'errors/index.mts'
import { getQuery } from 'lib/queries.ts'
import { checkDatabase, checkCollection, checkOption, validateCollection } from 'lib/validations.ts'
import { withExceptionHandler } from 'middlewares/api.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {  // renameCollection
    if (req.body === '') {
      throw new MandatoryReqBodyError()
    }
    let collection: string
    try {
      collection = req.body.collection
    } catch (error) {
      throw new MandatoryReqBodyParamError('collection')
    }
    validateCollection(collection)
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)
    const client = await global.mongo.connect()
    await client.db(dbName).collection(collectionName).rename(collection).catch((error) => {
      console.debug(error)
      throw new Error(`Could not rename collection '${collectionName}' in '${collection}'. ${error.message}`)
    })
    await global.mongo.updateCollections(global.mongo.connections[dbName])
    // res.redirect(utils.buildCollectionURL(res.locals.baseHref, req.query.dbName, collection))
    res.end()
    return
  }
  if (req.method === 'DELETE') {  // deleteCollection
    checkOption('readOnly', true)
    checkOption('noDelete', true)
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    const query = getQuery(req.query)
    const client = await global.mongo.connect()
    const collection = client.db(dbName).collection(collectionName)
    if (Object.keys(query).length > 0) {
      // Delete some documents
      await collection.deleteMany(query).then((opRes) => {
        console.log(`${opRes.deletedCount} documents deleted from 'collectionName'`)
        // res.redirect(res.locals.baseHref + 'db/' + req.dbName + '/' + req.collectionName)
      })
    } else {
      // Drop the whole collection
      await collection.drop()
      await global.mongo.updateCollections(global.mongo.connections[dbName])
      // res.redirect(res.locals.baseHref + 'db/' + req.dbName)
    }
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)