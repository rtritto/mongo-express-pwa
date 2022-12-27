import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const TableCellStyle = {
  // border: 1,
  padding: 0.8
}

const getRowsComponent = (fields: Fields) => {
  const outRaw = []
  for (const cell in fields) {
    if (fields[cell].value) {
      outRaw.push([
        <TableCell key={`cellName${cell}`} sx={TableCellStyle}>
          <strong>{fields[cell].label}</strong>
        </TableCell>,
        <TableCell key={`cellValue${cell}`} id={cell} sx={TableCellStyle}>
          {fields[cell].value}
        </TableCell>
      ])
    }
  }
  const out = []
  for (let i = 0, len = outRaw.length; i < len; i = i + 2) {
    const tableRow = [
      ...outRaw[i],
      ...i + 1 < len
        ? [...outRaw[i + 1]]
        : []
    ]
    out.push(
      <TableRow key={`row${i}`}>
        {tableRow}
      </TableRow>
    )
  }
  return out
}

const ServerStatusTable = ({ fields }: { fields: Fields }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ px: 1.5, py: 1 }}>
          <TableRow>
            <TableCell sx={TableCellStyle} colSpan={4}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold', p: 0.5 }}>
                Server Status
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {getRowsComponent(fields)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ServerStatusTable