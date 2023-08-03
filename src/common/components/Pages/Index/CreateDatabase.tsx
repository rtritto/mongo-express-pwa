import { Box, Button, FormGroup, SvgIcon, TextField } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_API_DB } from 'configs/endpoints.ts'
import { Add } from 'common/SvgIcons.mts'
import { isValidDatabaseName } from 'lib/validations.ts'
import { databasesState, messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const CreateDatabase = () => {
  const [database, setDatabase] = useState('')
  const setDatabases = useSetAtom(databasesState)
  const setSuccess = useSetAtom(messageSuccessState)
  const setError = useSetAtom(messageErrorState)
  const methods = useForm({ mode: 'onChange' })

  const handleCreateDatabase = async () => {
    await fetch(EP_API_DB, {
      method: 'POST',
      body: JSON.stringify({ database }),
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      if (res.ok === true) {
        // Add database to global databases to update viewing databases
        setDatabases((databases) => [...databases, database].sort())
        setSuccess(`Database "${database}" created!`)
        setDatabase('')  // Reset value
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  return (
    <FormGroup>
      <Box>
        <Controller
          control={methods.control}
          name="controllerCreateDatabase"
          render={({ field: { onChange } }) => (
            <TextField
              id="database"
              error={database !== '' && 'controllerCreateDatabase' in methods.formState.errors}
              helperText={database !== '' && (methods.formState.errors.controllerCreateDatabase?.message || '')}
              name="database"
              onChange={({ target: { value } }) => {
                setDatabase(value)
                onChange(value)
              }}
              placeholder="Database name"
              required
              size="small"
              type="string"
              value={database}
              variant="outlined"
            // sx={{ paddingBottom: 0 }}
            />
          )}
          rules={{ validate: (value) => isValidDatabaseName(value).error }}
        />

        <Button
          disabled={!database || 'controllerCreateDatabase' in methods.formState.errors}
          size="small"
          startIcon={<SvgIcon><path d={Add} /></SvgIcon>}
          // type="submit"
          variant="contained"
          onClick={handleCreateDatabase}
          sx={{ textTransform: 'none', py: 1 }}
        >
          Create Database
        </Button>
      </Box>
    </FormGroup>
  )
}

export default CreateDatabase