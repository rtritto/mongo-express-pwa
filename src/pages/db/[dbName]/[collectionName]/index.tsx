import { Container, Divider, Typography } from '@mui/material'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head.js'

import StatsTable from 'components/Custom/StatsTable.tsx'
import DeleteDocuments from 'components/Pages/Collection/DeleteDocuments.tsx'
import IndexesTable from 'components/Pages/Collection/IndexesTable.tsx'
import ShowDocuments from 'components/Pages/Collection/ShowDocuments.tsx'
import RenameCollection from 'components/Pages/Collection/RenameCollection.tsx'
import Tools from 'components/Pages/Collection/Tools.tsx'
import { EP_DATABASE } from 'configs/endpoints.ts'
import * as bson from 'lib/bson.ts'
import {
  getComplexAggregatePipeline, getLastPage, getQuery, getQueryOptions,
  getSimpleAggregatePipeline
} from 'lib/queries.ts'
import { mapCollectionStats } from 'lib/mapInfo.ts'
// TODO move utils import and related logic that use it to lib/mapInfo.ts
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { stringDocIDs } from 'lib/filters.ts'
import {
  collectionsState, columnsState, databasesState, documentsState,
  documentCountState, selectedCollectionState, messageErrorState,
  messageSuccessState
} from 'store/globalAtoms.ts'
import { mongo } from 'src/lib/db.ts'

const getRedirect = (dbName: string): { redirect: Redirect } => ({
  redirect: {
    destination: EP_DATABASE(dbName),
    permanent: false
  }
})

interface CollectionPageProps {
  collections: Mongo['collections']
  databases: Mongo['databases']
  collectionStats: ReturnType<typeof mapCollectionStats>
  columns: string[]
  count: number
  currentPage: number
  dbName: string
  documentsJS: MongoDocument[]
  // documentsString: string[]
  indexes: Indexes
  lastPage: number
  limit: number
  messageError?: string
  messageSuccess?: string
  options: {
    noDelete: boolean
    noExport: boolean
    readOnly: boolean
  }
  query?: string | string[]
  runAggregate: boolean
  title: string
}

