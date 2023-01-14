import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { JsonViewer } from '@textea/json-viewer'

interface DocumentsTableProps {
  columns: string[]
  documents: MongoDocument[]
}

const getCellComponent = (key: string, field: string | object | undefined | null) => {
  return (typeof field === 'object' ?? Array.isArray(field)) ? (
    <TableCell key={key} sx={{ verticalAlign: 'top', backgroundColor: '#181818' }}>
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
    <TableCell key={key} sx={{ verticalAlign: 'top', py: 0.75 }}>
      <>{field}</>
    </TableCell>
  )
}

const DocumentsTable = ({ columns, documents }: DocumentsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {/* TODO add sort by column */}
            {columns.map((column) => (
              <TableCell key={`headCell${column}`}>
                <strong>{column}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.map((document, index) => (
            <TableRow key={`document${index}`}>
              {columns.map((column) => (
                getCellComponent(`${column}${index}`, document[column])
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DocumentsTable