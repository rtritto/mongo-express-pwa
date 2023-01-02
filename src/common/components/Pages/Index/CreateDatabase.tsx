import { Button, FormGroup, SvgIcon, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_DB } from 'configs/endpoints.ts'
import { Add } from 'common/SvgIcons.mts'
import { isValidDatabaseName } from 'lib/validations.ts'

const CreateDatabase = () => {
  const [database, setDatabase] = useState<string>('')

  const methods = useForm({ mode: 'onChange' })

  const callPostDB = () => {
    fetch(EP_DB, {
      method: 'POST',
      body: JSON.stringify({
        database
      })
    })
  }

  return (
    <FormGroup>
      <form method="POST" onSubmit={methods.handleSubmit(callPostDB)}>
        <Controller
          control={methods.control}
          name="controllerCreateDatabase"
          render={({ field: { onChange } }) => (
            <TextField
              id="newDatabaseName"
              error={database !== '' && 'controllerCreateDatabase' in methods.formState.errors}
              helperText={database !== '' && (methods.formState.errors.controllerCreateDatabase?.message || '')}
              name="databaseName"
              onChange={({ target: { value } }) => {
                setDatabase(value)
                onChange(value)
              }}
              placeholder="Database name"
              required
              size="small"
              type="string"
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
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none', py: 1 }}
        >
          Create Database
        </Button>
      </form>
    </FormGroup>
  )
}

export default CreateDatabase