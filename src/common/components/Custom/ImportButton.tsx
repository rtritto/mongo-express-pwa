import { Button, SvgIcon } from '@mui/material'
import { useSetAtom } from 'jotai'
import type { ChangeEvent } from 'react'

import { FileUpload } from 'common/SvgIcons.mts'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const ButtonExportImportStyle = {
  backgroundColor: 'rgb(139, 107, 62)',
  flexDirection: 'column',
  py: 0.5,
  textTransform: 'none'
} as const

interface ImportButtonProps {
  collection: string
  href: string
  text: string
}


const ImportButton = ({ collection, href, text = 'Import' }: ImportButtonProps) => {
  const setSuccess = useSetAtom<string | undefined>(messageSuccessState)
  const setError = useSetAtom<string | undefined>(messageErrorState)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files) {
      return
    }

    const formData = new FormData()
    const filesArray = Array.from(files)
    for (const [key, file] of filesArray.entries()) {
      formData.append(`file_${key}`, file)
    }

    await fetch(href, {
      method: 'POST',
      body: formData
    }).then(async (res) => {
      if (res.ok === true) {
        const message = await res.text()
        setSuccess(`${message} to "${collection}" collection`)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => {
      setError(error.message)
    })
  }

  return (
    <Button
      component="label"
      startIcon={<SvgIcon><path d={FileUpload} /></SvgIcon>}
      variant="contained"
      sx={ButtonExportImportStyle}
    >
      {text}

      <input type="file" hidden onChange={handleFileUpload} />
    </Button>
  )
}

export default ImportButton