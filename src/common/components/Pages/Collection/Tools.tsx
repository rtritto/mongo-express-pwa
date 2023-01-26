import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useRouter } from 'next/router.js'

import {
  EP_DATABASE, EP_EXPORT_COLLECTION, EP_EXPORT_ARRAY_COLLECTION,
  EP_IMPORT_COLLECTION
} from 'configs/endpoints.ts'
import DeleteModalBoxCollection from 'components/Custom/DeleteModalBoxCollection.tsx'
import ExportButton from 'components/Custom/ExportButton.tsx'
import ImportButton from 'components/Custom/ImportButton.tsx'

const TableCellStyle = {
  // border: 1,
  p: 0.5
} as const

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
  const router = useRouter()

  const encodedDatabase = encodeURIComponent(database)
  const encodedCollection = encodeURIComponent(collection)

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
                <TableCell key={`export${collection}`} sx={TableCellStyle}>
                  <ExportButton
                    href={EP_EXPORT_COLLECTION(encodedDatabase, encodedCollection)}
                    text="Export"  // Standard
                  />
                </TableCell>
              )}

              <TableCell key={`exportArray${collection}`} sx={TableCellStyle}>
                <ExportButton
                  href={EP_EXPORT_ARRAY_COLLECTION(encodedDatabase, encodedCollection)}
                  text="Export JSON"  // --jsonArray
                />
              </TableCell>

              <TableCell>Export --csv</TableCell>

              <TableCell>Reindex</TableCell>

              <TableCell key={`import${collection}`} sx={TableCellStyle}>
                <ImportButton
                  collection={encodedCollection}
                  href={EP_IMPORT_COLLECTION(encodedDatabase, encodedCollection)}
                  text="Import JSON"  // --mongoexport
                  additionalHandle={() => { router.reload() }}
                />
              </TableCell>

              {show.readOnly === false && (
                <>
                  <TableCell>Compact</TableCell>

                  {show.delete === true && (
                    <TableCell>
                      <DeleteModalBoxCollection
                        collection={collection}
                        database={database}
                        additionalHandle={() => {
                          // Update URI (without page reload)
                          router.push(EP_DATABASE(database), undefined, { shallow: true })
                        }}
                      />
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