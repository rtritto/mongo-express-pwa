import { Box, Button, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'

import { Delete, Visibility } from 'common/SvgIcons.mts'
import CustomLink from 'components/Custom/CustomLink.tsx'

import { EP_DB } from 'configs/endpoints.mts'
import CreateDatabase from 'components/CreateDatabase/index.tsx'

const callDeleteDB = async (event) => {
  const database = event.currentTarget.value
  await fetch(EP_DB, {
    method: 'POST',
    body: JSON.stringify({
      database
    })
  })
}

const TableCellStyle = {
  // border: 1,
  p: 0.5
}

declare interface ShowDatabasesProps {
  databases: string[]
  showCreateDb: boolean
  showDeleteDatabases: boolean
}

const ShowDatabases = ({ databases = [], showCreateDb = true, showDeleteDatabases = true }: ShowDatabasesProps) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#616161' }}>
            <TableCell sx={{ borderRight: 'none', p: 1.5, verticalAlign: 'top' }}>
              <Typography
                component='h6'
                variant='h6'
                sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}
              >
                Databases
              </Typography>
            </TableCell>

            <TableCell sx={{ px: 1.5, py: 1, borderLeft: 'none' }} align="right" colSpan={2}>
              {showCreateDb === true && <CreateDatabase />}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {databases.map((db) => {
            const encodedDb = encodeURIComponent(db)
            return (
              <TableRow key={`row${db}`}>
                <TableCell key={`cellDbIcon${db}`} sx={TableCellStyle}>
                  <CustomLink
                    key={db}
                    // Link
                    href={`/db/${encodedDb}`}
                    style={{
                      margin: 1,
                      textDecoration: 'none'  // remove text underline
                    }}
                    // Button
                    startIcon={<SvgIcon><path d={Visibility} /></SvgIcon>}
                    variant="contained"
                    sx={{ backgroundColor: 'rgb(86, 124, 86)', px: 5.5, py: 2 }}
                  >
                    View
                  </CustomLink>
                </TableCell>

                <TableCell key={`cellDbName${db}`} sx={TableCellStyle} width="100%">
                  <CustomLink
                    key={db}
                    // Link
                    href={`/db/${encodedDb}`}
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
                    <Typography component='h6' variant='h6'>{db}</Typography>
                  </CustomLink>
                </TableCell>

                {showDeleteDatabases === true &&
                  <TableCell key={`cellDbDelete${db}`} align="right" sx={TableCellStyle}>
                    <Tooltip title="Warning! Are you sure you want to delete this database? All collections and documents will be deleted.">
                      <Button
                        // color="inherit"
                        onClick={callDeleteDB}
                        startIcon={<SvgIcon><path d={Delete} /></SvgIcon>}
                        value={encodedDb}
                        variant="contained"
                        sx={{ backgroundColor: 'rgb(108, 49, 47)', px: 5.5, py: 2 }}
                      >
                        Del
                      </Button>
                    </Tooltip>
                  </TableCell>
                }
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ShowDatabases