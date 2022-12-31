import { NextApiRequest, NextApiResponse } from 'next'

import * as validators from 'lib/validations.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {  // addDatabase
    const name = req.body.database
    if (!validators.isValidDatabaseName(name)) {
      // TODO: handle error
      console.error('That database name is invalid.')
      global.session.messageError = 'That database name is invalid.'
      return res.redirect('back')
    }
    const ndb = global.mongo.mainClient.client.db(name)

    await ndb.createCollection('delete_me').then(async () => {
      await global.mongo.updateDatabases().then(() => {
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
      global.session.messageError = `Could not create collection. Err: ${error}`
      res.redirect('back')
    })
  }
}

export default handler