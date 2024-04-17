import { createTheme } from "@mui/material/styles"

export const darkTheme = createTheme({
  transitions: {
    duration: {
      standard: 0,
    },
  },

  palette: {
    mode: "dark",

    primary: {
      light: "#B287FF",
      main: "#9155FD",
      dark: "#6D3DCB",
    },

    secondary: {
      light: "#C8D6FF",
      main: "#87B2FF",
      dark: "#4F79FF",
    },

    background: {
      default: "rgb(40, 36, 61)",
      paper: "#312D4B",
      paperLight: "rgba(231, 227, 252, 0.05)",
    },

    text: {
      primary: "#bebed2",
      secondary: "#7f8099",
    },

    divider: "rgba(255, 255, 255, 0.12)",
  },

  typography: {
    fontFamily: "Inter",
  },

  components: {
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: "rgba(231, 227, 252, 0.05)",
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingTop: "25px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #312D4B inset',
            WebkitTextFillColor: '#bebed2',
          },
        },
      },
    },
  },
})

export const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      light: "#B287FF",
      main: "#9155FD",
      dark: "#6D3DCB",
    },

    secondary: {
      light: "#C8D6FF",
      main: "#87B2FF",
      dark: "#4F79FF",
    },

    background: {
      default: "rgb(228,228,228)",
      paper: "#FFFFFF",
      paperLight: "rgba(58, 53, 65, 0.10)",
    },

    text: {
      primary: "#6f6f7a",
      secondary: "#8e8e9c",
    },

    divider: "rgba(0, 0, 0, 0.12)",

    alert: {
      info: "#ff0000",
    },
  },

  typography: {
    fontFamily: "Inter",
  },

  components: {
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: "rgba(145, 85, 253, 0.15)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 0px 10px -2px rgb(215,215,215)",
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "0px 0px 10px -2px rgb(215,215,215)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #FFFFFF inset',
            WebkitTextFillColor: '#6f6f7a',
          },
        },
      },
    },
  },
})
