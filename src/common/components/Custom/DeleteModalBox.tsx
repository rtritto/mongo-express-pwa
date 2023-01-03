import { Box, Button, Divider, Grid, Modal, SvgIcon, TextField, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { Delete } from 'common/SvgIcons.mts'

const ModalStyle = {
  display: 'flex',
  top: '10%',
  // alignItems: 'center', // vertical align
  justifyContent: 'center'  // horizontal align
}

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

declare interface DeleteModalBoxProps {
  value: string
  entity: string
  tooltipTitle: string
  handleDelete: Function
}

const DeleteModalBox = ({ value, entity, tooltipTitle, handleDelete }: DeleteModalBoxProps) => {
  const [open, setOpen] = useState(false)
  const [input, setinput] = useState('')

  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  const handleOnChange = (event) => { setinput(event.currentTarget.value) }

  return (
    <Box>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={ModalStyle}
      >
        <Box sx={BoxStyle}>
          <Typography fontSize={14} sx={{ p: 2 }}>
            Delete {entity}
          </Typography>

          <Divider />

          <Grid sx={{ p: 2 }} >
            <Typography component='div' fontSize={12} gutterBottom>
              Be careful! You are about to delete whole <Box fontWeight='fontWeightMedium' display='inline'>
                <strong>{value}</strong>
              </Box> {entity}.
            </Typography>

            <Box alignItems="center" sx={{ py: 0.5, display: "flex" }}>
              <Typography fontSize={12} sx={{ fontWeight: 'bold', width: '100%' }}>
                Type the {entity} name to proceed.
              </Typography>

              <TextField
                fullWidth
                onChange={handleOnChange}
                placeholder={value}
                size="small"
                type="string"
                variant="outlined"
                sx={{ pl: 0.5 }} />
            </Box>
          </Grid>

          <Divider />

          <Grid container justifyContent="flex-end" sx={{ p: 1 }}>
            <Button
              id="delete"
              onClick={() => input === value && handleDelete(input) && handleClose()}
              size="small"
              // type="submit"
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
          </Grid>
        </Box>
      </Modal>
    </Box>
  )
}

export default DeleteModalBox