import { Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useSetAtom } from 'jotai'

import { EP_EXPORT_COLLECTION, EP_DB, EP_EXPORT_ARRAY_COLLECTION, EP_IMPORT_COLLECTION } from 'configs/endpoints.ts'
import { Visibility } from 'common/SvgIcons.mts'
import DeleteCollection from 'components/Custom/DeleteCollection.tsx'
import CustomLink from 'components/Custom/CustomLink.tsx'
import ExportButton from 'components/Custom/ExportButton.tsx'
import ImportButton from 'components/Custom/ImportButton.tsx'
import CreateCollection from 'components/Pages/Database/CreateCollection.tsx'
import { selectedCollectionState } from 'store/globalAtoms.ts'

const TableCellStyle = {
  // border: 1,
  p: 0.5
} as const

interface ShowDatabasesProps {
  collections: string[]
  dbName: string
  show: {
    create: boolean
    delete: boolean
    export: boolean
  }
}

const ShowCollections = ({ collections = [], dbName, show }: ShowDatabasesProps) => {
  const setSelectedCollectionState = useSetAtom(selectedCollectionState)

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: 'none', p: 1.5 }}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold' }}>
                Collections
              </Typography>
            </TableCell>

            <TableCell sx={{ px: 1.5, borderLeft: 'none' }} align="right" colSpan={5}>
              {show.create === true && <CreateCollection dbName={dbName} />}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {collections.map((collection) => {
            const encodedDatabase = encodeURIComponent(dbName)
            const encodedCollection = encodeURIComponent(collection)
            const hrefView = `${EP_DB}/${encodedDatabase}/${encodedCollection}`
            return (
              <TableRow key={`row${collection}`}>
                <TableCell key={`view${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    // Link
                    href={hrefView}
                    style={{
                      margin: 1,
                      textDecoration: 'none'  // remove text underline
                    }}
                    // Button
                    startIcon={<SvgIcon><path d={Visibility} /></SvgIcon>}
                    variant="contained"
                    sx={{
                      backgroundColor: 'rgb(86, 124, 86)',
                      flexDirection: 'column',
                      py: 0.5,
                      textTransform: 'none',
                      width: '100%'
                    }}
                  >
                    View
                  </CustomLink>
                </TableCell>

                {show.export === true && (
                  <TableCell key={`export${collection}`} sx={TableCellStyle}>
                    <ExportButton href={EP_EXPORT_COLLECTION(encodedDatabase, encodedCollection)} />
                  </TableCell>
                )}

                <TableCell key={`exportArray${collection}`} sx={TableCellStyle}>
                  <ExportButton
                    href={EP_EXPORT_ARRAY_COLLECTION(encodedDatabase, encodedCollection)}
                    text="[JSON]"
                  />
                </TableCell>

                <TableCell key={`import${collection}`} sx={TableCellStyle}>
                  <ImportButton
                    collection={encodedCollection}
                    href={EP_IMPORT_COLLECTION(encodedDatabase, encodedCollection)}
                  />
                </TableCell>

                <TableCell key={`detail${collection}`} sx={TableCellStyle} width="100%">
                  <CustomLink
                    // Link
                    href={hrefView}
                    style={{
                      margin: 1,
                      textDecoration: 'none',  // remove text underline
                    }}
                    // Button
                    fullWidth
                    variant="text"
                    sx={{
                      // py: 2,
                      justifyContent: 'flex-start',
                      textTransform: 'none' /* remove uppercase */
                    }}
                    onClick={() => setSelectedCollectionState(collection)}
                  >
                    <Typography component='h6' variant='h6'>{collection}</Typography>
                  </CustomLink>
                </TableCell>

                {show.delete === true && (
                  <TableCell key={`delete${collection}`} align="right" sx={TableCellStyle}>
                    <DeleteCollection database={dbName} collection={collection} />
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ShowCollections