import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const getRowsComponent = (fields: Fields) => {
  const outRaw = []
  for (const cell in fields) {
    if (fields[cell].value) {
      outRaw.push([
        <TableCell key={`cellName${cell}`}>
          <strong>{fields[cell].label}</strong>
        </TableCell>,
        <TableCell key={`cellValue${cell}`} id={cell}>
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

declare interface StatsTableProps {
  label: string
  fields: Fields
}

const StatsTable = ({ label, fields }: StatsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold', p: 0.5 }}>
                {label}
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

export default StatsTable