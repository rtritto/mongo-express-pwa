import { Box, Button, SvgIcon, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'

import { EP_API_DATABASE } from 'configs/endpoints.ts'
import { Add } from 'common/SvgIcons.mts'
import { isValidCollectionName } from 'lib/validations.ts'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.mts'

interface CreateCollectionProps {
  dbName: string
}

const CreateCollection = ({ dbName }: CreateCollectionProps) => {
  const [collection, setCollection] = useState<string>('')
  const setSuccess = useSetRecoilState<string | undefined | null>(messageSuccessState)
  const setError = useSetRecoilState<string | undefined | null>(messageErrorState)
  const methods = useForm({ mode: 'onChange' })

  const handleCreateCollection = async () => {
    await fetch(EP_API_DATABASE(dbName), {
      method: 'POST',
      body: JSON.stringify({ collection }),
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess(`Collection '${collection}' created!`)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((reason) => {
      setError(reason.message)
    })
  }

  return (
    <Box>
      <Controller
        control={methods.control}
        name="controllerCreateCollection"
        render={({ field: { onChange } }) => (
          <TextField
            id="collection"
            error={collection !== '' && 'controllerCreateCollection' in methods.formState.errors}
            helperText={collection !== '' && (methods.formState.errors.controllerCreateCollection?.message || '')}
            name="collection"
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
        // type="submit"
        variant="contained"
        onClick={handleCreateCollection}
        sx={{ textTransform: 'none', py: 1 }}
      >
        Create Collection
      </Button>
    </Box>
  )
}

export default CreateCollection