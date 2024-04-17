import { useContext, useState } from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { IconButton, ListItemIcon, ListItemText, Stack, alpha } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import { useNavigate } from "react-router-dom"
import { makeRequest } from "../../axios"
import { AuthContext } from "../../context/AuthContext"
import { getRankName } from "../../data/Ranks"

export default function AccountMenu() {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const { rankName, rankColor } = getRankName(currentUser["admin_level"], currentUser["support_level"])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await makeRequest.post("auth/logout")

    localStorage.clear()
    navigate("/")
    window.location.reload()
  }

  return (
    <>
      <IconButton aria-label='MailIcon' sx={{ color: "text.primary" }} onClick={handleClick}>
        <AccountCircleIcon sx={{ color: "text.primary" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            border: "1px solid",
            borderColor: "divider",
            width: "250px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <Stack mb={1.3} ml={2} spacing={-0.4}>
          <Typography variant='subtitle1' fontSize={20}>
            {currentUser["username"]}
          </Typography>
          <Typography
            variant='subtitle2'
            fontSize={15}
            sx={{
              backgroundColor: alpha(rankColor, 0.2),
              padding: "2px 6px",
              borderRadius: "6px",
              fontSize: "12px",
              height: "100%",
              width: "fit-content",
            }}>
            {rankName}
          </Typography>
        </Stack>
        <Divider sx={{ marginBottom: "8px" }} />
        <Stack spacing={1} sx={{ maxHeight: "350px", overflow: "auto" }}>
          <MenuItem
            onClick={() => {
              navigate("/account/settings")
              handleClose()
            }}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography mr={1.3} whiteSpace='normal' variant='body1' color='text.primary'>
                  Ustawienia konta
                </Typography>
              }
            />
          </MenuItem>
        </Stack>
        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color='error' />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography mr={1.3} whiteSpace='normal' variant='body1' color='error'>
                Wyloguj się
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
    </>
  )
}
