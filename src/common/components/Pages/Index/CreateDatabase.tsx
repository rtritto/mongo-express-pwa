import { Box, Button, FormGroup, Grid, SvgIcon, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_DB } from 'configs/endpoints.mts'
import { Add } from 'common/SvgIcons.mts'
import * as validators from 'utils/validations.ts'

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
          name="controllerCreateDB"
          render={({ field: { onChange } }) => <TextField
            error={!!database && !validators.isValidDatabaseName(database)}
            helperText={database && Object.keys(methods.formState.errors).length > 0
              ? (database.length > 63
                ? (validators.isValidDatabaseNameRegex(database)
                  ? 'Database name must have fewer than 64 characters and must not contain /. "$*<>:|?'
                  : 'Database name must have fewer than 64 characters')
                : 'Database must not contain /. "$*<>:|?')
              : ''
            }
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
          />}
          rules={{ validate: validators.isValidDatabaseName }}
        />

        <Button
          type="submit"
          size="small"
          variant="contained"
          disabled={!database || Object.keys(methods.formState.errors).length > 0}
          startIcon={<SvgIcon><path d={Add} /></SvgIcon>}
          sx={{ textTransform: 'none', py: 1 }}
        >
          Create Database
        </Button>
      </form>
    </FormGroup>
  )
}

export default CreateDatabase