import { Box, Button, Divider, Grid, Modal, SvgIcon, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useSetAtom } from 'jotai'

import { Delete } from 'common/SvgIcons.mts'
import { messageErrorState, messageSuccessState } from 'store/globalAtoms.ts'

const ModalStyle = {
  display: 'flex',
  top: '10%',
  // alignItems: 'center', // vertical align
  justifyContent: 'center'  // horizontal align
} as const

const BoxStyle = {
  position: 'absolute' as 'absolute',
  // centre
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
} as const

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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={ModalStyle}
      >
        <Box sx={BoxStyle}>
          <Box sx={{ p: 2 }} >
            <Typography component='div' fontSize={14} gutterBottom>
              {messages.modal}
            </Typography>
          </Box>

          <Divider />

          <Grid container justifyContent="flex-end" sx={{ p: 1 }}>
            <Button
              id="delete"
              onClick={() => {
                handleDeleteCollection()
                handleClose()
              }}
              size="small"
              // type="submit"
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
          </Grid>
        </Box>
      </Modal>
    </Box>
  )
}

export default DeleteModalBoxSimple