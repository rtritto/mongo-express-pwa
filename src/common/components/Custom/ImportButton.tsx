import { Button, DialogActions, DialogContent, DialogContentText, SvgIcon } from '@mui/material'
import { useSetAtom } from 'jotai'
import { ChangeEvent, useState } from 'react'

import { FileUpload } from 'common/SvgIcons.mts'
import DialogDisable from 'components/Custom/DialogDisable.tsx'
import { messageErrorState } from 'store/globalAtoms.ts'

const ButtonExportImportStyle = {
  backgroundColor: 'rgb(139, 107, 62)',
  flexDirection: 'column',
  py: 0.5,
  textTransform: 'none'
} as const

interface ImportButtonProps {
  additionalHandle: Function
  collection: string
  href: string
  text: string
}

const ImportButton = ({ additionalHandle, collection, href, text = 'Import' }: ImportButtonProps) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const handleClose = () => {
    setOpen(false)
    if (typeof additionalHandle === 'function') {
      additionalHandle()
    }
  }

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
        setMessage(`${message} to collection "${collection}"`)
        setOpen(true)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  return (
    <>
      <Button
        component="label"
        startIcon={<SvgIcon><path d={FileUpload} /></SvgIcon>}
        variant="contained"
        sx={ButtonExportImportStyle}
      >
        {text}

        <input type="file" hidden onChange={handleFileUpload} />
      </Button>

      {open === true && (
        <DialogDisable disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              autoFocus
              onClick={handleClose}
              size="small"
              variant="contained"
              sx={{ m: 1 }}
            >
              OK
            </Button>
          </DialogActions>
        </DialogDisable>
      )}
    </>
  )
}

export default ImportButton