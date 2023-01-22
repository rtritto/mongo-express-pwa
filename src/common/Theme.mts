// import { Roboto } from '@next/font/google/index.js'
import { createTheme, emphasize } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// export const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif']
// })

// Create a theme instance.
let Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    }
  }
  // typography: {
  //   fontFamily: roboto.style.fontFamily
  // }
})

const backgroundColor = Theme.palette.mode === 'light'
  ? Theme.palette.grey[100]
  : Theme.palette.grey[800]

Theme = createTheme(Theme, {
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor,
          height: Theme.spacing(3),
          color: Theme.palette.text.primary,
          fontWeight: Theme.typography.fontWeightRegular,
          '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06)
          },
          '&:active': {
            boxShadow: Theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12)
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: Theme.palette.action.hover
          },
          // remove last border
          // '&:last-child td, &:last-child th': {
          //   borderBottom: 0
          // }
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#616161'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: `1px solid rgba(81, 81, 81, 1)`,
          paddingBottom: 0,
          paddingTop: 0
          // add divider border in middle
          // '&:not(:first-child):not(:last-child)': {
          //   borderLeft: '1px solid rgba(81, 81, 81, 1)',
          //   borderRight: '1px solid rgba(81, 81, 81, 1)'
          // }
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: Theme.spacing(1),
          marginBottom: Theme.spacing(2)
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        startIcon: { margin: 0 }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: { padding: Theme.spacing(1) }
      }
    }
  }
})

export default Theme