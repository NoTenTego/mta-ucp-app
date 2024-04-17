import { useEffect, useState } from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Typography from "@mui/material/Typography"
import { ListItemText, Stack, Button, Box } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { makeRequest } from "../../axios"

export default function NotificationMenu({ theme, notifications, setNotifications }) {
  const [menuView, setMenuView] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [readNotificationsCount, setReadNotificationsCount] = useState(0);
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const newCount = notifications.filter((notification) => notification.status === 0).length;
    const readCount = notifications.filter((notification) => notification.status === 1).length;
    
    setNewNotificationsCount(newCount);
    setReadNotificationsCount(readCount);
  }, [notifications]);
  

  function getTimeAgo(date) {
    const currentDate = new Date()
    const diffMs = currentDate - new Date(date)

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    if (months > 0) {
      return months === 1 ? "1 miesiąc temu" : `${months} miesiące temu`
    } else if (weeks > 0) {
      return weeks === 1 ? "1 tydzień temu" : `${weeks} tygodnie temu`
    } else if (days > 0) {
      return days === 1 ? "1 dzień temu" : `${days} dni temu`
    } else if (hours > 0) {
      return hours === 1 ? "1 godzina temu" : `${hours} godzin temu`
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minuta temu" : `${minutes} minut temu`
    } else {
      return "przed chwilą"
    }
  }

  const changeNotificationStatus = async (notification) => {
    let status = 0

    if (notification.status === 0) {
      status = 1
    } else if (notification.status === 1) {
      status = 2
    }

    const response = await makeRequest.post("accounts/changeNotification", { status, id: notification.id })

    if (response.status === 200) {
      const restNotifications = notifications.filter((element) => element.id !== notification.id)
      setNotifications(restNotifications)
    }
  }

  return (
    <>
      <IconButton aria-label='MailIcon' sx={{ color: "text.primary" }} onClick={notifications.length === 0 ? null : handleClick}>
        <Badge badgeContent={newNotificationsCount} color='primary' sx={{ color: "text.primary" }}>
          <NotificationsNoneIcon />
        </Badge>
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
            width: "400px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <Stack
          mb={1}
          direction='row'
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}>
          <Typography ml={2} variant='subtitle1' fontSize={20}>
            Powiadomienia
          </Typography>
          <Typography
            mr={2}
            variant='subtitle1'
            fontSize={12}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              padding: ".1rem .3rem",
              color: "primary.main",
              borderRadius: "10px",
            }}>
            {menuView === 0 ? `${newNotificationsCount} Nowe` : `${readNotificationsCount} Przeczytane`}
          </Typography>
        </Stack>
        <Divider sx={{ marginBottom: "8px" }} />

        <Stack sx={{ maxHeight: "350px", overflow: "auto" }}>
          {notifications
            .filter((notification) => notification.status === menuView)
            .map((notification, index) => (
              <div key={index}>
                <MenuItem
                  onClick={() => {
                    changeNotificationStatus(notification)
                  }}>
                  <ListItemText
                    primary={
                      <Typography mr={1.3} whiteSpace='normal' variant='body2' color='text.primary'>
                        {notification["title"]}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1}>
                        <Typography mr={1.3} whiteSpace='normal' variant='body2' color='text.secondary'>
                          {notification["description"]}
                        </Typography>
                        {notification["charactername"] ? (
                          <Typography mr={1.3} whiteSpace='normal' variant='body2'>
                            {notification["charactername"].replace("_", " ")}
                          </Typography>
                        ) : null}
                      </Stack>
                    }
                  />
                  <Typography fontSize={12} variant='subtitle1' color='text.secondary'>
                    {getTimeAgo(notification["created_date"])}
                  </Typography>
                </MenuItem>
                {index !== notifications.filter((notification) => notification.status === menuView).length - 1 && <Divider />} {/* dodane */}
              </div>
            ))}
        </Stack>
        <Divider sx={{ marginTop: "8px" }} />
        <Box
          mt={2}
          mb={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant='contained'
            color='primary'
            sx={{ width: "93%" }}
            onClick={() => {
              setMenuView(menuView === 0 ? 1 : 0)
            }}>
            {menuView === 0 ? "Stare powiadomienia" : "Nowe powiadomienia"}
          </Button>
        </Box>
      </Menu>
    </>
  )
}
