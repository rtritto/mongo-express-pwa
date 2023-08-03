import { Button, DialogActions, DialogContent, DialogContentText, SvgIcon } from '@mui/material'
import { useSetAtom } from 'jotai'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router.js'

import { FileUpload } from 'common/SvgIcons.mts'
import CustomDialog from 'components/Custom/CustomDialog.tsx'
import { messageErrorState } from 'store/globalAtoms.ts'

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
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const setError = useSetAtom(messageErrorState)

  const handleClose = () => {
    router.reload()
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files) {
      return
    }

    const formData = new FormData()
    const filesArray = [...files]
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
        <CustomDialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
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
        </CustomDialog>
      )}
    </>
  )
}

export default ImportButton