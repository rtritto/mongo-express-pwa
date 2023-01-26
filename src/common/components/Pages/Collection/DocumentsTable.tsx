import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { JsonViewer } from '@textea/json-viewer'
import { useHydrateAtoms } from 'jotai/utils'

import DeleteModalBoxSimple from 'components/Custom/DeleteModalBoxSimple.tsx'
import { useAtom, useSetAtom } from 'jotai'
import { columnsState, documentCountState, documentsState } from 'src/common/store/globalAtoms.ts'

interface DocumentsTableProps {
  columns: string[]
  deleteUrl: string
  documents: MongoDocument[]
  show: {
    delete: boolean
  }
  TableContainerProps: {
    sx?: object
  }
}

const getTableCells = (columns: string[], document: MongoDocument, index: number) => {
  return columns.map((column) => {
    const field = document[column] as string | object | undefined | null
    return (typeof field === 'object' ?? Array.isArray(field)) ? (
      <TableCell key={`${column}${index}`} sx={{ backgroundColor: '#181818', py: 1 }}>
        <JsonViewer
          collapseStringsAfterLength={50}
          defaultInspectDepth={1}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          indentWidth={2}
          props={{ inspect: false }}
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

const DocumentsTable = ({
  columns: columnsInit,
  documents: documentsInit,
  show,
  deleteUrl,
  TableContainerProps = {}
}: DocumentsTableProps) => {
  useHydrateAtoms([
    [columnsState, columnsInit],
    [documentsState, documentsInit]
  ])
  const [columns, setColumns] = useAtom<string[]>(columnsState)
  const [documents, setDocuments] = useAtom<MongoDocument[]>(documentsState)
  const setCount = useSetAtom<number>(documentCountState)

  const updateDocuments = (id: string) => {
    const indexToRemove = documents.findIndex((document) => document._id === id)
    const documentsNew = [
      ...documents.slice(0, indexToRemove),
      ...documents.slice(indexToRemove + 1)
    ]

    setDocuments(() => documentsNew)
    setColumns(() => {
      const columnsNew = new Set<string>()
      for (const document of documentsNew) {
        for (const field in document) {
          columnsNew.add(field)
        }
      }
      return Array.from(columnsNew)
    })
    setCount((oldCount) => oldCount - 1)
  }

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
                  <DeleteModalBoxSimple
                    // TODO add (json | safe | url_encode filter) to _id
                    deleteUrl={`${deleteUrl}/${document._id}`}
                    messages={{
                      modal: `Are you sure you want delete _id "${document._id}"?`,
                      success: `Document _id "${document._id}" deleted!`
                    }}
                    // TODO handle query
                    // query={}
                    ButtonProps={{ sx: { minWidth: 0 } }}
                    additionaOnDelete={() => updateDocuments(document._id)}
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