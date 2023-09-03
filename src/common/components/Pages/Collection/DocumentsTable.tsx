import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, type TableContainerProps } from '@mui/material'
import { JsonViewer } from '@textea/json-viewer'
import { useHydrateAtoms } from 'jotai/utils'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router.js'
import { useRef } from 'react'

import CustomLink from 'components/Custom/CustomLink.tsx'
import DeleteDialogSimple from 'components/Custom/DeleteDialogSimple.tsx'
import { columnsState, documentsState } from 'src/common/store/globalAtoms.ts'
import { EP_DATABASE_COLLECTION_DOCUMENT } from 'src/configs/endpoints.ts'

const getTableCells = (columns: string[], document: MongoDocument, index: number) => {
  return columns.map((column) => {
    const field = document[column] as string | object | undefined | null
    return (typeof field === 'object' ?? Array.isArray(field)) ? (
      <TableCell key={`${column}${index}`} sx={{ backgroundColor: '#181818', py: 0.5 }}>
        <JsonViewer
          collapseStringsAfterLength={50}
          defaultInspectDepth={1}
          displayDataTypes={false}
          displaySize={false}
          enableClipboard={false}
          indentWidth={2}
          maxDisplayLength={3}
          rootName={false}
          theme="dark"
          value={field}
          sx={{
            minWidth: 'max-content'
          }}
        />
      </TableCell>
    ) : (
      <TableCell key={`${column}${index}`} sx={{ py: 0.5 }}>
        <>{field}</>
      </TableCell>
    )
  })
}

const getColumns = (columns: string[], showDelete: boolean) => {
  // TODO add sort by column
  const columnsOut = columns.map((column) => (
    <TableCell key={`headCell${column}`}>
      <strong>{column}</strong>
    </TableCell>
  ))
  if (showDelete === true) {
    columnsOut.unshift(<TableCell key={`headCellDel`} />)
  }
  return columnsOut
}

interface DocumentsTableProps {
  collection: string
  database: string
  columns: string[]
  deleteUrl: string
  documents: MongoDocument[]
  show: {
    delete: boolean
  }
  TableContainerProps: {
    sx?: TableContainerProps
  }
}

const DocumentsTable = ({
  collection,
  database,
  columns: columnsInit,
  deleteUrl,
  documents: documentsInit,
  show,
  TableContainerProps = {}
}: DocumentsTableProps) => {
  const { current: initialValues } = useRef([
    [columnsState, columnsInit],
    [documentsState, documentsInit]
  ] as const)
  useHydrateAtoms(initialValues)
  const router = useRouter()
  const columns = useAtomValue(columnsState)
  const documents = useAtomValue(documentsState)

  return (
    <TableContainer component={Paper} sx={{ ...TableContainerProps.sx }}>
      <Table size="small" /*padding="checkbox"*/>
        <TableHead>
          <TableRow>
            {getColumns(columns, show.delete)}
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.map((document, index) => (
            <TableRow key={`doc${index}`}>
              {show.delete === true && (
                <TableCell key={`delDoc${index}`} width="1%" sx={{ px: 0.5, py: 0.5 }}>
                  <DeleteDialogSimple
                    // TODO add (json | safe | url_encode filter) to _id
                    deleteUrl={`${deleteUrl}/${document._id}`}
                    messages={{
                      modal: `Do you want delete document with _id "${document._id}"?`,
                      success: `Document _id "${document._id}" deleted!`
                    }}
                    // TODO handle query
                    // query={}
                    ButtonProps={{ sx: { minWidth: 0 } }}
                    additionalHandle={() => { router.reload() }}
                  />
                </TableCell>
              )}

              <TableCell key={`_id${index}`}>
                <CustomLink
                  key={`_id${index}Link`}
                  // Link
                  href={EP_DATABASE_COLLECTION_DOCUMENT(database, collection, document._id)}
                  style={{
                    textDecoration: 'none'  // remove text underline
                  }}
                  // Button
                  fullWidth
                  sx={{
                    color: 'rgb(153, 143, 143)',
                    justifyContent: 'flex-start',
                    textTransform: 'none',  // remove uppercase
                    ':hover': {
                      color: 'white'
                    },
                    minWidth: 'max-content'
                  }}
                  variant="text"
                >
                  <Typography>{document._id}</Typography>
                </CustomLink>
              </TableCell>

              {getTableCells(columns.slice(1) /*remove _id*/, document, index)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  )
}

export default DocumentsTable