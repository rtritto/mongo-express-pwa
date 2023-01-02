import { Button, FormControl, Grid, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { Edit } from 'common/SvgIcons.mts'
import { isValidCollectionName } from 'lib/validations.ts'

const RenameCollection = ({ collectionName, dbName }: { collectionName: string, dbName: string }) => {
  const [collection, setCollection] = useState<string>('')
  const methods = useForm({ mode: 'onChange' })

  const callPutCollection = () => {
    fetch(EP_DATABASE_COLLECTION(dbName, collectionName), {
      body: JSON.stringify({ collection }),
      method: 'PUT',
    })
  }

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
                    <Controller
                      control={methods.control}
                      name="controllerRenameCollection"
                      render={({ field: { onChange } }) => (
                        <TextField
                          id="newCollectionName"
                          error={collection !== '' && 'controllerRenameCollection' in methods.formState.errors}
                          helperText={collection !== '' && (methods.formState.errors.controllerRenameCollection?.message || '')}
                          name="collectionName"
                          onChange={({ target: { value } }) => {
                            setCollection(value)
                            onChange(value)
                          }}
                          placeholder={collectionName}
                          required
                          size="small"
                          type="string"
                          variant="outlined"
                        // sx={{ paddingBottom: 0 }}
                        />
                      )}
                      rules={{ validate: (value) => isValidCollectionName(value).error }}
                    />
                  </Grid>

                  <Grid item>
                    <Button
                      disabled={!collection || 'controllerRenameCollection' in methods.formState.errors}
                      size="small"
                      startIcon={(
                        <SvgIcon sx={{ marginRight: '8px', marginLeft: '-4px' }}>
                          <path d={Edit} />
                        </SvgIcon>
                      )}
                      type="submit"
                      variant="contained"
                      sx={{ textTransform: 'none'  /* remove uppercase */ }}
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