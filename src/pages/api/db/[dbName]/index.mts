import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
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