const CollectionPage = ({
  collections: collectionsInit,
  databases: databasesInit,
  dbName,
  collectionStats,
  columns: columnsInit,
  count,
  currentPage,
  documentsJS: documentsInit,
  // documentsString,
  indexes,
  lastPage,
  limit,
  messageError,
  messageSuccess,
  options: { noDelete, noExport, readOnly },
  query,
  title
}: CollectionPageProps) => {
  const { current: initialValues } = useRef([
    [collectionsState, collectionsInit],
    [databasesState, databasesInit],
    [columnsState, columnsInit],
    [documentsState, documentsInit],
    [documentCountState, count]
  ] as const)
  useHydrateAtoms(initialValues)

  const setCollections = useSetAtom(collectionsState)
  const setDatabases = useSetAtom(databasesState)
  const [columns, setColumns] = useAtom(columnsState)
  const [documents, setDocuments] = useAtom(documentsState)
  const setDocumentCount = useSetAtom(documentCountState)
  const collectionName = useAtomValue(selectedCollectionState)
  const [error, setError] = useAtom(messageErrorState)
  const [success, setSuccess] = useAtom(messageSuccessState)

  useEffect(() => {
    setCollections(collectionsInit)
  }, [collectionsInit, setCollections])
  useEffect(() => {
    setDatabases(databasesInit)
  }, [databasesInit, setDatabases])
  useEffect(() => {
    setDatabases(databasesInit)
  }, [databasesInit, setDatabases])
  useEffect(() => {
    setColumns(columnsInit)
    setDocuments(documentsInit)
    setDocumentCount(count)
  }, [columnsInit, documentsInit, count, setColumns, setDocuments, setDocumentCount])
  // Show alerts if messages exist
  useEffect(() => {
    if (error !== messageError) {
      setError(messageError)
    }
    if (success !== messageSuccess) {
      setSuccess(messageSuccess)
    }
  }, [error, success, messageError, messageSuccess, setError, setSuccess])



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

        <DeleteDocuments
          database={dbName}
          collection={collectionName}
          query={query || '{}'}  // delete all documents
          show={readOnly === false && noDelete === false}
        />

        {/* <Divider sx={{ border: 1, my: 1.5 }} /> */}

        {/* {documents.length === 0
          ? <p>No documents found.</p>
          : <ShowDocuments
            columns={columns}
            currentPage={currentPage}
            collection={collectionName}
            database={dbName}
            documents={documents}
            lastPage={lastPage}
            limit={limit}
            show={{
              delete: readOnly === false && noDelete === false
                && collectionName !== 'system.indexes'
                && columns.includes('_id')
            }}
          />} */}

        {readOnly === false && <RenameCollection collectionName={collectionName} dbName={dbName} />}

        <Tools collection={collectionName} database={dbName}
          show={{
            delete: noDelete === false,
            export: noExport === false,
            readOnly
          }}
        />

        <StatsTable label="Collection Stats" fields={collectionStats} />

        <IndexesTable indexes={indexes} show={{ delete: readOnly === false && noDelete === false }} />
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<CollectionPageProps, Params> = async ({ params, query }) => {
  const { collectionName, dbName } = params as Params
  const client = await mongo.connect()

  // Make sure database exists
  if (!(dbName in mongo.connections)) {
    setGlobalValue('messageError', `Database "${dbName}" not found!`)
    return getRedirect(dbName)
  }
  // Make sure collection exists
  if (!mongo.collections[dbName].includes(collectionName)) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  const collection = mongo.connections[dbName].db.collection(collectionName)
  if (collection === null) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  // TODO ???
  // global.req.collectionName = collectionName
  // res.locals.gridFSBuckets = colsToGrid(mongo.collections[dbName])
  // req.collection = coll

  try {
    const filterOptions = getQueryOptions(query)
    const filter = getQuery(query)

    let items
    let count
    if (query.runAggregate === 'on') {
      if (filter.constructor.name === 'Object') {
        const filterAggregate = getSimpleAggregatePipeline(filter, filterOptions)
        [items, count] = await Promise.all([
          collection.aggregate(filterAggregate).toArray(),
          collection.countDocuments(filter)
        ])
      } else {
        // Array case
        const filterAggregate = getComplexAggregatePipeline(filter, filterOptions)
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
      collection.indexes() as Promise<Indexes>
    ])

    // Add index size
    const { indexSizes } = stats
    for (const index of indexes) {
      index.size = indexSizes[index.name]
    }

    const documentsJS: MongoDocument[] = []
    const documentsString: string[] = []
    // Generate an array of columns used by all documents visible on this page
    const columns = new Set<string>()

    for (const item of items) {
      const valuesString = await Promise.all(Object.values(item).map((value) => stringDocIDs(value)))
      const documentJS: MongoDocument = {}
      for (const [index, field] of Object.keys(item).entries()) {
        documentJS[field] = valuesString[index]
        columns.add(field)
      }

      documentsJS.push(documentJS)
      documentsString.push(bson.toString(item))
    }

    // Pagination
    const { limit /* TODO skip, sort */ } = filterOptions

    // const ctx = {
    //   editorTheme: process.env.config.options.editorTheme,
    //   sort,
    //   key: query.key,
    //   value: query.value,  // value: type === 'O' ? ['ObjectId("', value, '")'].join('') : value,
    //   type: query.type,
    //   projection: query.projection
    // }

    const collectionStats = mapCollectionStats(stats)

    // Get messages from redirect
    const messageError = getGlobalValueAndReset('messageError')
    const messageSuccess = getGlobalValueAndReset('messageSuccess')

    return {
      props: {
        // ctx,
        collections: mongo.collections,
        databases: mongo.databases,
        collectionStats,
        columns: [...columns],  // All used columns
        count,  // total number of docs returned by the query
        dbName,
        documentsJS,  // Original docs
        // documentsString, // Docs converted to strings
        indexes,
        ...count > limit ? {  // true for pagination
          currentPage: query.page ? Number.parseInt(query.page, 10) : 1,
          lastPage: getLastPage(limit, count)
        } : {
          currentPage: 1,
          lastPage: 1
        },
        limit,
        ...messageError !== undefined && { messageError },
        ...messageSuccess !== undefined && { messageSuccess },
        options: process.env.config.options,
        ...'query' in query && { query: query.query },
        runAggregate: query.runAggregate === 'on',
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