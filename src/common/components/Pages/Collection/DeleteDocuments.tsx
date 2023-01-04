import { Box, Button, Divider, Grid, Modal, SvgIcon, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { EP_API_DATABASE_COLLECTION } from 'configs/endpoints.ts'
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

interface DeleteDocumentsProps {
  count: number
  dbName: string
  collectionName: string
  query?: string
}

const DeleteDocuments = ({ count, collectionName, dbName, query }: DeleteDocumentsProps) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }
  const setSuccess = useSetRecoilState<string | undefined>(messageSuccessState)
  const setError = useSetRecoilState<string | undefined>(messageErrorState)

  const handleDeleteCollection = async () => {
    await fetch(EP_API_DATABASE_COLLECTION(dbName, collectionName), {
      method: 'DELETE',
      ...query && { query: { query } }
    }).then(async (res) => {
      if (res.ok === true) {
        setSuccess(`${count} documents deleted!`)
      } else {
        const { error } = await res.json()
        setError(error)
      }
    }).catch((error) => {
      setError(error.message)
    })
  }

  return (
    <Box display="flex">
      <Button
        onClick={handleOpen}
        startIcon={<SvgIcon sx={{
          marginRight: '8px', marginLeft: '-4px'  // restore default margin style
        }}>
          <path d={Delete} />
        </SvgIcon>}
        size="small"
        variant="contained"
        sx={{
          backgroundColor: 'rgb(108, 49, 47)',
          width: '100%',
          textTransform: 'none'
        }}
      >
        Delete all {count} document(s)
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
              You want to delete all <strong>{count}</strong> document(s)?
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

export default DeleteDocuments