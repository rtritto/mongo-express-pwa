import { Box, Button, DialogActions, DialogContent, DialogContentText, Divider, SvgIcon } from '@mui/material'
import { useState } from 'react'
import { useSetAtom } from 'jotai'

import { Delete } from 'common/SvgIcons.mts'
import DialogDisable from 'components/Custom/DialogDisable.tsx'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

interface DeleteModalBoxSimpleProps {
  additionalHandle?: Function
  deleteUrl: string
  messages: {
    button: string
    modal: string
    success: string
  }
  query?: string
  width?: string
  ButtonProps: {
    sx?: object
  }
}

const DeleteModalBoxSimple = ({ deleteUrl, messages, query, additionalHandle, ButtonProps = {} }: DeleteModalBoxSimpleProps) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }
  const setSuccess = useSetAtom<string | undefined>(messageSuccessState)
  const setError = useSetAtom<string | undefined>(messageErrorState)

  const handleDeleteCollection = async () => {
    const queryParams = query ? `?${new URLSearchParams({ query })}` : ''
    await fetch(`${deleteUrl}${queryParams}`, {
      method: 'DELETE'
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess(messages.success)
        if (typeof additionalHandle === 'function') {
          additionalHandle()
        }
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => { setError(error.message) })
  }

  return (
    <Box>
      <Button
        onClick={handleOpen}
        startIcon={<SvgIcon><path d={Delete} /></SvgIcon>}
        size="small"
        variant="contained"
        sx={{
          backgroundColor: 'rgb(108, 49, 47)',
          textTransform: 'none',
          ...ButtonProps.sx
        }}
      >
        {messages.button}
      </Button>

      {open === true && (
        <DialogDisable disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText sx={{ textAlign: 'center' }}>
              {messages.modal}
            </DialogContentText>
          </DialogContent>

          <Divider />

          <DialogActions>
            <Button
              id="delete"
              onClick={() => {
                handleDeleteCollection()
                handleClose()
              }}
              size="small"
              variant="contained"
              sx={{ backgroundColor: 'rgb(108, 49, 47)', m: 1 }}
            >
              Delete
            </Button>

            <Button
              onClick={handleClose}
              size="small"
              variant="contained"
              sx={{ m: 1 }}
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogDisable>
      )}
    </Box>
  )
}

export default DeleteModalBoxSimple