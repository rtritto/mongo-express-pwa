import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, type TableContainerProps } from '@mui/material'
import { JsonViewer } from '@textea/json-viewer'
import { useHydrateAtoms } from 'jotai/utils'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router.js'
import { useRef } from 'react'

import DeleteDialogSimple from 'components/Custom/DeleteDialogSimple.tsx'
import { columnsState, documentsState } from 'src/common/store/globalAtoms.ts'

const getTableCells = (columns: string[], document: MongoDocument, index: number) => {
  return columns.map((column) => {
    const field = document[column] as string | object | undefined | null
    return (typeof field === 'object' ?? Array.isArray(field)) ? (
      <TableCell key={`${column}${index}`} sx={{ backgroundColor: '#181818', py: 1 }}>
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
        />
      </TableCell>
    ) : (
      <TableCell key={`${column}${index}`} sx={{ py: 1 }}>
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
      <Table size="small" /*padding="checkbox"*/ >
        <TableHead>
          <TableRow>
            {getColumns(columns, show.delete)}
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.map((document, index) => (
            <TableRow key={`doc${index}`}>
              {show.delete === true && (
                <TableCell key={`delDoc${index}`} width="1%" sx={{ px: 1, py: 0.5 }}>
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

              {getTableCells(columns, document, index)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DocumentsTable