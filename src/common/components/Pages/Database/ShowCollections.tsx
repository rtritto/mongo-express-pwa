import { Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { EP_DB } from 'configs/endpoints.mts'
import { FileUpload, Save, Visibility } from 'common/SvgIcons.mts'
import DeleteModalBox from 'components/Custom/DeleteModalBox.tsx'
import CustomLink from 'components/Custom/CustomLink.tsx'
import CreateCollection from 'components/Pages/Database/CreateCollection.tsx'

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
  show: {
    create: boolean
    delete: boolean
    export: boolean
  }
}

const handleDelete = async (database: string) => {
  // await fetch(EP_DB, {
  //   method: 'DELETE',
  //   body: JSON.stringify({
  //     database
  //   })
  // })
}

const ShowCollections = ({ collections = [], show }: ShowDatabasesProps) => {
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
              {show.create === true && <CreateCollection />}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {collections.map((collection) => {
            const encodedDb = encodeURIComponent(collection)
            const href = `${EP_DB}/${encodedDb}/${collection}`
            return (
              <TableRow key={`row${collection}`}>
                <TableCell key={`cellIcon${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    key={collection}
                    // Link
                    href={href}
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

                <TableCell key={`cellIcon${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    key={collection}
                    // Link
                    href={href}
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

                <TableCell key={`cellIcon${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    key={collection}
                    // Link
                    href={href}
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

                <TableCell key={`cellIcon${collection}`} sx={TableCellStyle}>
                  <CustomLink
                    key={collection}
                    // Link
                    href={href}
                    style={{
                      margin: 1,
                      textDecoration: 'none'  // remove text underline
                    }}
                    // Button
                    startIcon={<SvgIcon><path d={FileUpload} /></SvgIcon>}
                    variant="contained"
                    sx={ButtonExportImportStyle}
                  >
                    Import
                  </CustomLink>
                </TableCell>

                <TableCell key={`cellName${collection}`} sx={TableCellStyle} width="100%">
                  <CustomLink
                    key={collection}
                    // Link
                    href={href}
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
                  >
                    <Typography component='h6' variant='h6'>{collection}</Typography>
                  </CustomLink>
                </TableCell>

                {show.delete === true && (
                  <TableCell key={`cellDelete${collection}`} align="right" sx={TableCellStyle}>
                    <DeleteModalBox
                      value={collection}
                      entity="collection"
                      tooltipTitle={tooltipTitle}
                      handleDelete={handleDelete}
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