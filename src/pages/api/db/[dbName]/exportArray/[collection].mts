import * as bson from 'lib/bson.ts'
import * as queries from 'lib/queries.ts'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO convert to POST
  if (req.method === 'GET') {  // exportColArray
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

export default handler