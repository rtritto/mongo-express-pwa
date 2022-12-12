import Image from 'next/image.js'
import Link from 'next/link.js'
import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  SwipeableDrawer,
  Switch,
  Typography,
  Toolbar,
  Breadcrumbs
} from '@mui/material'

// import { darkModeState } from 'src/store/Theme/atoms'
import { Apps, Close, Hamburger, Home, Info, PlayCircleFilledOutlined } from 'common/SvgIcons.mts'
import NavDatabases from './NavDatabases.tsx'

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
    <ListItemButton sx={{ width: { md: 'auto' } /* display inline text and center span */ }}>
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
        dense
        onClick={() => { setState(false) }}	// close Drawer after ListItem click
        sx={{ padding: 0 }}
      >
        {mapNavLinks}
      </List>

      <Divider />

      {/* <Switch checked={darkMode} onChange={handleDarkModeToggle} /> */}
    </Box>
  )

  return (
    <AppBar position="relative">
      <Container>
        <Toolbar disableGutters variant="dense">
          <Hidden mdDown>
            <List
              aria-labelledby="main navigation"
              component="nav"
              sx={{	// navDisplayFlex
                display: 'flex',
                padding: 0,
                alignItems: 'center',
                // justifyContent: 'space-between'
              }}
            >
              <Link
                key="logoNav"
                href="/"
                passHref
                style={{ display: 'flex', margin: 10 /* padding: 0, verticalAlign: 'middle' */ }}
              >
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
                  padding: 2,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Mongo Express
              </Typography>

              <Breadcrumbs aria-label="breadcrumb" separator=">">
                <NavDatabases />

                <Link
                  key={'title'}
                  href={'/db/test'}
                  passHref
                  style={{
                    color: 'white',
                    textDecoration: 'none' /* remove text underline */
                  }}
                >
                  Test
                </Link>
              </Breadcrumbs>

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
  )
}

export default CustomNavBar