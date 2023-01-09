import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { convertBytes } from 'lib/utils.ts'

const HEADER_FIELDS = new Set(['Name', 'Columns', 'Size', 'Attributes', 'Actions'])
const NOT_ATTRIBUTE_FIELDS = new Set(['key', 'v', 'name', 'ns', 'size'])

interface StatsTableProps {
  indexes: Indexes
  show: {
    delete: boolean
  }
}

const Headers = () => {
  const headers = []
  for (const field of HEADER_FIELDS) {
    headers.push(
      <TableCell key={`headerCell${field}`} sx={{ px: 1.5, py: 0.5 }}>
        <b>{field}</b>
      </TableCell>
    )
  }
  return <>{headers}</>
}

const getColumns = (key: Index['key']) => {
  const columns = []
  for (const indexName in key) {
    columns.push(<div key="indexName">{indexName} {key[indexName] === 1 ? 'ASC' : 'DSC'}</div>)
  }
  return columns
}

const getAttributes = (index: Index) => {
  const attributes = []
  for (const key in index) {
    if (!NOT_ATTRIBUTE_FIELDS.has(key)) {
      attributes.push(<div>{key}: {index[key]}</div>)
    }
  }
  return attributes
}

const IndexesTable = ({ indexes, show }: StatsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold', pt: 0.5 }}>
                Indexes
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <Headers />
          </TableRow>
        </TableHead>

        <TableBody>
          {indexes.map((index) => (
            <TableRow key={`row${index.name}`}>
              <TableCell key={'cellName'} id="cellName">
                {index.name}
              </TableCell>

              <TableCell key={'cellColumns'} id="cellColumns">
                {getColumns(index.key)}
              </TableCell>

              <TableCell key={'cellSize'} id="cellSize">
                {convertBytes(index.size)}
              </TableCell>

              <TableCell key={'cellAttributes'} id="cellAttributes">
                {getAttributes(index)}
              </TableCell>

              {show.delete === true && (
                // TODO
                <TableCell key={'cellDeleteIndex'} id="cellDeleteIndex">

                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default IndexesTable