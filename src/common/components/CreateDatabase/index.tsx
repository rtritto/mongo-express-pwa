import { Box, Button, FormGroup, Grid, SvgIcon, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_DB } from 'configs/endpoints.mts'
import { Add } from 'common/SvgIcons.mts'
import * as validators from 'utils/validations.ts'

const CreateDatabase = ({ showCreateDb = true }: { showCreateDb: boolean }) => {
  const [database, setDatabase] = useState<string>('')

  const methods = useForm({ mode: 'onChange' })

  const callPOSTDB = () => {
    fetch(EP_DB, {
      method: 'POST',
      body: JSON.stringify({
        database
      })
    })
  }

  return (
    <Box sx={{ my: 1.5 }}>
      <FormGroup sx={{ px: 1.5, py: 1, borderRadius: 2, border: '1px solid #ccc', /* , borderColor: 'primary.main' */ }}>
        <form method="POST" onSubmit={methods.handleSubmit(callPOSTDB)}>
          <Grid container /* justifyContent="flex-end"*/>
            <Typography
              component='h6'
              sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }} variant='h6'
            >
              Databases
            </Typography>

            {showCreateDb === true && (
              <>
                <Box margin={0.5} sx={{ display: 'flex', marginLeft: 'auto' }}>
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
                      sx={{ paddingBottom: 0 }}
                    />}
                    rules={{ validate: validators.isValidDatabaseName }}
                  />
                </Box>

                <Box margin={1}>
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    disabled={!database || Object.keys(methods.formState.errors).length > 0}
                    startIcon={<SvgIcon><path d={Add} /></SvgIcon>}
                    sx={{ textTransform: 'none' }}
                  >
                    Create Database
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </form>
      </FormGroup>
    </Box>
  )
}

export default CreateDatabase