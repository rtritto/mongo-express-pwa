import { Button, FormControl, Grid, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'

import { Edit } from 'common/SvgIcons.mts'

const RenameCollection = ({ collectionName, dbName }: { collectionName: string, dbName: string }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography component="h6" variant="h6" sx={{ fontWeight: 'bold', pt: 0.5 }}>
                Rename Collection
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>
              <FormControl sx={{ p: 0.5 }}>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid item >
                    <Typography noWrap variant="subtitle2">{dbName} . </Typography>
                  </Grid>

                  <Grid item sx={{ mx: 0.5 }}>
                    <TextField id="newCollectionName" size="small" variant="outlined" placeholder={collectionName} />
                  </Grid>

                  <Grid item>
                    <Button
                      size="small"
                      startIcon={<SvgIcon sx={{ marginRight: '8px', marginLeft: '-4px' }}>
                        <path d={Edit} />
                      </SvgIcon>}
                      type="submit"
                      variant="contained"
                      sx={{ textTransform: 'none',  /* remove uppercase */ }}
                    >
                      Rename
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RenameCollection