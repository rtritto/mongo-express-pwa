import { checkDatabase } from 'lib/validations.ts'
import { validateCollectionReqBody } from 'lib/validationsReq.ts'
import { mongo, withExceptionHandler } from 'src/lib/db.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // addCollection
    const { dbName } = req.query as Params
    const client = await mongo.connect()
    checkDatabase(dbName, Object.keys(mongo.connections))
    await validateCollectionReqBody(req.body)
    const { collection } = req.body
    await client.db(dbName).createCollection(collection)
      .catch((error) => {
        console.debug(error)
        throw new Error(`Failed to create collection. ${error.message}`)
      })
    await mongo.updateCollections(mongo.connections[dbName])
    // res.redirect(buildCollectionURL(res.locals.baseHref, dbName, collection))
    res.end()
    return
  }
  if (req.method === 'DELETE') {  // deleteDatabase
    const { dbName } = req.query as Params
    const client = await mongo.connect()
    checkDatabase(dbName, Object.keys(mongo.connections))
    await client.db(dbName).dropDatabase()
      .catch((error) => {
        console.debug(error)
        throw new Error(`Failed to delete database. ${error.message}`)
      })
    // await mongo.updateDatabases()  // DEPRECATED Not needed because mongo.connect is always called
    // res.redirect(res.locals.baseHref)
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)