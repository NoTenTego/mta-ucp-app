import { CssBaseline, ThemeProvider } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Container } from "@mui/system"
import { useState, useEffect, useContext } from "react"
import { lightTheme, darkTheme } from "./data/Theme"
import NotFoundPage from "./pages/misc/NotFoundPage"
import Navigation from "./components/navigation/Navigation"
import Dashboard from "./pages/dashboard/Dashboard"
import Characters from "./pages/characters/Characters"
import Character from "./pages/characters/character/Character"
import NewCharacter from "./pages/characters/newCharacter/NewCharacter"
import Helpdesk from "./pages/helpdesk/Helpdesk"
import NewTicket from "./pages/helpdesk/newTicket/NewTicket"
import Ticket from "./pages/helpdesk/ticket/Ticket"
import Faq from "./pages/helpdesk/newTicket/Faq"
import Premiumshop from "./pages/premiumshop/Premiumshop"
import Settings from "./pages/account/settings/Settings"
import Blog from "./pages/blog/Blog"
import ServerManagement from "./pages/admin/servermanagement/ServerManagement"
import PlayersManagement from "./pages/admin/playersmanagement/PlayersManagement"
import Logs from "./pages/admin/logs/Logs"
import { AuthContext } from "./context/AuthContext"

function App() {
  const { currentUser, rank } = useContext(AuthContext)
  const isSmallScreen = useMediaQuery("(max-width:1150px)")
  const navigate = useNavigate()

  const [theme, setTheme] = useState(darkTheme)
  const [marginTop, setMarginTop] = useState("160px")

  const [loginState, setLoginState] = useState(1)

  const [open, setOpen] = useState(false)

  const getScrollbarStyles = (theme) => `
    ::-webkit-scrollbar {
      width: 5px;
      height:5px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.palette.divider};
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme.palette.text.secondary};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${theme.palette.text.primary};
    }
  `

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = getScrollbarStyles(theme)
    document.getElementsByTagName("head")[0].appendChild(style)

    const cacheTheme = localStorage.getItem("theme")
    if (cacheTheme === "lightTheme") {
      setTheme(lightTheme)
    } else if (cacheTheme === null) {
      setTheme(theme)
    } else {
      setTheme(darkTheme)
    }
  }, [theme])

  useEffect(() => {
    if (isSmallScreen) {
      setMarginTop("80px")
    } else {
      setMarginTop("160px")
    }
  }, [isSmallScreen])

  const handleChangeTheme = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme)
      localStorage.setItem("theme", "darkTheme")
    } else {
      setTheme(lightTheme)
      localStorage.setItem("theme", "lightTheme")
    }
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Navigation isSmallScreen={isSmallScreen} theme={theme} navigate={navigate} handleChangeTheme={handleChangeTheme} setOpen={setOpen} />

        <Container sx={{ marginTop: "80px" }} maxWidth='xl'>
          <Routes>
            <Route path='*' element={<Blog theme={theme} loginState={loginState} setLoginState={setLoginState} open={open} setOpen={setOpen} />} />
            <Route path='/' element={<Blog theme={theme} loginState={loginState} setLoginState={setLoginState} open={open} setOpen={setOpen} />} />
          </Routes>
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Navigation isSmallScreen={isSmallScreen} theme={theme} navigate={navigate} handleChangeTheme={handleChangeTheme} setOpen={setOpen} />

      <Container sx={{ marginTop: marginTop }} maxWidth='xl'>
        <Routes>
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/' element={<Blog theme={theme} loginState={loginState} setLoginState={setLoginState} open={open} setOpen={setOpen} />} />

          <Route path='/dashboard' element={<Dashboard theme={theme} />} />

          <Route path='/characters' element={<Characters theme={theme} />} />
          <Route path='/characters/details/:id' element={<Character theme={theme} />} />
          <Route path='/characters/new' element={<NewCharacter />} />

          <Route path='/helpdesk' element={<Helpdesk theme={theme} />} />
          <Route path='/helpdesk/new' element={<NewTicket theme={theme} />} />
          <Route path='/helpdesk/faq' element={<Faq />} />
          <Route path='/helpdesk/ticket/:id' element={<Ticket theme={theme} />} />

          <Route path='/premiumshop' element={<Premiumshop />} />

          <Route path='/account/settings' element={<Settings theme={theme} />} />

          {rank > 0 && (
            <>
              <Route path='/admin/logs' element={<Logs theme={theme} />} />
              <Route path='/admin/servermanagement' element={<ServerManagement theme={theme} />} />
              <Route path='/admin/playersmanagement' element={<PlayersManagement theme={theme} />} />
            </>
          )}
        </Routes>
      </Container>
    </ThemeProvider>
  )
}

export default App
