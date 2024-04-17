import React, { useContext } from "react"
import Popper from "../poppers/Popper"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"
import { Typography, IconButton } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Stack from "@mui/material/Stack"
import Badge from "@mui/material/Badge"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { styled } from "@mui/material/styles"
import MenuItems from "../../data/MenuItems"
import { alpha } from "@mui/material/styles"
import NotificationMenu from "./NotificationMenu"
import logo from "../../assets/images/logo.png"
import AccountMenu from "./AccountMenu"
import { AuthContext } from "../../context/AuthContext"
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset"

const TransparentAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  boxShadow: "none",
  position: "fixed",
  backdropFilter: "blur(5px)",
}))

function TopNavigation({ theme, navigate, handleChangeTheme, notifications, setNotifications, setOpen }) {
  const { currentUser, rank } = useContext(AuthContext)

  return (
    <AppBar>
      <TransparentAppBar elevation={0}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            "@media (max-width: 1150px)": {
              justifyContent: "space-between",
            },
          }}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            onClick={() => {
              navigate("/")
            }}
            sx={{ cursor: "pointer" }}>
            <img src={logo} style={{ height: "30px" }} alt='logo'></img>
            <Typography variant='h5' sx={{ color: "text.primary" }} fontFamily={"Batangas"}>
              <b>Avalon RP</b>
            </Typography>
          </Stack>
          {currentUser ? (
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={0.2}>
              <IconButton aria-label='GameIcon' href='mtasa://192.168.1.105:22003'>
                <Badge
                  overlap={"rectangular"}
                  badgeContent={"offline"}
                  color='error'
                  sx={{
                    color: "text.primary",
                    "& .MuiBadge-badge": {
                      top: -3,
                    },
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}>
                  <VideogameAssetIcon/>
                </Badge>
              </IconButton>

              <IconButton aria-label='MailIcon' sx={{ color: "text.primary" }} onClick={handleChangeTheme}>
                {theme.palette.mode === "dark" ? <LightModeIcon sx={{ color: "text.primary" }} /> : <DarkModeIcon sx={{ color: "text.primary" }} />}
              </IconButton>

              <NotificationMenu theme={theme} notifications={notifications} setNotifications={setNotifications} />

              <AccountMenu theme={theme} />
            </Stack>
          ) : (
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
              <IconButton aria-label='MailIcon' sx={{ color: "text.primary" }} onClick={handleChangeTheme}>
                {theme.palette.mode === "dark" ? <LightModeIcon sx={{ color: "text.primary" }} /> : <DarkModeIcon sx={{ color: "text.primary" }} />}
              </IconButton>
              <Button
                variant='contained'
                size='small'
                color='primary'
                onClick={() => {
                  setOpen(true)
                }}>
                Dołącz do nas!
              </Button>
            </Stack>
          )}
        </Toolbar>
        <Divider />
        {currentUser ? (
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: theme.palette.mode === "dark" ? "0px 3px 6px -3px rgba(0,0,0,0.1)" : "0px 3px 6px -3px rgb(215,215,215)",
            }}>
            <Stack direction='row' spacing={3}>
              {MenuItems[rank].map((item, index) => (
                <div key={index}>
                  {"menuItems" in item ? (
                    <Popper
                      theme={theme}
                      routeItem={item.routeName}
                      title={
                        <>
                          {item.leftIcon}
                          {item.title} <ArrowDropDownIcon />
                        </>
                      }
                      data={item.menuItems}
                      navigate={navigate}
                    />
                  ) : (
                    <>
                      {window.location.pathname.indexOf(item.route) !== -1 ? (
                        <Button
                          variant='contained'
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: "500",
                            borderRadius: "21px",
                            paddingX: "22px",
                            background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                          }}
                          onClick={() => {
                            navigate(item.route)
                          }}>
                          {item.leftIcon}
                          {item.title}
                        </Button>
                      ) : (
                        <Button
                          variant={"text"}
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: "500",
                            borderRadius: "21px",
                            paddingX: "22px",
                            color: "text.primary",
                          }}
                          onClick={() => {
                            navigate(item.route)
                          }}>
                          {item.leftIcon}
                          {item.title}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </Stack>
          </Toolbar>
        ) : null}
      </TransparentAppBar>
    </AppBar>
  )
}

export default TopNavigation
