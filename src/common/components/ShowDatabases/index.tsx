import { Box, Button, Grid, IconButton, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Delete, Visibility } from 'common/SvgIcons.mts'
import CustomLink from 'components/Custom/CustomLink.tsx'

// import { EP_DB } from 'configs/endpoints.mts'
// import * as validators from 'utils/validations.ts'

const TableCellStyle = {
  // border: 1,
  padding: 1
}

const ShowDatabases = ({ databases = [], showDeleteDatabases = true }: { databases: string[], showDeleteDatabases: boolean }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table aria-label="a dense table">
        <TableBody>
          {databases.map((db) =>
            <TableRow key={`row${db}`}>
              <TableCell key={`cellDbIcon${db}`} sx={TableCellStyle}>
                <CustomLink
                  key={db}
                  // Link
                  href={`/db/${encodeURIComponent(db)}`}
                  style={{
                    margin: 1,
                    textDecoration: 'none',  // remove text underline
                  }}
                  // Button
                  startIcon={<SvgIcon><path d={Visibility} /></SvgIcon>}
                  variant="contained"
                  sx={{ backgroundColor: 'rgb(86, 124, 86)', py: 2, px: 5.5 }}
                >
                  View
                </CustomLink>
              </TableCell>

              <TableCell key={`cellDbName${db}`} sx={TableCellStyle} width="100%">
                <CustomLink
                  key={db}
                  // Link
                  href={`/db/${encodeURIComponent(db)}`}
                  style={{
                    margin: 1,
                    textDecoration: 'none',  // remove text underline
                  }}
                  // Button
                  fullWidth
                  variant="text"
                  sx={{
                    py: 2,
                    justifyContent: 'flex-start',
                    textTransform: 'none' /* remove uppercase */
                  }}
                >
                  {db}
                </CustomLink>
              </TableCell>

              {showDeleteDatabases === true &&
                <TableCell key={`cellDbDelete${db}`} align="right" sx={TableCellStyle}>
                  <Button
                    // color="inherit"
                    // onClick={toggleDrawer(true)}
                    variant="contained"
                    startIcon={<SvgIcon><path d={Delete} /></SvgIcon>}
                    sx={{ backgroundColor: 'rgb(108, 49, 47)', px: 5.5, py: 2 }}
                  >
                    Del
                  </Button>
                </TableCell>
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ShowDatabases