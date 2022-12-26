import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const TableCellStyle = {
  // border: 1,
  padding: 0.8
}

declare interface Stats {
  [key: string]: {
    label: string
    value: string | null
  }
}

const getStatsRows = (stats: Stats) => {
  const out = []
  for (const stat in stats) {
    if (stats[stat].value) {
      out.push(
        <TableRow key={`row${stat}`}>
          <TableCell key={`cellName${stat}`} sx={TableCellStyle}>
            <strong>{stats[stat].label}</strong>
          </TableCell>

          <TableCell key={`cellValue${stat}`} id={stat} sx={TableCellStyle}>
            {stats[stat].value}
          </TableCell>
        </TableRow>
      )
    }
  }
  return out
}

const DatabaseStatsTable = ({ stats }: { stats: Stats }) => {
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
          {getStatsRows(stats)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DatabaseStatsTable