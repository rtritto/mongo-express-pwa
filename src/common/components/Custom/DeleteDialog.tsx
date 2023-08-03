import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, SvgIcon, TextField, Tooltip, type OutlinedInputProps } from '@mui/material'
import { useState } from 'react'

import { Delete } from 'common/SvgIcons.mts'
import CustomDialog from 'components/Custom/CustomDialog.tsx'

interface DeleteDialogProps {
  value: string
  entity: string
  tooltipTitle: string
  handleDelete: () => void
}

const DeleteDialog = ({ value, entity, tooltipTitle, handleDelete }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')

  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  const handleOnChange = (event: OutlinedInputProps['onChange']) => { setInput(event.currentTarget.value) }

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <Button
          onClick={handleOpen}
          startIcon={<SvgIcon><path d={Delete} /></SvgIcon>}
          value={value}
          variant="contained"
          sx={{
            backgroundColor: 'rgb(108, 49, 47)',
            flexDirection: 'column',
            // px: 4,
            py: 0.5,
            textTransform: 'none'
          }}
        >
          Del
        </Button>
      </Tooltip>

      {open === true && (
        <CustomDialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>
            Delete {entity}
          </DialogTitle>

          <Divider />

          <DialogContent>
            <DialogContentText>
              You are about to delete whole <strong>{value}</strong> {entity}.
            </DialogContentText>

            <TextField
              autoFocus
              fullWidth
              margin="dense"
              onChange={handleOnChange}
              placeholder={value}
              size="small"
              type="string"
              value={input}
              variant="outlined"
              sx={{ pl: 0.5 }}
            />
          </DialogContent>

          <Divider />

          <DialogActions>
            <Button
              id="delete"
              onClick={() => {
                handleDelete(input)
                handleClose()
                setInput('')  // Reset value
              }}
              disabled={input !== value}
              size="small"
              value={value}
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
        </CustomDialog>
      )}
    </>
  )
}

export default DeleteDialog