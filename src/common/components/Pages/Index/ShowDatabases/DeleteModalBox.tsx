import { Box, Button, Divider, Grid, Modal, SvgIcon, TextField, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { EP_DB } from 'configs/endpoints.mts'
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
}

const callDeleteDB = async (database: string) => {
  // await fetch(EP_DB, {
  //   method: 'DELETE',
  //   body: JSON.stringify({
  //     database
  //   })
  // })
}

const DeleteModalBox = ({ database }: { database: string }) => {
  const [open, setOpen] = useState(false)
  const [inptuDatabase, setInptuDatabase] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOnChange = (event) => {
    const database = event.currentTarget.value
    setInptuDatabase(database)
  }

  return (
    <Box>
      <Tooltip title="Warning! Are you sure you want to delete this database? All collections and documents will be deleted.">
        <Button
          onClick={handleOpen}
          startIcon={<SvgIcon><path d={Delete} /></SvgIcon>}
          value={database}
          variant="contained"
          sx={{ backgroundColor: 'rgb(108, 49, 47)', px: 5.5, py: 2 }}
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
            Delete database
          </Typography>

          <Divider />

          <Grid sx={{ p: 2 }} >
            <Typography component='div' fontSize={12} sx={{ mb: 0.5 }}>Be careful! You are about to delete whole <Box fontWeight='fontWeightMedium' display='inline'><strong>{database}</strong></Box> database.</Typography>

            <Box alignItems="center" sx={{ py: 1, display: "flex" }}>
              <Typography fontSize={12} sx={{ fontWeight: 'bold', width: '100%' }}>
                Type the database name to proceed.
              </Typography>

              <TextField
                fullWidth
                onChange={handleOnChange}
                size="small"
                type="string"
                variant="outlined"
                sx={{ pl: 0.5 }} />
            </Box>
          </Grid>

          {/* <FormControl>
            <InputLabel htmlFor="my-input">Type the database name to proceed.</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
          </FormControl> */}

          <Divider />

          <Grid container justifyContent="flex-end" sx={{ p: 1 }}>
            <Button
              id="delete"
              onClick={() => inptuDatabase === database && callDeleteDB(inptuDatabase)}
              size="small"
              value={database}
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