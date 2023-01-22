import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { JsonViewer } from '@textea/json-viewer'

import DeleteModalBoxSimple from 'components/Custom/DeleteModalBoxSimple.tsx'

interface DocumentsTableProps {
  columns: string[]
  deleteUrl: string
  documents: MongoDocument[]
  show: {
    delete: boolean
  }
}

const getTableCells = (columns: string[], document: MongoDocument, index: number) => {
  return columns.map((column) => {
    const field = document[column] as string | object | undefined | null
    return (typeof field === 'object' ?? Array.isArray(field)) ? (
      <TableCell key={`${column}${index}`} sx={{ verticalAlign: 'top', backgroundColor: '#181818' }}>
        <JsonViewer
          collapseStringsAfterLength={50}
          defaultInspectDepth={1}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          indentWidth={2}
          props={{ inspect: false }}
          maxDisplayLength={4}
          rootName={false}
          theme="dark"
          value={field}
        />
      </TableCell>
    ) : (
      <TableCell key={`${column}${index}`} sx={{ verticalAlign: 'top', py: 0.75 }}>
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

const DocumentsTable = ({ columns, documents, show, deleteUrl }: DocumentsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {getColumns(columns, show.delete)}
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.map((document, index) => (
            <TableRow key={`doc${index}`}>
              {show.delete === true && (
                <TableCell key={`delDoc${index}`}>
                  <DeleteModalBoxSimple
                    // TODO add (json | safe | url_encode filter) to _id
                    deleteUrl={`${deleteUrl}/${document._id}`}
                    messages={{
                      modal: 'Are you sure?',
                      success: `Document _id '${document._id}' deleted!`
                    }}
                    // TODO handle query
                    // query={}
                    width="100%"
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