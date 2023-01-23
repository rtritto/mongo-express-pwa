import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import DeleteModalBoxCollection from 'components/Custom/DeleteModalBoxCollection.tsx'

interface ToolsProps {
  collection: string
  database: string
  show: {
    delete: boolean
    export: boolean
    readOnly: boolean
  }
}

const Tools = ({ collection, database, show }: ToolsProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={7}>
              <Typography component="h6" variant="h6" sx={{ fontWeight: 'bold', pt: 0.5 }}>
                Tools
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <>
              {show.export === true && (
                <>
                  <TableCell>Export Standard</TableCell>
                  <TableCell>Export --jsonArray</TableCell>
                  <TableCell>Export --csv</TableCell>
                </>
              )}

              <TableCell>Reindex</TableCell>

              <TableCell>Import --mongoexport json</TableCell>

              {show.readOnly === false && (
                <>
                  <TableCell>Compact</TableCell>

                  {show.delete === true && (
                    <TableCell>
                      <DeleteModalBoxCollection collection={collection} database={database} />
                    </TableCell>
                  )}
                </>
              )}
            </>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Tools