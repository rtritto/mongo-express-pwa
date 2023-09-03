import { Container, Divider, Typography } from '@mui/material'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head.js'

import { EP_DATABASE } from 'configs/endpoints.ts'
import { getGlobalValueAndReset, setGlobalValue } from 'lib/GlobalRef.ts'
import { collectionsState, databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'
import { connectClient } from 'src/lib/db.ts'

const getRedirect = (dbName: string): { redirect: Redirect } => ({
  redirect: {
    destination: EP_DATABASE(dbName),
    permanent: false
  }
})

interface CollectionPageProps {
  collections: Mongo['collections']
  databases: Mongo['databases']
  dbName: string
  documentId: string
  messageError?: string
  messageSuccess?: string
  options: {
    readOnly: boolean
  }
  title: string
}

const CollectionPage = ({
  collections: collectionsInit,
  databases: databasesInit,
  dbName,
  documentId,
  messageError,
  messageSuccess,
  options: { readOnly },
  title
}: CollectionPageProps) => {
  const { current: initialValues } = useRef([
    [collectionsState, collectionsInit],
    [databasesState, databasesInit]
  ] as const)
  useHydrateAtoms(initialValues)

  const setCollections = useSetAtom(collectionsState)
  const setDatabases = useSetAtom(databasesState)
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
          {readOnly ? 'Viewing' : 'Editing'} Document: <strong>{documentId}</strong>
        </Typography>

        <Divider sx={{ border: 0.5 }} />

      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<CollectionPageProps, Params> = async ({ params }) => {
  await connectClient()
  const { collectionName, dbName, documentId } = params as Params

  // Make sure database exists
  if (!(dbName in global._mongo.connections)) {
    setGlobalValue('messageError', `Database "${dbName}" not found!`)
    return getRedirect(dbName)
  }
  // Make sure collection exists
  if (!global._mongo.collections[dbName].includes(collectionName)) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  const collection = global._mongo.connections[dbName].db.collection(collectionName)
  if (collection === null) {
    setGlobalValue('messageError', `Collection "${collectionName}" not found!`)
    return getRedirect(dbName)
  }
  // TODO ???
  // global.req.collectionName = collectionName
  // res.locals.gridFSBuckets = colsToGrid(mongo.collections[dbName])
  // req.collection = coll

  try {
    // Get messages from redirect
    const messageError = getGlobalValueAndReset('messageError')
    const messageSuccess = getGlobalValueAndReset('messageSuccess')

    return {
      props: {
        collections: global._mongo.collections,
        databases: global._mongo.databases,
        documentId: documentId,
        ...messageError !== undefined && { messageError },
        ...messageSuccess !== undefined && { messageSuccess },
        options: process.env.config.options,
        title: `${documentId} - Mongo Express`
      }
    }
  } catch (error) {
    console.error(error)
    setGlobalValue('messageError', error.message)
    return getRedirect(dbName)
  }
}

export default CollectionPage