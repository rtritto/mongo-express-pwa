import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const getRowsComponent = (fields: Fields) => {
  const outRaw = []
  for (const cell in fields) {
    outRaw.push([
      <TableCell key={`cellName${cell}`}>
        <strong>{fields[cell].label}</strong>
      </TableCell>,
      <TableCell key={`cellValue${cell}`} id={cell}>
        {fields[cell].value}
      </TableCell>
    ])
  }
  const out = []
  for (let index = 0, length_ = outRaw.length; index < length_; index += 2) {
    const tableRow = [
      ...outRaw[index]
    ]
    if (index + 1 < length_) {
      tableRow.push(...outRaw[index + 1])
    }
    out.push(
      <TableRow key={`row${index}`}>
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
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold', pt: 0.5 }}>
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