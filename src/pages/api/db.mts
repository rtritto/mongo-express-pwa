import { NextApiRequest, NextApiResponse } from 'next'

import * as validators from 'utils/validations.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {  // viewDatabase
      await global.req.updateCollections(global.req.dbConnection).then(async () => {
        await global.req.db.stats().then((data) => {
          const ctx = {
            title: 'Viewing Database: ' + global.req.dbName,
            databases: global.req.databases,
            colls: global.req.collections[global.req.dbName],
            grids: global.req.gridFSBuckets[global.req.dbName],
            stats: {
              avgObjSize: validators.bytesToSize(data.avgObjSize || 0),
              collections: data.collections,
              dataFileVersion: (data.dataFileVersion && data.dataFileVersion.major && data.dataFileVersion.minor
                ? data.dataFileVersion.major + '.' + data.dataFileVersion.minor
                : null),
              dataSize: validators.bytesToSize(data.dataSize),
              extentFreeListNum: (data.extentFreeList && data.extentFreeList.num ? data.extentFreeList.num : null),
              fileSize: (data.fileSize === undefined ? null : validators.bytesToSize(data.fileSize)),
              indexes: data.indexes,
              indexSize: validators.bytesToSize(data.indexSize),
              numExtents: (data.numExtents ? data.numExtents.toString() : null),
              objects: data.objects,
              storageSize: validators.bytesToSize(data.storageSize)
            }
          }
          res.render('database', ctx)
        }).catch((error) => {
          global.req.session.error = `Could not get stats. ${JSON.stringify(error)}`
          console.error(error)
          res.redirect('back')
        })
      }).catch((error) => {
        global.req.session.error = `Could not refresh collections. ${JSON.stringify(error)}`
        console.error(error)
        res.redirect('back')
      })
    }
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