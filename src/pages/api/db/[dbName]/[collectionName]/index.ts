import { getQuery } from 'lib/queries.ts'
import { checkCollection, checkDatabase, checkDocument, checkOption } from 'lib/validations.ts'
import { validateCollectionReqBody } from 'lib/validationsReq.ts'
import { connectClient, updateCollections } from 'lib/db.ts'
import withExceptionHandler from 'lib/withExceptionHandler.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {  // getDocuments (NEW)
    const { collectionName, dbName, limit, skip } = req.query as Params
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])

    // TODO handle aggregation
    const filter = {}
    const options = {
      ...limit && { limit: Number.parseInt(limit, 10) },
      ...skip && { skip: Number.parseInt(skip, 10) }
    }

    const documents = await client.db(dbName).collection(collectionName).find(filter, options).toArray()

    res.json(documents)
    return
  }
  if (req.method === 'PUT') {  // renameCollection
    await validateCollectionReqBody(req.body)
    const { collectionName, dbName } = req.query as Params
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])

    const { collection } = req.body

    await client.db(dbName).collection(collectionName).rename(collection).catch((error) => {
      console.debug(error)
      throw new Error(`Could not rename collection "${collectionName}" in "${collection}". ${error.message}`)
    })
    await updateCollections(global._mongo.connections[dbName])
    // res.redirect(utils.buildCollectionURL(res.locals.baseHref, req.query.dbName, collection))
    res.end()
    return
  }
  if (req.method === 'POST') {  // addDocument
    const { collectionName, dbName } = req.query as Params
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])
    const docBSON = checkDocument(req.body)

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
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])

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
      await updateCollections(global._mongo.connections[dbName])
      // res.redirect(res.locals.baseHref + 'db/' + req.dbName)
    }
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)