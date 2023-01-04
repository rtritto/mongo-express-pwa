import { Button, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useSetRecoilState } from 'recoil'

import { EP_DB, EP_EXPORT_COLLECTION, EP_EXPORT_ARRAY_COLLECTION, EP_IMPORT_COLLECTION, EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { FileUpload, Save, Visibility } from 'common/SvgIcons.mts'
import DeleteModalBox from 'components/Custom/DeleteModalBox.tsx'
import CustomLink from 'components/Custom/CustomLink.tsx'
import CreateCollection from 'components/Pages/Database/CreateCollection.tsx'
import { collectionsState, messageErrorState, messageSuccessState, selectedCollectionState } from 'store/globalAtoms.ts'

const tooltipTitle = 'Are you sure you want to delete this collection? All documents will be deleted.'

const TableCellStyle = {
  // border: 1,
  p: 0.5
}

const ButtonExportImportStyle = {
  backgroundColor: 'rgb(139, 107, 62)',
  flexDirection: 'column',
  py: 0.5,
  textTransform: 'none'
}

declare interface ShowDatabasesProps {
  collections: string[]
  dbName: string
  show: {
    create: boolean
    delete: boolean
    export: boolean
  }
}

const handleImport = async (event) => {
  const { files } = event.target
  // await fetch(EP_DB, {
  //   method: 'DELETE',
  //   body: JSON.stringify({
  //     database
  //   })
  // })
}

const ShowCollections = ({ collections = [], dbName, show }: ShowDatabasesProps) => {
  const setSelectedCollectionState = useSetRecoilState(selectedCollectionState)
  const setCollections = useSetRecoilState<Mongo['collections']>(collectionsState)
  const setSuccess = useSetRecoilState<string | undefined>(messageSuccessState)
  const setError = useSetRecoilState<string | undefined>(messageErrorState)

  const handleDelete = async (database: string, collection: string) => {
    await fetch(EP_API_DATABASE_COLLECTION(database, collection), {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        // Remove collection from global collections to update viewing collections
        setCollections((collections) => {
          const indexToRemove = collections[database].indexOf(collection)
          return {
            ...collections,
            [database]: [
              ...collections[database].slice(0, indexToRemove),
              ...collections[database].slice(indexToRemove + 1)
            ]
          }
        })
        setSuccess(`Collection '${collection}' deleted!`)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((reason) => {
      setError(reason.message)
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: 'none', p: 1.5, verticalAlign: 'top' }}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold' }}>
                Collections
              </Typography>
            </TableCell>

            <TableCell sx={{ px: 1.5, py: 1, borderLeft: 'none' }} align="right" colSpan={5}>
              {show.create === true && <CreateCollection dbName={dbName} />}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {collections.map((collection) => {
            const encodedDatabase = encodeURIComponent(dbName)
            const encodedCollection = encodeURIComponent(collection)
            const hrefView = `${EP_DB}/${encodedDatabase}/${encodedCollection}`
            const hrefExport = EP_EXPORT_COLLECTION(encodedDatabase, encodedCollection)
            const hrefExportArray = EP_EXPORT_ARRAY_COLLECTION(encodedDatabase, encodedCollection)
            const epImport = EP_IMPORT_COLLECTION(encodedDatabase, encodedCollection)
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
                    <CustomLink
                      // Link
                      href={hrefExport}
                      style={{
                        margin: 1,
                        textDecoration: 'none'  // remove text underline
                      }}
                      // Button
                      startIcon={<SvgIcon><path d={Save} /></SvgIcon>}
                      variant="contained"
                      sx={ButtonExportImportStyle}
                    >
                      Export
                    </CustomLink>
                  </TableCell>
                )}

                <TableCell key={`exportArray${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    // Link
                    href={hrefExportArray}
                    style={{
                      margin: 1,
                      textDecoration: 'none'  // remove text underline
                    }}
                    // Button
                    startIcon={<SvgIcon><path d={Save} /></SvgIcon>}
                    variant="contained"
                    sx={ButtonExportImportStyle}
                  >
                    [JSON]
                  </CustomLink>
                </TableCell>

                <TableCell key={`import${collection}`} sx={TableCellStyle}>
                  <Button
                    component="label"
                    startIcon={<SvgIcon><path d={FileUpload} /></SvgIcon>}
                    onChange={handleImport}
                    value={epImport}
                    variant="contained"
                    sx={ButtonExportImportStyle}
                  >
                    Import
                    <input type="file" hidden />
                  </Button>
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
                    <DeleteModalBox
                      value={collection}
                      entity="collection"
                      tooltipTitle={tooltipTitle}
                      handleDelete={() => handleDelete(dbName, collection)}
                    />
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