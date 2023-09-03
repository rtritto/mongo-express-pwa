import { useSetAtom } from 'jotai'
import dynamic from 'next/dynamic.js'
import { useRouter } from 'next/router.js'
import { useEffect, useRef, useState } from 'react'

import DocumentsTable from './DocumentsTable.tsx'
import PaginationBox from './PaginationBox.tsx'
import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { messageErrorState } from 'store/globalAtoms.ts'

interface ShowDocumentsProps {
  columns: string[]
  currentPage: number
  collection: string
  database: string
  documents: Document[]
  lastPage: number
  limit: number
  show: {
    delete: boolean
  }
}

const ShowDocuments = ({
  columns,
  currentPage: currentPageInit,
  collection,
  database,
  documents,
  lastPage: lastPageInit,
  limit,
  show
}: ShowDocumentsProps) => {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(currentPageInit)
  const [lastPage, setLastPage] = useState(lastPageInit)
  const setError = useSetAtom(messageErrorState)

  const handleClickPage = async (pageClicked: number, limit: number) => {
    const queryParams = `?${new URLSearchParams({
      limit: limit.toString(),
      skip: ((pageClicked - 1) * limit).toString()
    })}`
    await fetch(`${EP_API_DATABASE_COLLECTION(database, collection)}${queryParams}`, {
      method: 'GET'
    }).then(async (res) => {
      if (res.ok === true) {
        const documentsNew = await res.json()

        setDocuments(documentsNew)
        setColumns(() => {
          const columnsNew = new Set<string>()
          for (const document of documentsNew) {
            for (const field in document) {
              columnsNew.add(field)
            }
          }
          return [...columnsNew]
        })
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
    <>
      {PaginationBoxComponent}

      <DocumentsTable
        collection={collection}
        database={database}
        columns={columns}
        deleteUrl={EP_API_DATABASE_COLLECTION(database, collection)}
        documents={documents}
        show={show}
        TableContainerProps={{ sx: lastPage !== 1 ? { margin: 0 } : {} }} // remove margin botton
      />

      {PaginationBoxComponent}
    </>
  )
}

export default dynamic(() => Promise.resolve(ShowDocuments), { ssr: false })