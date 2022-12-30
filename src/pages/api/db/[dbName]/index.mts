import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE': {  // deleteDatabase
      // TODO change global.req.db with global.mongo.collections[dbName].db
      await global.req.db.dropDatabase().then(async () => {
        await global.mongo.updateDatabases().then(() => res.redirect(res.locals.baseHref))
      }).catch((error) => {
        // TODO: handle error
        console.error(`Could not to delete database. Err: ${error}`)
        global.session.messageError = `Failed to delete database. Err: ${error}`
        res.redirect('back')
      })
    }
  }
}

export default handler