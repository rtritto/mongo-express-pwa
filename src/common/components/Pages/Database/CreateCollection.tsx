import { Button, FormGroup, SvgIcon, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { EP_DB } from 'configs/endpoints.ts'
import { Add } from 'common/SvgIcons.mts'
import { isValidCollectionName } from 'lib/validations.ts'

const CreateCollection = () => {
  const [collection, setCollection] = useState<string>('')

  const methods = useForm({ mode: 'onChange' })

  const callPostDB = () => {
    fetch(`${EP_DB}/${collection}`, {
      method: 'POST'
    })
  }

  return (
    <FormGroup>
      <form method="POST" onSubmit={methods.handleSubmit(callPostDB)}>
        <Controller
          control={methods.control}
          name="controllerCreateCollection"
          render={({ field: { onChange } }) => <TextField
            error={!!collection && Object.keys(methods.formState.errors).length > 0}
            helperText={collection && Object.keys(methods.formState.errors).length > 0
              ? 'Collection names must begin with a letter, underscore, hyphen or slash, and can contain only letters, '
              + 'underscores, hyphens, numbers, dots or slashes'
              : ''
            }
            name="collectionName"
            onChange={({ target: { value } }) => {
              setCollection(value)
              onChange(value)
            }}
            placeholder="Collection name"
            required
            size="small"
            type="string"
            variant="outlined"
          // sx={{ paddingBottom: 0 }}
          />}
          rules={{ validate: isValidCollectionName }}
        />

        <Button
          type="submit"
          size="small"
          variant="contained"
          disabled={!collection || Object.keys(methods.formState.errors).length > 0}
          startIcon={<SvgIcon><path d={Add} /></SvgIcon>}
          sx={{ textTransform: 'none', py: 1 }}
        >
          Create Collection
        </Button>
      </form>
    </FormGroup>
  )
}

export default CreateCollection