import { checkCollection, checkDatabase, checkDocument, checkOption } from 'lib/validations.ts'
import { buildId } from 'lib/utils.ts'
import { connectClient } from 'lib/db.ts'
import withExceptionHandler from 'lib/withExceptionHandler.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {  // updateDocument
    const { collectionName, dbName, documentId } = req.query as Params
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])

    const _id = buildId(documentId, req.query)
    const filter = { _id }

    const collection = client.db(dbName).collection(collectionName)

    const doc = await collection.findOne(filter)
    if (doc === null) {
      throw new Error('Document not found!')
    }

    const docBSON = checkDocument(req.body)

    docBSON._id = doc._id

    await collection.replaceOne(filter, docBSON)

    // TODO move request in page
    // req.session.success = 'Document updated!'
    // if (config.options.persistEditMode === true) {
    //   res.redirect(buildDocumentURL(res.locals.baseHref, req.dbName, req.collectionName, req.document._id, { skip }))
    // } else {
    //   res.redirect(buildCollectionURL(res.locals.baseHref, req.dbName, req.collectionName, { skip }))
    // }

    res.end()
    return
  }
  if (req.method === 'DELETE') {  // deleteDocument
    checkOption('readOnly', true)
    checkOption('noDelete', true)
    const { collectionName, dbName, documentId } = req.query as Params
    const client = await connectClient()
    checkDatabase(dbName, Object.keys(global._mongo.connections))
    checkCollection(collectionName, global._mongo.collections[dbName])
    const _id = buildId(documentId, req.query)
    const filter = { _id }

    const collection = client.db(dbName).collection(collectionName)

    const doc = await collection.findOne(filter)
    if (doc === null) {
      throw new Error('Document not found!')
    }

    await collection.deleteOne(filter)
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)