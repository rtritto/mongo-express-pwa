import { Box, Button, Grid, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router.js'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'

import { EP_DATABASE_COLLECTION, EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
import { Edit } from 'common/SvgIcons.mts'
import { isValidCollectionName } from 'lib/validations.ts'
import { collectionsState, selectedCollectionState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

interface RenameCollectionProps {
  collectionName: string
  dbName: string
}

const RenameCollection = ({ collectionName, dbName }: RenameCollectionProps) => {
  const [collection, setCollection] = useState<string>('')
  const setCollections = useSetRecoilState<Mongo['collections']>(collectionsState)
  const setSelectedCollection = useSetRecoilState<string>(selectedCollectionState)
  const setSuccess = useSetRecoilState<string | undefined>(messageSuccessState)
  const setError = useSetRecoilState<string | undefined>(messageErrorState)
  const methods = useForm({ mode: 'onChange' })
  const router = useRouter()

  const handleRenameCollection = async () => {
    await fetch(EP_API_DATABASE_COLLECTION(dbName, collectionName), {
      method: 'PUT',
      body: JSON.stringify({ collection }),
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess(`Collection '${collectionName}' renamed to '${collection}'!`)
        // Rename collection from global collections to update viewing collections
        setCollections((collections) => {
          const indexToRemove = collections[dbName].indexOf(collectionName)
          return {
            ...collections,
            [dbName]: [
              ...collections[dbName].slice(0, indexToRemove),
              ...collections[dbName].slice(indexToRemove + 1),
              collection
            ].sort()
          }
        })
        setSelectedCollection(collection)
        setCollection('')  // Reset value
        // Update URI (without page reload)
        router.push(EP_DATABASE_COLLECTION(dbName, collection), undefined, { shallow: true })
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
              <Box>
                <Grid container sx={{ alignItems: 'center', p: 0.5 }}>
                  <Grid item >
                    <Typography noWrap variant="subtitle2">{dbName} . </Typography>
                  </Grid>

                  <Grid item sx={{ mx: 0.5 }}>
                    <Controller
                      control={methods.control}
                      name="controllerRenameCollection"
                      render={({ field: { onChange } }) => (
                        <TextField
                          id="collection"
                          error={collection !== '' && 'controllerRenameCollection' in methods.formState.errors}
                          helperText={collection !== '' && (methods.formState.errors.controllerRenameCollection?.message || '')}
                          name="collection"
                          onChange={({ target: { value } }) => {
                            setCollection(value)
                            onChange(value)
                          }}
                          placeholder={collectionName}
                          required
                          size="small"
                          type="string"
                          value={collection}
                          variant="outlined"
                        // sx={{ paddingBottom: 0 }}
                        />
                      )}
                      rules={{ validate: (value) => isValidCollectionName(value).error }}
                    />
                  </Grid>

                  <Grid item>
                    <Button
                      disabled={!collection || collection === collectionName || 'controllerRenameCollection' in methods.formState.errors}
                      size="small"
                      startIcon={(
                        <SvgIcon sx={{ marginRight: '8px', marginLeft: '-4px' /* restore default margin style */ }}>
                          <path d={Edit} />
                        </SvgIcon>
                      )}
                      // type="submit"
                      variant="contained"
                      onClick={handleRenameCollection}
                      sx={{ textTransform: 'none'  /* remove uppercase */ }}
                    >
                      Rename
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RenameCollection