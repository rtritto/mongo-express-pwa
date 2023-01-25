import { toJsonString } from 'lib/bson.ts'
import { getQuery, getSort } from 'lib/queries.ts'
import { checkDatabase, checkCollection } from 'lib/validations.ts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {  // exportColArray
    const { collectionName, dbName } = req.query as Params
    checkDatabase(dbName)
    checkCollection(dbName, collectionName)

    // TODO ? change to getQueryOptions
    const queryOptions = { ...req.query.sort && { sort: getSort(req.query.sort) } }
    const query = getQuery(req.query)

    const client = await global.mongo.connect()
    const items = await client.db(dbName).collection(collectionName).find(query, queryOptions).toArray()
    res.setHeader(
      'Content-Disposition',
      `attachment filename="${encodeURI(collectionName)}.json" filename*=UTF-8''${encodeURI(collectionName)}.json`
    )
    res.setHeader('Content-Type', 'application/json')
    res.write(toJsonString(items))

    res.end()
    return
  }
  res.status(405).end(`Method ${req.method} Not Allowed!`)
}

export default handler