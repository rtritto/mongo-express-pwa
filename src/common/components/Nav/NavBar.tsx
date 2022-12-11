import Image from 'next/image.js'
import Link from 'next/link.js'
import { MouseEvent, useState } from 'react'
import {
  AppBar,
  Box,
  Container,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  SwipeableDrawer,
  Switch,
  Typography,
  Toolbar,
  Button,
  Popover
} from '@mui/material'
import { useRecoilState } from 'recoil'

// import { darkModeState } from 'src/store/Theme/atoms'
import { Apps, Close, Hamburger, Home, Info, PlayCircleFilledOutlined } from 'common/SvgIcons.mts'

const navLinks = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Anime Gallery', path: '/gallery', icon: Apps },
  { title: 'Player', path: '/player', icon: PlayCircleFilledOutlined },
  { title: 'Disclaimer', path: '/disclaimer', icon: Info }
]

const mapNavLinks = navLinks.map(({ icon, title, path }) => (
  <Link
    key={title}
    href={path}
    passHref
    style={{
      color: 'white',
      textDecoration: 'none' /* remove text underline */
    }}
  >
    <ListItemButton sx={{ width: { md: 'auto' } /* display inline text and center span */ }} >
      <Hidden mdUp>
        <ListItemIcon>
          <SvgIcon><path d={icon} /></SvgIcon>
        </ListItemIcon>
      </Hidden>

      <ListItemText primary={title} />
    </ListItemButton>
  </Link>
))

const CustomNavBar = () => {
  const [state, setState] = useState(false)

  //#region Theme
  // const [darkMode, setDarkMode] = useRecoilState(darkModeState)

  // const handleDarkModeToggle = () => {
  //   setDarkMode(!darkMode)
  // }
  //#endregion

  const toggleDrawer = (isOpen: boolean) => (event /* SyntheticEvent MouseEvent<HTMLElement> */) => {
    if (
      event
      && event.type === 'keydown'
      && (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState(isOpen)
  }

  //#region Database Dropdown
  const [anchorElDB, setAnchorElDB] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorElDB)
  const id = open ? 'simple-popover' : undefined

  const handleOpenDBMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElDB(event.currentTarget);
  }

  const handleCloseDBMenu = () => {
    setAnchorElDB(null)
  }
  //#endregion

  const menuIconButton = (
    <IconButton
      aria-label="menu"
      color="inherit"
      edge="start"
      aria-labelledby="open drawer"
      onClick={toggleDrawer(true)}
      sx={{ padding: 1.5 }}
    >
      <SvgIcon sx={{ width: 30, height: 30 }}><path d={Hamburger} /></SvgIcon>
    </IconButton>
  )

  const sideDrawerList = (
    <Box
      role="presentation"
      style={{	// sideDrawerList
        width: 250
      }}
    >
      <IconButton
        aria-label="menu"
        color="inherit"
        edge="start"
        onClick={toggleDrawer(false)}
        sx={{	// menuButton
          padding: 1.5,
          marginTop: 0.5,
          marginBottom: 0.5,
          marginLeft: 1.5, // theme.spacing(2) <=> (2 * 8)px
          marginRight: 1.5 // theme.spacing(2) <=> (2 * 8)px
        }}
      >
        <SvgIcon sx={{ width: 30, height: 30 }}><path d={Close} /></SvgIcon>
      </IconButton>

      <Divider />

      <List
        aria-labelledby="main navigation"
        component="nav"
        onClick={() => { setState(false) }}	// close Drawer after ListItem click
      >
        {mapNavLinks}
      </List>

      <Divider />

      {/* <Switch checked={darkMode} onChange={handleDarkModeToggle} /> */}
    </Box>
  )

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters variant="dense">
            <Hidden mdDown>
              <List
                aria-labelledby="main navigation"
                component="nav"
                sx={{	// navDisplayFlex
                  // display: 'flex',
                  // justifyContent: 'space-between'
                }}
              >
                <Link key="logoNav" href="/" passHref style={{ margin: '12px', padding: 0, verticalAlign: 'middle' }}>
                  <Image alt="logo nav" src="/favicon.ico" height={25} width={25} />
                </Link>

                <Typography
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    // mr: 2,
                    // display: { xs: 'flex', md: 'none' },
                    // flexGrow: 1,
                    // fontFamily: 'monospace',
                    // fontWeight: 700,
                    // letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  Mongo Express
                </Typography>

                <Button aria-describedby={id} variant="contained" onClick={handleOpenDBMenu}>
                  Databases
                </Button>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorElDB}
                  onClose={handleCloseDBMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElDB}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    open={Boolean(anchorElDB)}
                    onClose={handleCloseDBMenu}
                  >
                    {/* {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))} */}
                  </Menu>
                </Popover>

                {/* {mapNavLinks} */}

                {/* <Switch checked={darkMode} onChange={handleDarkModeToggle} /> */}
              </List>
            </Hidden>

            {/*<Hidden mdUp>
            {menuIconButton}

            <SwipeableDrawer
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              open={state}
              sx={{ display: { md: 'none', xs: 'block' } }}
            >
              {sideDrawerList}
            </SwipeableDrawer>
            </Hidden>*/}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}

export default CustomNavBar