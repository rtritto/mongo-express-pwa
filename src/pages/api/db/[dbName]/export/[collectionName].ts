import { EOL } from 'node:os'

import { toJsonString } from 'lib/bson.ts'
import { getQuery, getSort } from 'lib/queries.ts'
import { checkDatabase, checkCollection } from 'lib/validations.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {  // exportCollection
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    // TODO ? change to getQueryOptions
    const queryOptions = { ...req.query.sort && { sort: getSort(req.query.sort) } }
    const query = getQuery(req.query)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURI(collectionName)}.json"; filename*=UTF-8''${encodeURI(collectionName)}.json`
    )
    res.setHeader('Content-Type', 'application/json')
    const client = await global.mongo.connect()
    await client.db(dbName).collection(collectionName).find(query, queryOptions).stream({
      transform(item) {
        return `${toJsonString(item)}${EOL}`
      }
    }).pipe(res)
  }
}

export default handler