import { Container, Divider, Typography } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head.js'
import { useRouter } from 'next/router.js'

import DeleteModalBoxSimple from 'components/Custom/DeleteModalBoxSimple.tsx'
import StatsTable from 'components/Custom/StatsTable.tsx'
import IndexesTable from 'components/Pages/Collection/IndexesTable.tsx'
import DocumentsTable from 'components/Pages/Collection/DocumentsTable.tsx'
import PaginationBox from 'components/Pages/Collection/PaginationBox.tsx'
import RenameCollection from 'components/Pages/Collection/RenameCollection.tsx'
import Tools from 'components/Pages/Collection/Tools.tsx'
import { EP_API_DATABASE_COLLECTION, EP_DATABASE } from 'configs/endpoints.ts'
import * as bson from 'lib/bson.ts'
import {
  getComplexAggregatePipeline,
  getLastPage,
  getQuery,
  getQueryOptions,
  getSimpleAggregatePipeline
} from 'lib/queries.ts'
import { mapCollectionStats } from 'lib/mapInfo.ts'
// TODO move utils import and related logic that use it to lib/mapInfo.ts
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { stringDocIDs } from 'lib/filters.ts'
import { columnsState, documentsState, selectedCollectionState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const getRedirect = (dbName: string): { redirect: Redirect } => ({
  redirect: {
    destination: EP_DATABASE(dbName),
    permanent: false
  }
})

interface CollectionPageProps {
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
  title: string
}

const CollectionPage = ({
  dbName,
  collectionStats,
  columns: columnsInit,
  count,
  currentPage: currentPageInit,
  documentsJS: documentsInit,
  // documentsString,
  indexes,
  lastPage: lastPageInit,
  limit,
  messageError,
  messageSuccess,
  options: { noDelete, noExport, readOnly },
  query,
  title
}: CollectionPageProps) => {
  const router = useRouter()

  const collectionName = useAtomValue<string>(selectedCollectionState)
  const [columns, setColumns] = useAtom<string[]>(columnsState(columnsInit))
  const [documents, setDocuments] = useAtom<string[]>(documentsState(documentsInit))
  const [error, setError] = useAtom<string | undefined>(messageErrorState)
  const [success, setSuccess] = useAtom<string | undefined>(messageSuccessState)

  const [currentPage, setCurrentPage] = useState(currentPageInit)
  const [lastPage, setLastPage] = useState(lastPageInit)

  // Show alerts if messages exist
  useEffect(() => {
    if (error !== messageError) {
      setError(messageError)
    }
    if (success !== messageSuccess) {
      setSuccess(messageSuccess)
    }
  }, [messageError, messageSuccess])

  const handleClickPage = async (pageClicked: number, limit: number) => {
    const queryParams = `?${new URLSearchParams({
      limit: limit.toString(),
      skip: ((pageClicked - 1) * limit).toString()
    })}`
    await fetch(`${EP_API_DATABASE_COLLECTION(dbName, collectionName)}${queryParams}`, {
      method: 'GET'
    }).then(async (res) => {
      if (res.ok === true) {
        const documentsNew = await res.json()
        setDocuments(documentsNew)

        const columnsNew = new Set<string>()
        for (const document of documentsNew) {
          for (const field in document) {
            columnsNew.add(field)
          }
        }
        setColumns(Array.from(columnsNew))
        await router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            page: pageClicked.toString()
          }
        }, undefined, { shallow: true })
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  const PaginationBoxComponent = (lastPage !== 1) && (
    <PaginationBox  // load Component when totalPage > 1
      currentPage={currentPage}
      lastPage={lastPage}
      onChange={(event, pageClicked: number) => {
        if (currentPage !== pageClicked) {
          handleClickPage(pageClicked, limit)
          setCurrentPage(pageClicked)
        }
      }}
    />
  )

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

        {readOnly === false && noDelete === false && count > 0 && <DeleteModalBoxSimple
          deleteUrl={EP_API_DATABASE_COLLECTION(dbName, collectionName)}
          query={query}
          messages={{
            button: `Delete all ${count} document(s)`,
            modal: <>You want to delete all <strong>{count}</strong> document(s)?</>,
            success: `${count} documents deleted!`
          }}
          ButtonProps={{ sx: { width: "100%" } }}
        />}

        {/* <Divider sx={{ border: 1, my: 1.5 }} /> */}

        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <>
            {PaginationBoxComponent}

            <DocumentsTable
              columns={columns}
              deleteUrl={EP_API_DATABASE_COLLECTION(dbName, collectionName)}
              documents={documents}
              show={{
                delete: readOnly === false && noDelete === false
                  && collectionName !== 'system.indexes'
                  && columns.includes('_id')
              }}
            />

            {PaginationBoxComponent}
          </>
        )}

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

  // Make sure database exists
  if (!(dbName in global.mongo.connections)) {
    setGlobalValue('messageError', `Database "${dbName}" not found!`)
    return getRedirect(dbName)
  }
  // Make sure collection exists
  if (!global.mongo.collections[dbName].includes(collectionName)) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  const collection = global.mongo.connections[dbName].db.collection(collectionName)
  if (collection === null) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  // TODO ???
  // global.req.collectionName = collectionName
  // res.locals.gridFSBuckets = colsToGrid(global.mongo.collections[dbName])
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
      const valuesString = await Promise.all(Object.values(item).map(stringDocIDs))
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

    const ctx = {
      editorTheme: process.env.config.options.editorTheme,
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
        columns: Array.from(columns),  // All used columns
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