import { Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useSetAtom } from 'jotai'

import { EP_DB } from 'configs/endpoints.ts'
import { Visibility } from 'common/SvgIcons.mts'
import CustomLink from 'components/Custom/CustomLink.tsx'
import DeleteDialogDatabase from 'components/Custom/DeleteDialogDatabase.tsx'
import CreateDatabase from 'components/Pages/Index/CreateDatabase.tsx'
import { selectedDatabaseState } from 'store/globalAtoms.ts'

const TableCellStyle = {
  // border: 1,
  p: 0.5
}

interface ShowDatabasesProps {
  databases: string[]
  show: {
    create: boolean
    delete: boolean
  }
}

const ShowDatabases = ({ databases = [], show }: ShowDatabasesProps) => {
  const setSelectedDatabaseState = useSetAtom(selectedDatabaseState)

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: 'none', p: 1.5 }}>
              <Typography component='h6' variant='h6' sx={{ fontWeight: 'bold' }}>
                Databases
              </Typography>
            </TableCell>

            <TableCell sx={{ px: 1.5, borderLeft: 'none' }} align="right" colSpan={2}>
              {show.create === true && <CreateDatabase />}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {databases.map((database) => {
            const encodedDatabase = encodeURIComponent(database)
            const hrefView = `${EP_DB}/${encodedDatabase}`
            return (
              <TableRow key={`row${database}`}>
                <TableCell key={`view${database}`} sx={TableCellStyle}>
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

                <TableCell key={`detail${database}`} sx={TableCellStyle} width="100%">
                  <CustomLink
                    // Link
                    href={hrefView}
                    style={{
                      margin: 1,
                      textDecoration: 'none'  // remove text underline
                    }}
                    // Button
                    fullWidth
                    variant="text"
                    sx={{
                      // py: 2,
                      justifyContent: 'flex-start',
                      textTransform: 'none' // remove uppercase
                    }}
                    onClick={() => setSelectedDatabaseState(database)}
                  >
                    <Typography component='h6' variant='h6'>{database}</Typography>
                  </CustomLink>
                </TableCell>

                {show.delete === true && (
                  <TableCell key={`delete${database}`} align="right" sx={TableCellStyle}>
                    <DeleteDialogDatabase database={database} />
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