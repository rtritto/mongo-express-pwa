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
let theme = createTheme({
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

const backgroundColor = theme.palette.mode === 'light'
  ? theme.palette.grey[100]
  : theme.palette.grey[800]

theme = createTheme(theme, {
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor,
          height: theme.spacing(3),
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightRegular,
          '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06)
          },
          '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12)
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
          },
          // remove last border
          // '&:last-child td, &:last-child th': {
          //   borderBottom: 0
          // }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: `1px solid rgba(81, 81, 81, 1)`
          // add divider border in middle
          // '&:not(:first-child):not(:last-child)': {
          //   borderLeft: '1px solid rgba(81, 81, 81, 1)',
          //   borderRight: '1px solid rgba(81, 81, 81, 1)'
          // }
        }
      }
    }
  }
})

export default theme