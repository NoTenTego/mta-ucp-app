import { Card, CardContent, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography, Button, Avatar, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText } from "@mui/material"
import React, { useState } from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"
import { formatMoney } from "../../../components/Utils"

function Factions({ sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:740px)")
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [data, setData] = useState([
    { title: "Wypłata godz. frakcji", limit: 1000, defaultLimit: 800 },
    { title: "Wypłata godz. biznesu", limit: 650, defaultLimit: 600 },
    { title: "Wypłata godz. celebrytów", limit: 400, defaultLimit: 400 },
  ])
  const [backdrop, setBackdrop] = useState(false)
  const [backdropData, setBackdropData] = useState(null)
  const [price, setPrice] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResetFactions = () => {
    sendNotification("success", "Przywróć domyślne", "Przywrócono")

    //data from base
    const updatedData = data.map((value) => {
      return { ...value, limit: value.defaultLimit }
    })
    setData(updatedData)

    handleClose()
  }

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
          <Stack>
            <Typography variant='h5'>Frakcje, Biznesy, CP</Typography>
            <Stack direction={"row"} spacing={1}>
              <Typography variant='subtitle1' color={"text.secondary"}>
                Limit dzienny
              </Typography>
              <Typography variant='subtitle1' fontWeight={600}>
                {formatMoney(3500)}
              </Typography>
            </Stack>
          </Stack>
          <IconButton aria-label='reset' onClick={handleClick}>
            <MoreVertIcon />
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
                border: "1px solid",
                borderColor: "divider",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <MenuItem>
              <ListItemIcon>
                <RestartAltIcon color='warning' />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography mr={1.3} whiteSpace='normal' variant='body1'>
                    Przywróć domyślne
                  </Typography>
                }
                onClick={handleResetFactions}
              />
            </MenuItem>
          </Menu>
        </Stack>
        <Stack spacing={3} direction={isSmallScreen ? "column" : "row"} justifyContent={isSmallScreen ? "flex-start" : "space-between"} mt={5.4} alignItems={"flex-start"}>
          {data.map((value, index) => (
            <Stack spacing={1} key={index} justifyContent={"center"}>
              <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
                <Avatar variant='rounded' sx={{ backgroundColor: "primary.dark" }}>
                  <BusinessCenterIcon sx={{ color: "#ffffff" }} />
                </Avatar>
                <Stack spacing={-0.5}>
                  <Typography variant='subtitle1'>{value.title}</Typography>
                  {value.limit === value.defaultLimit ? (
                    <Typography variant='h5' fontWeight={600}>
                      {formatMoney(value.limit)}
                    </Typography>
                  ) : (
                    <Stack direction={"row"} spacing={1} alignItems={"flex-end"}>
                      <Typography variant='h5' fontWeight={600}>
                        {formatMoney(value.limit)}
                      </Typography>
                      <Typography variant='subtitle1' color={"error"}>
                        <s>{formatMoney(value.defaultLimit)}</s>
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
              <Button
                variant='contained'
                color='error'
                size='small'
                onClick={() => {
                  setPrice(value.limit)
                  setBackdrop(true)
                  setBackdropData(value.title)
                }}>
                Zmień
              </Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
      <Dialog
        open={backdrop}
        onClose={() => {
          setBackdrop(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{backdropData}</DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>Domyślna wartość: ${price}</DialogContentText>
          <TextField
            id='Limit'
            label='Limit'
            variant='outlined'
            value={price}
            onChange={(event) => {
              setPrice(event.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setData((prevData) =>
                prevData.map((value) =>
                  value.title === backdropData
                    ? {
                        ...value,
                        limit: Number(price),
                      }
                    : value
                )
              )

              setBackdrop(false)
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdrop(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Factions
