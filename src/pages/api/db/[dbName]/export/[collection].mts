import * as bson from 'utils/bson.ts'
import * as queries from 'utils/queries.ts'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    // TODO convert to POST
    case 'GET': {  // exportCollection
      try {
        const queryOptions = { sort: queries.getSort(req) }
        const query = queries.getQuery(req)
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="' + encodeURI(req.collectionName) + '.json"; filename*=UTF-8\'\'' + encodeURI(req.collectionName)
          + '.json'
        )
        res.setHeader('Content-Type', 'application/json')
        await req.collection.find(query, queryOptions).stream({
          transform(item) {
            return bson.toJsonString(item) + os.EOL;
          }
        }).pipe(res)
      } catch (error) {
        req.session.error = error.message
        console.error(error)
        return res.redirect('back')
      }
    }
  }
}

export default handler