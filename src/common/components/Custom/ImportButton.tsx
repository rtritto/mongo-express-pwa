import { Button, SvgIcon } from '@mui/material'
import type { ChangeEvent } from 'react'

import { FileUpload } from 'common/SvgIcons.mts'

const ButtonExportImportStyle = {
  backgroundColor: 'rgb(139, 107, 62)',
  flexDirection: 'column',
  py: 0.5,
  textTransform: 'none'
} as const

interface ImportButtonProps {
  href: string
  text: string
}


const ImportButton = ({ href, text = 'Import' }: ImportButtonProps) => {
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