import { Chip, IconButton, Menu, MenuItem, Popover, Stack, SvgIcon } from '@mui/material'
import Link from 'next/link.js'
import { MouseEvent, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { ExpandMore } from 'common/SvgIcons.mts'
import { selectedDbState, databasesState } from 'store/globalAtoms.mts'

const NavDatabases = () => {
  const databases = useRecoilValue<string[]>(databasesState)
  const [selectedDb, setSelectedDb] = useRecoilState<string>(selectedDbState)

  const [elDB, setElDB] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  const id = open ? 'simple-popover' : undefined

  const handleOpenDBMenu = () => {
    setOpen(true)
  }

  const handleCloseDBMenu = () => {
    setOpen(false)
  }

  const handleSelectDB = (event: MouseEvent<HTMLElement>) => {
    setOpen(false)
    setSelectedDb(event.currentTarget.id)
  }

  return (
    <Stack>
      <Chip
        aria-describedby={id}
        label={selectedDb}
        deleteIcon={(
          <IconButton sx={{ padding: 0 }}>
            <SvgIcon><path d={ExpandMore} /></SvgIcon>
          </IconButton>
        )}
        ref={(element) => { setElDB(element) }}
        sx={{ textTransform: 'none' /* remove uppercase */ }}
        // onClick={handleOpenDBMenu}
        onDelete={handleOpenDBMenu}
      />

      <Popover // Popover Menu
        id={id}
        open={open}
        anchorEl={elDB}
        // onClose={handleCloseDBMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Menu
          id="menu-appbar"
          anchorEl={elDB}
          keepMounted
          MenuListProps={{ disablePadding: true }}
          open={open}
          onClose={handleCloseDBMenu}
          PaperProps={{
            sx:
              { minWidth: `${elDB ? `${elDB.offsetWidth}px` : 0}`, background: 'darkgrey' }
          }}
        >
          {databases.map((database) => (
            <Link
              key={database}
              href={`/db/${database}`}
              id={database}
              passHref
              style={{
                display: 'flex', margin: 4,
                paddingLeft: 10,
                // padding: 0, verticalAlign: 'middle',
                color: 'white', textDecoration: 'none', /* remove text underline */
                ...(selectedDb === database) && { pointerEvents: 'none' } // disable onClick when selected
              }}
              onClick={handleSelectDB}
            >
              <MenuItem
                key={`link${database}`}
                dense
                // onClick={handleSelectDB}
                sx={{ /* justifyContent: 'flex-start', */ padding: 0, textTransform: 'none' /* remove uppercase */ }}
                disabled={selectedDb === database}
              >
                {database}
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Popover>
    </Stack>
  )
}

export default NavDatabases