import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, SvgIcon, TextField, Tooltip, Typography } from '@mui/material'
import type { OutlinedInputProps } from '@mui/material'
import { useState } from 'react'

import { Delete } from 'common/SvgIcons.mts'
import DialogDisable from 'components/Custom/DialogDisable.tsx'

interface DeleteModalBoxProps {
  value: string
  entity: string
  tooltipTitle: string
  handleDelete: Function
}

const DeleteModalBox = ({ value, entity, tooltipTitle, handleDelete }: DeleteModalBoxProps) => {
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
        <DialogDisable disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>
            Delete {entity}
          </DialogTitle>

          <Divider />


          <DialogContent>
            <DialogContentText>
              Be careful! You are about to delete whole <Box fontWeight='fontWeightMedium' display='inline'>
                <strong>{value}</strong>
              </Box> {entity}.
            </DialogContentText>

            <DialogContentText alignItems="center" sx={{ py: 0.5, display: "flex" }}>
              <Typography fontSize={12} sx={{ fontWeight: 'bold', width: '100%' }}>
                Type the {entity} name to proceed.
              </Typography>

              <TextField
                autoFocus
                fullWidth
                onChange={handleOnChange}
                placeholder={value}
                size="small"
                type="string"
                value={input}
                variant="outlined"
                sx={{ pl: 0.5 }}
              />
            </DialogContentText>
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
        </DialogDisable>
      )}
    </>
  )
}

export default DeleteModalBox