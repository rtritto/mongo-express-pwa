import { Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { Visibility } from 'common/SvgIcons.mts'
import CustomLink from 'components/Custom/CustomLink.tsx'
import CreateDatabase from 'components/Pages/Index/CreateDatabase.tsx'
import DeleteModalBox from './DeleteModalBox.tsx'

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
          <TableRow>
            <TableCell sx={{ borderRight: 'none', p: 1.5, verticalAlign: 'top' }}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold' }}>
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

                {showDeleteDatabases === true && (
                  <TableCell key={`cellDbDelete${db}`} align="right" sx={TableCellStyle}>
                    <DeleteModalBox database={encodedDb} />
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

export default ShowDatabases