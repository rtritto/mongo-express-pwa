import { Alert, Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import StatsTable from 'components/Custom/StatsTable.tsx'
import { EP_DATABASE } from 'configs/endpoints.ts'
import * as bson from 'utils/bson.ts'
import * as mapFuncs from 'utils/mapFuncs.ts'
import * as queries from 'utils/queries.ts'

declare interface Params extends ParsedUrlQuery {
  collectionName: string
  dbName: string
}

declare interface DatabasePageProps {
  collectionName: string
  ctx: ReturnType<typeof mapFuncs.getCtx>
  messageError: string | null
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  title: string
}

const CollectionPage = ({ ctx, collectionName, messageError, options, title }: DatabasePageProps) => {
  const { noDelete, noExport, readOnly } = options
  return (
    <div>
      <Head>
        <title>{title}</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        {messageError && (
          <Alert severity="error" onClose={() => { }} sx={{ my: 2 }}>
            {messageError}
          </Alert>
        )}

        <Typography component="h4" gutterBottom variant="h4">
          Viewing Collection: {collectionName}
        </Typography>

        {/* <Divider sx={{ border: 1, my: 1.5 }} />

        <ShowCollections
          collections={ctx.collections}
          database={dbName}
          show={{
            create: readOnly === false,
            export: noExport === false,
            delete: noDelete === false
          }}
        /> */}

        {/* TODO GridFS Buckets grids.length && settings.gridFSEnabled */}

        {/* TODO Create GridFS Bucket */}

        {/* <StatsTable label="" fields={ctx.stats} /> */}
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, query: reqQuery, req }) => {
  const { collectionName, dbName } = params as Params

  // Make sure database exists
  if (global.mongo.collections[dbName].includes(collectionName)) {
    const collection = global.mongo.connections[dbName].db.collection(collectionName)
    if (collection === null) {
      global.session.messageError = `Collection "${collectionName}" not found!`
    } else {
      // TODO ???
      // global.req.collectionName = collectionName
      // res.locals.gridFSBuckets = colsToGrid(mongo.global.collections[dbName])
      // req.collection = coll

      try {
        const queryOptions = queries.getQueryOptions(reqQuery)
        const query = queries.getQuery(reqQuery)

        let items
        let count
        if (reqQuery.runAggregate === 'on') {
          if (query.constructor.name === 'Object') {
            const queryAggregate = queries.getSimpleAggregatePipeline(query, queryOptions)
            [items, count] = await Promise.all([
              collection.aggregate(queryAggregate).toArray(),
              collection.countDocuments(query)
            ])
          } else {
            // Array case
            const queryAggregate = queries.getComplexAggregatePipeline(query, queryOptions)
            const [resultArray] = await collection.aggregate(queryAggregate).toArray()
            items = resultArray.data
            count = resultArray.metadata.total
          }
        } else {
          [items, count] = await Promise.all([
            collection.find(query, queryOptions).toArray(),
            collection.countDocuments(query)
          ])
        }

        const [stats, indexes] = await Promise.all([
          collection.stats(),
          collection.indexes()
        ])

        const docs: object[] = []
        let columns = []

        for (const i in items) {
          // Prep items with stubs so as not to send large info down the wire
          for (const prop in items[i]) {
            if (mapFuncs.roughSizeOfObject(items[i][prop]) > process.env.config.options.maxPropSize) {
              items[i][prop] = {
                attribu: prop,
                display: '*** LARGE PROPERTY ***',
                humanSz: mapFuncs.bytesToSize(mapFuncs.roughSizeOfObject(items[i][prop])),
                maxSize: mapFuncs.bytesToSize(process.env.config.options.maxPropSize),
                preview: JSON.stringify(items[i][prop]).slice(0, 25),
                roughSz: mapFuncs.roughSizeOfObject(items[i][prop]),
                _id: items[i]._id
              }
            }
          }

          // If after prepping the row is still too big
          if (mapFuncs.roughSizeOfObject(items[i]) > process.env.config.options.maxRowSize) {
            for (const prop in items[i]) {
              if (prop !== '_id' && mapFuncs.roughSizeOfObject(items[i][prop]) > 200) {
                items[i][prop] = {
                  attribu: prop,
                  display: '*** LARGE ROW ***',
                  humanSz: mapFuncs.bytesToSize(mapFuncs.roughSizeOfObject(items[i][prop])),
                  maxSize: mapFuncs.bytesToSize(process.env.config.options.maxRowSize),
                  preview: JSON.stringify(items[i][prop]).slice(0, 25),
                  roughSz: mapFuncs.roughSizeOfObject(items[i][prop]),
                  _id: items[i]._id
                }
              }
            }
          }

          docs[i] = items[i]
          columns.push(Object.keys(items[i]))
          items[i] = bson.toString(items[i])
        }

        const { indexSizes } = stats;
        for (let n = 0, nn = indexes.length; n < nn; n++) {
          indexes[n].size = indexSizes[indexes[n].name]
        }

        // Generate an array of columns used by all documents visible on this page
        columns = columns.flat()
        columns = columns.filter((value, index, array) => array.indexOf(value) === index)

        // Pagination
        const { limit, skip, sort } = queryOptions
        const pagination = count > limit

        // determine default key
        const defaultKey = (process.env.config.defaultKeyNames[dbName] && process.env.config.defaultKeyNames[dbName][collectionName])
          ? process.env.config.defaultKeyNames[dbName][collectionName]
          : '_id'

        // const ctx = {
        //   title: 'Viewing Collection: ' + req.collectionName,
        //   documents: items, // Docs converted to strings
        //   docs,       // Original docs
        //   columns, // All used columns
        //   count, // total number of docs returned by the query
        //   stats,
        //   editorTheme: config.options.editorTheme,
        //   limit,
        //   skip,
        //   sort,
        //   pagination,
        //   key: reqQuery.key,
        //   value: reqQuery.value,
        //   // value: type === 'O' ? ['ObjectId("', value, '")'].join('') : value,
        //   type: reqQuery.type,
        //   query: reqQuery.query,
        //   projection: reqQuery.projection,
        //   runAggregate: reqQuery.runAggregate === 'on',
        //   defaultKey,
        //   edKey,
        //   indexes
        // }
        const { messageError } = global.session
        delete global.session.messageError

        return {
          props: {
            // ctx,
            // dbName,
            collectionName,
            ...messageError !== undefined && { messageError },
            options: process.env.config.options,
            title: `${collectionName} - Mongo Express`
          }
        }
      } catch (error) {
        console.error(error)
        global.session.messageError = error.message
      }
    }
  } else {
    global.session.messageError = `Collection "${collectionName}" not found!`
  }



  // try {
  //   await global.req.updateCollections(global.mongo.connections[dbName])

  //   try {
  //     const ctx = getCtx(data, dbName)

  //     return {
  //       props: {
  //         ctx,
  //         dbName,
  //         options: process.env.config.options,
  //         title: `${dbName} - Mongo Express`
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     global.session.messageError = `Could not get stats. ${error}`
  //   }
  // } catch (error) {
  //   console.error(error)
  //   global.session.messageError = `Could not refresh collections. ${error}`
  // }

  // return {
  //   redirect: {
  //     destination,
  //     permanent: false
  //   }
  // }

  return {
    redirect: {
      destination: EP_DATABASE(dbName),
      permanent: false
    }
  }
}

export default CollectionPage