import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const TableCellStyle = {
  // border: 1,
  padding: 0.8
}

const ServerStatusTable = ({ rows }: { rows: ReturnType<typeof mapMongoDBInfoForTable> }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
          {rows.map((row, index) => (
            <TableRow key={`row${index}`}>
              {row.length > 0
                ? row.map((cell) => [
                  <TableCell key={`cellName${index}`} sx={TableCellStyle}>
                    <strong>{cell.name}</strong>
                  </TableCell>,
                  <TableCell key={`cellValue${index}`} sx={TableCellStyle} id={cell.id}>
                    {cell.value}
                  </TableCell>
                ])
                : <TableCell key={`cellEmpty${index}`} sx={TableCellStyle} colSpan={4} />
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ServerStatusTable