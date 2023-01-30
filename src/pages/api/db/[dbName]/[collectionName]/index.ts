import { getQuery } from 'lib/queries.ts'
import { checkCollection, checkDatabase, checkDocument, checkOption } from 'lib/validations.ts'
import { validateCollectionReqBody } from 'lib/validationsReq.ts'
import { withExceptionHandler } from 'middlewares/api.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {  // getDocuments (NEW)
    const { collectionName, dbName, limit, skip } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    // TODO handle aggregation
    const filter = {}
    const options = {
      ...limit && { limit: Number.parseInt(limit, 10) },
      ...skip && { skip: Number.parseInt(skip, 10) }
    }

    const client = await global.mongo.connect()
    const documents = await client.db(dbName).collection(collectionName).find(filter, options).toArray()

    res.json(documents)
    return
  }
  if (req.method === 'PUT') {  // renameCollection
    await validateCollectionReqBody(req.body)
    const { collection } = req.body
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    const client = await global.mongo.connect()
    await client.db(dbName).collection(collectionName).rename(collection).catch((error) => {
      console.debug(error)
      throw new Error(`Could not rename collection "${collectionName}" in "${collection}". ${error.message}`)
    })
    await global.mongo.updateCollections(global.mongo.connections[dbName])
    // res.redirect(utils.buildCollectionURL(res.locals.baseHref, req.query.dbName, collection))
    res.end()
    return
  }
  if (req.method === 'POST') {  // addDocument
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)
    const docBSON = checkDocument(req.body)

    const client = await global.mongo.connect()
    await client.db(dbName).collection(collectionName).insertOne(docBSON)

    // TODO move request in page
    // req.session.success = 'Document added!'
    // res.redirect(buildCollectionURL(res.locals.baseHref, req.dbName, req.collectionName))

    res.end()
    return
  }
  if (req.method === 'DELETE') {  // deleteCollection
    checkOption('readOnly', true)
    checkOption('noDelete', true)
    const { collectionName, dbName, query } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    const client = await global.mongo.connect()
    const collection = client.db(dbName).collection(collectionName)
    if (query) {
      const filter = getQuery(query)
      // Delete some documents
      await collection.deleteMany(filter).then((opRes) => {
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