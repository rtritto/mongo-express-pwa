import * as bson from 'utils/bson.ts'
import * as queries from 'utils/queries.ts'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    // TODO convert to POST
    case 'GET': {  // exportColArray
      try {
        const queryOptions = { sort: queries.getSort(req) }
        const query = queries.getQuery(req)
        await req.collection.find(query, queryOptions).toArray().then((items) => {
          res.setHeader(
            'Content-Disposition',
            'attachment filename="' + encodeURI(req.collectionName) + '.json" filename*=UTF-8\'\'' + encodeURI(req.collectionName)
            + '.json',
          )
          res.setHeader('Content-Type', 'application/json')
          res.write(bson.toJsonString(items))
          res.end()
        })
      } catch (error) {
        req.session.error = error.message
        console.error(error)
        return res.redirect('back')
      }
    }
  }
}

export default handler