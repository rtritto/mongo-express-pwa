import { NextApiRequest, NextApiResponse } from 'next'

import * as validators from 'utils/validations.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {  // addDatabase
      const name = req.body.database
      if (!validators.isValidDatabaseName(name)) {
        // TODO: handle error
        console.error('That database name is invalid.')
        global.req.session.error = 'That database name is invalid.'
        return res.redirect('back')
      }
      const ndb = global.req.mainClient.client.db(name)

      await ndb.createCollection('delete_me').then(async () => {
        await req.updateDatabases().then(() => {
          res.redirect(res.locals.baseHref)
        })

        // await ndb.dropCollection('delete_me').then(() => {
        //   res.redirect(res.locals.baseHref + 'db/' + name)
        // }).catch((error) => {
        //   //TODO: handle error
        //   console.error('Could not delete collection.')
        //   req.session.error = 'Could not delete collection. Err:' + error
        //   res.redirect('back')
        // })
      }).catch((error) => {
        // TODO: handle error
        console.error(`Could not create collection. Err: ${error}`)
        global.req.session.error = `Could not create collection. Err: ${error}`
        res.redirect('back')
      })
    }
    case 'DELETE': {  // deleteDatabase
      await global.req.db.dropDatabase().then(async () => {
        await global.req.updateDatabases().then(() => res.redirect(res.locals.baseHref))
      }).catch((error) => {
        // TODO: handle error
        console.error(`Could not to delete database. Err: ${error}`)
        global.req.session.error = `Failed to delete database. Err: ${error}`
        res.redirect('back')
      })
    }
  }
}

export default handler