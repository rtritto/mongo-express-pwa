import { Dialog } from '@mui/material'

const CustomDialog = ({
  children,
  disableBackdropClick,
  disableEscapeKeyDown,
  onClose,
  open,
  ...rest
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return
    }

    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return
    }

    if (typeof onClose === 'function') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} {...rest}>
      {children}
    </Dialog>
  )
}

export default CustomDialog