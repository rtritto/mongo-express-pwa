import { validateDatabaseReqBody } from 'lib/validationsReq.ts'
import { mongo, withExceptionHandler } from 'src/lib/db.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // addDatabase
    await validateDatabaseReqBody(req.body)
    const { database } = req.body

    const client = await mongo.connect()
    const cratedDb = client.db(database)

    await cratedDb.createCollection('delete_me').catch((error) => {
      console.debug(error)
      throw new Error(`Could not create collection. ${error.message}`)
    })
    // await mongo.updateDatabases()  // DEPRECATED Not needed because mongo.connect is always called
    // await cratedDb.dropCollection('delete_me')/* .then(() => {
    //   res.redirect(res.locals.baseHref + 'db/' + name)
    // }) */.catch((error) => {
    //   console.debug(error)
    //   // Comment to prevent permission error:
    //   // MongoServerError: user is not allowed to do action [dropDatabase] on [<database>.]
    //   // throw new Error(`Could not delete collection. ${error.message}`)
    // })
    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default withExceptionHandler(handler)