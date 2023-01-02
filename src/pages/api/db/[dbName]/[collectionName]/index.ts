import { isValidCollectionName } from 'lib/validations.ts'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {  // renameCollection
    const {
      body: { collection },
      query: { collectionName, dbName }
    } = req
    // Make sure database exists
    if (!(dbName in global.mongo.connections)) {
      global.session.messageError = `Database "${dbName}" not found!`
      // TODO return getRedirect(dbName)
    }
    // Make sure collection exists
    if (!global.mongo.collections[dbName].includes(collectionName)) {
      global.session.messageError = `Collection "${collectionName}" not found!`
      // TODO return getRedirect(dbName)
    }
    // TODO const validation = isValidCollectionName(collection)
    // if ('error' in validation) {
    //   global.session.messageError = validation.error
    //   return res.redirect('back')
    // }

    try {
      const client = await global.mongo.connect()
      await client.db(dbName).collection(collectionName).rename(collection)
      await global.mongo.updateCollections(global.mongo.connections[dbName])
      global.session.messageSuccess = 'Collection renamed!'
      //   res.redirect(utils.buildCollectionURL(res.locals.baseHref, req.query.dbName, collection))
      return res.json({})
    } catch (error) {
      console.error(error)
      global.session.messageError = `Something went wrong: ${error}`
      res.redirect('back')
    }
  }
}

export default handler