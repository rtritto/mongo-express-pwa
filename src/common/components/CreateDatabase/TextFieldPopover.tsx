import { Popover, TextField, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react'

const TextFieldPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
      <TextField name="databaseName" aria-describedby={id} placeholder="Database name" size="small" variant="outlined" sx={{ paddingBottom: 0 }} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Typography sx={{ p: 2 }}>
          {`Database names cannot be empty, must have fewer than 64 characters and must not contain /. "$*<>:|?`}
        </Typography>
      </Popover>
    </div>
  )
}

export default TextFieldPopover