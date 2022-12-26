import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const TableCellStyle = {
  // border: 1,
  padding: 0.8
}

const getRowsComponent = (fields: Fields) => {
  const out = []
  for (const cell in fields) {
    if (fields[cell].value) {
      out.push(
        <TableRow key={`row${cell}`}>
          <TableCell key={`cellName${cell}`} sx={TableCellStyle}>
            <strong>{fields[cell].label}</strong>
          </TableCell>

          <TableCell key={`cellValue${cell}`} id={cell} sx={TableCellStyle}>
            {fields[cell].value}
          </TableCell>
        </TableRow>
      )
    }
  }
  return out
}

const DatabaseStatsTable = ({ fields }: { fields: Fields }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ px: 1.5, py: 1 }}>
          <TableRow>
            <TableCell sx={TableCellStyle} colSpan={2}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold', p: 0.5 }}>
                Database Stats
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

export default DatabaseStatsTable