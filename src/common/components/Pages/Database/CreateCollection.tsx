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
          render={({ field: { onChange } }) => (
            <TextField
              id="newCollectionName"
              error={collection !== '' && 'controllerCreateCollection' in methods.formState.errors}
              helperText={collection !== '' && (methods.formState.errors.controllerCreateCollection?.message || '')}
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
            />
          )}
          rules={{ validate: (value) => isValidCollectionName(value).error }}
        />

        <Button
          disabled={!collection || 'controllerCreateCollection' in methods.formState.errors}
          size="small"
          startIcon={<SvgIcon><path d={Add} /></SvgIcon>}
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none', py: 1 }}
        >
          Create Collection
        </Button>
      </form>
    </FormGroup>
  )
}

export default CreateCollection