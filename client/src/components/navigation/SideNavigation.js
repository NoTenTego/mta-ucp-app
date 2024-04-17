import React, { useContext, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import MenuIcon from "@mui/icons-material/Menu"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import Collapse from "@mui/material/Collapse"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import MenuItems from "../../data/MenuItems"
import { alpha } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import NotificationMenu from "./NotificationMenu"
import AccountMenu from "./AccountMenu"
import { Button } from "@mui/material"
import logo from "../../assets/images/logo.png"
import { AuthContext } from "../../context/AuthContext"

const TransparentAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  boxShadow: "none",
  position: "fixed",
  backdropFilter: "blur(5px)",
}))

function SideNavigation({ theme, handleChangeTheme, notifications, setNotifications, setOpenLogin }) {
  const navigate = useNavigate()
  const { currentUser, rank } = useContext(AuthContext)

  const [state, setState] = useState(false)
  const [open, setOpen] = useState({
    dashboards: false,
    sekretariat: false,
  })

  return (
    <>
      <TransparentAppBar elevation={0}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "cener",
            boxShadow: theme.palette.mode === 'dark' ? "0px 3px 6px -3px rgba(0,0,0,0.1)" : "0px 3px 6px -3px rgb(215,215,215)",
            "@media (max-width: 1150px)": {
              justifyContent: "space-between",
            },
          }}>
          {currentUser ? (
            <>
              <MenuIcon sx={{ color: "text.primary" }} onClick={() => setState(true)} />
              <Stack direction='row' justifyContent='center' alignItems='center' spacing={0.2}>
                <IconButton aria-label='MailIcon' sx={{ color: "text.primary" }} onClick={handleChangeTheme}>
                  {theme.palette.mode === "dark" ? <LightModeIcon sx={{ color: "text.primary" }} /> : <DarkModeIcon sx={{ color: "text.primary" }} />}
                </IconButton>

                <NotificationMenu theme={theme} notifications={notifications} setNotifications={setNotifications} />

                <AccountMenu theme={theme} />
              </Stack>
            </>
          ) : (
            <>
              <Stack
                direction={"row"}
                spacing={1}
                alignItems={"center"}
                onClick={() => {
                  navigate("/")
                }}
                sx={{ cursor: "pointer" }}>
                <img src={logo} style={{ height: "30px" }} alt='logo'></img>
              </Stack>
              <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setOpenLogin(true)
                  }}
                  sx={{ fontSize: "12px" }}>
                  Dołącz do nas!
                </Button>
              </Stack>
            </>
          )}
        </Toolbar>
      </TransparentAppBar>

      <div>
        <Drawer
          anchor='left'
          open={state}
          onClose={() => setState(false)}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
            backdropFilter: "blur(2px)",
          }}
          elevation={0}>
          <Box sx={{ width: 260 }} role='presentation'>
            <List>
              {MenuItems[rank].map((navItem) => (
                <React.Fragment key={navItem.title}>
                  <ListItemButton
                    variant={window.location.pathname.indexOf(navItem.route) !== -1 ? "contained" : "text"}
                    sx={window.location.pathname.indexOf(navItem.route) !== -1 ? { background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`, color: "white" } : null}
                    onClick={() => {
                      setOpen({
                        ...open,
                        [navItem.title.toLowerCase()]: !open[navItem.title.toLowerCase()],
                      })
                      navigate(navItem.route && navItem.route.toLowerCase())
                    }}>
                    <ListItemIcon sx={{ minWidth: "40px" }}>{navItem.leftIcon}</ListItemIcon>
                    <ListItemText primary={navItem.title} />
                    {navItem.menuItems && (open[navItem.title.toLowerCase()] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                  {navItem.menuItems && (
                    <Collapse in={open[navItem.title.toLowerCase()]} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding>
                        {navItem.menuItems.map((menuItem) => (
                          <ListItemButton
                            onClick={() => navigate(menuItem.route && menuItem.route.toLowerCase())}
                            key={menuItem.title}
                            sx={
                              window.location.pathname.indexOf(menuItem.route) !== -1
                                ? {
                                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                                    color: "white",
                                    pl: 3,
                                  }
                                : { pl: 3 }
                            }>
                            <ListItemIcon sx={{ minWidth: "30px" }}>
                              <CircleOutlinedIcon sx={{ fontSize: "13px" }} />
                            </ListItemIcon>
                            <ListItemText primary={menuItem.title} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  {navItem.divider && (
                    <Divider textAlign='left' sx={{ marginTop: "16px" }}>
                      <Typography variant='caption' sx={{ color: "text.secondary" }}>
                        <b>{navItem.divider}</b>
                      </Typography>
                    </Divider>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Drawer>
      </div>
    </>
  )
}

export default SideNavigation
