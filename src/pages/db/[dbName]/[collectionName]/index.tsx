import { Container, Divider, Typography } from '@mui/material'
import Head from 'next/head.js'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import StatsTable from 'components/Custom/StatsTable.tsx'
import IndexesTable from 'components/Pages/Collection/IndexesTable.tsx'
import DeleteDocuments from 'components/Pages/Collection/DeleteDocuments.tsx'
import RenameCollection from 'components/Pages/Collection/RenameCollection.tsx'
import { EP_DATABASE } from 'configs/endpoints.ts'
import * as bson from 'lib/bson.ts'
import * as queries from 'lib/queries.ts'
import { mapCollectionStats } from 'lib/mapInfo.ts'
// TODO move utils import and related logic that use it to lib/mapInfo.ts
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { bytesToSize, roughSizeOfObject } from 'lib/utils.ts'
import { selectedCollectionState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const getRedirect = (dbName: string): { redirect: Redirect } => ({
  redirect: {
    destination: EP_DATABASE(dbName),
    permanent: false
  }
})

declare interface DatabasePageProps {
  collectionStats: ReturnType<typeof mapCollectionStats>
  count: number
  dbName: string
  documents: Array<Document>
  indexes: Indexes
  messageError: string | undefined
  messageSuccess: string | undefined
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  pagination: boolean
  query: string
  title: string
}

const CollectionPage = (props: DatabasePageProps) => {
  const {
    dbName,
    collectionStats,
    count, documents, indexes, pagination,
    messageError,
    messageSuccess,
    options: { noDelete, noExport, readOnly },
    query,
    title
  } = props

  const collectionName = useRecoilValue<string>(selectedCollectionState)
  const [error, setError] = useRecoilState<string | undefined>(messageErrorState)
  const [success, setSuccess] = useRecoilState<string | undefined>(messageSuccessState)

  // Show alerts if messages exist
  useEffect(() => {
    if (error !== messageError) {
      setError(messageError)
    }
    if (success !== messageSuccess) {
      setSuccess(messageSuccess)
    }
  }, [messageError, messageSuccess])

  return (
    <div>
      <Head>
        <title>{title}</title>

        <meta key="title" content="Home" property="og:title" />
      </Head>

      <Container sx={{ p: 1 }}>
        <Typography component="h4" gutterBottom variant="h4">
          Viewing Collection: <strong>{collectionName}</strong>
        </Typography>

        {readOnly === false && (
          <p>
            <button type="button" data-toggle="modal" data-target="#addDocument">
              New Document
            </button>

            <button type="button" data-toggle="modal" data-target="#addIndex">
              New Index
            </button>
          </p>
        )}

        <ul id="tabs" data-tabs="tabs">
          <li><a href="#simple" data-toggle="tab">Simple</a></li>
          <li><a href="#advanced" data-toggle="tab">Advanced</a></li>
        </ul>

        {readOnly === false && noDelete === false && count > 0 && <DeleteDocuments
          count={count} collectionName={collectionName} dbName={dbName} query={query}
        />}

        {/* <Divider sx={{ border: 1, my: 1.5 }} /> */}

        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <>
            {/* TODO */}
            {pagination === true && <div>Pagination Top</div>}

            {/* TODO */}
            Show Docs

            {/* TODO */}
            {pagination === true && <div>Pagination Bottom</div>}
          </>
        )}

        {readOnly === false && <RenameCollection collectionName={collectionName} dbName={dbName} />}

        {/* TODO Tools */}

        <StatsTable label="Collection Stats" fields={collectionStats} />

        <IndexesTable indexes={indexes} show={{ delete: readOnly === false && noDelete === false }} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const { collectionName, dbName } = params as Params

  // Make sure database exists
  if (!(dbName in global.mongo.connections)) {
    setGlobalValue('messageError', `Database '${dbName}' not found!`)
    return getRedirect(dbName)
  }
  // Make sure collection exists
  if (!global.mongo.collections[dbName].includes(collectionName)) {
    setGlobalValue('messageError', `Collection '${collectionName}' not found!`)
    return getRedirect(dbName)
  }
  const collection = global.mongo.connections[dbName].db.collection(collectionName)
  if (collection === null) {
    setGlobalValue('messageError', `Collection '${collectionName}' not found!`)
    return getRedirect(dbName)
  }
  // TODO ???
  // global.req.collectionName = collectionName
  // res.locals.gridFSBuckets = colsToGrid(global.mongo.collections[dbName])
  // req.collection = coll

  try {
    const filterOptions = queries.getQueryOptions(query)
    const filter = queries.getQuery(query)

    let items
    let count
    if (query.runAggregate === 'on') {
      if (filter.constructor.name === 'Object') {
        const filterAggregate = queries.getSimpleAggregatePipeline(filter, filterOptions)
        [items, count] = await Promise.all([
          collection.aggregate(filterAggregate).toArray(),
          collection.countDocuments(filter)
        ])
      } else {
        // Array case
        const filterAggregate = queries.getComplexAggregatePipeline(filter, filterOptions)
        const [resultArray] = await collection.aggregate(filterAggregate).toArray()
        items = resultArray.data
        count = resultArray.metadata.total
      }
    } else {
      [items, count] = await Promise.all([
        collection.find(filter, filterOptions).toArray(),
        collection.countDocuments(filter)
      ])
    }

    const [stats, indexes] = await Promise.all([
      collection.stats(),
      collection.indexes()
    ])

    // Add index size
    const { indexSizes } = stats
    for (let index = 0, length_ = indexes.length; index < length_; index++) {
      indexes[index].size = indexSizes[indexes[index].name]
    }

    const docs: object[] = []
    let columns = []

    for (const i in items) {
      // Prep items with stubs so as not to send large info down the wire
      for (const prop in items[i]) {
        if (roughSizeOfObject(items[i][prop]) > process.env.config.options.maxPropSize) {
          items[i][prop] = {
            attribu: prop,
            display: '*** LARGE PROPERTY ***',
            humanSz: bytesToSize(roughSizeOfObject(items[i][prop])),
            maxSize: bytesToSize(process.env.config.options.maxPropSize),
            preview: JSON.stringify(items[i][prop]).slice(0, 25),
            roughSz: roughSizeOfObject(items[i][prop]),
            _id: items[i]._id
          }
        }
      }

      // If after prepping the row is still too big
      if (roughSizeOfObject(items[i]) > process.env.config.options.maxRowSize) {
        for (const prop in items[i]) {
          if (prop !== '_id' && roughSizeOfObject(items[i][prop]) > 200) {
            items[i][prop] = {
              attribu: prop,
              display: '*** LARGE ROW ***',
              humanSz: bytesToSize(roughSizeOfObject(items[i][prop])),
              maxSize: bytesToSize(process.env.config.options.maxRowSize),
              preview: JSON.stringify(items[i][prop]).slice(0, 25),
              roughSz: roughSizeOfObject(items[i][prop]),
              _id: items[i]._id
            }
          }
        }
      }

      docs[i] = items[i]
      columns.push(Object.keys(items[i]))
      items[i] = bson.toString(items[i])
    }

    // Generate an array of columns used by all documents visible on this page
    columns = columns.flat()
    columns = columns.filter((value, index, array) => array.indexOf(value) === index)

    // Pagination
    const { limit, skip, sort } = filterOptions
    const pagination = count > limit

    const ctx = {
      // docs,       // Original docs
      columns, // All used columns
      editorTheme: process.env.config.options.editorTheme,
      // limit,
      // skip,
      // sort,
      // key: query.key,
      // value: query.value,  // value: type === 'O' ? ['ObjectId("', value, '")'].join('') : value,
      // type: query.type,
      // projection: query.projection,
      runAggregate: query.runAggregate === 'on'
    }

    const collectionStats = mapCollectionStats(stats)

    // Get messages from redirect
    const messageError = getGlobalValueAndReset('messageError')
    const messageSuccess = getGlobalValueAndReset('messageSuccess')

    return {
      props: {
        // ctx,
        collectionStats,
        count, // total number of docs returned by the query
        dbName,
        documents: items, // Docs converted to strings
        indexes,
        messageError,
        messageSuccess,
        options: process.env.config.options,
        ...'query' in query && { query: query.query },
        pagination,
        title: `Viewing Collection: ${collectionName}`
      }
    }
  } catch (error) {
    console.error(error)
    setGlobalValue('messageError', error.message)
    return getRedirect(dbName)
  }
}

export default CollectionPage