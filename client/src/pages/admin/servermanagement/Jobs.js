import React, { useState } from "react"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle"
import WorkIcon from "@mui/icons-material/Work"
import PhishingIcon from "@mui/icons-material/Phishing"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { Card, CardContent, IconButton, Stack, Typography, Button, Avatar, Box, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from "@mui/material"
import { formatMoney } from "../../../components/Utils"

function Jobs({ sendNotification }) {
  const [backdropPayday, setBackdropPayday] = useState(false)
  const defaultDayPaydayLimit = 2000
  const [dayLimit, setDayLimit] = useState([defaultDayPaydayLimit, defaultDayPaydayLimit])
  const [backdropDayLimit, setBackdropDayLimit] = useState(false)
  const [backdropData, setBackdropData] = useState({ title: "", description: ["", ""] })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [data, setData] = useState([
    { multiplier: false, title: "Dostawca pizzy", per: "[1 pizza]", defaultSalary: [50, 95], currentSalary: [100, 150], icon: <LocalShippingIcon sx={{ color: "#ffffff" }} /> },
    { multiplier: false, title: "Kierowca autobusu", per: "[1 przystanek]", defaultSalary: [50, 95], currentSalary: [100, 150], icon: <AirportShuttleIcon sx={{ color: "#ffffff" }} /> },
    { multiplier: false, title: "Magazynier", per: "[1 paczka]", defaultSalary: [50, 95], currentSalary: [100, 150], icon: <WorkIcon sx={{ color: "#ffffff" }} /> },
    { multiplier: true, title: "Rybak", per: "[1 połów]", defaultSalary: 100, currentSalary: 150, icon: <PhishingIcon sx={{ color: "#ffffff" }} /> },
    { multiplier: true, title: "Fotograf", per: "[1 oddanie zdjęć]", defaultSalary: 100, currentSalary: 150, icon: <CameraAltIcon sx={{ color: "#ffffff" }} /> },
  ])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResetJobs = () => {
    sendNotification("success", "Przywróć domyślne", "Przywrócono")

    //data from base
    const updatedData = data.map((job) => {
      if (Array.isArray(job.defaultSalary)) {
        const [min, max] = job.defaultSalary
        return { ...job, currentSalary: [min, max] }
      } else {
        return { ...job, currentSalary: job.defaultSalary }
      }
    })
    setData(updatedData)
    setDayLimit([defaultDayPaydayLimit, defaultDayPaydayLimit])

    handleClose()
  }

  return (
    <Card elevation={0}>
      <CardContent sx={{ height:'523px' }}>
        <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant='h5'>Prace dorywcze</Typography>
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
                onClick={handleResetJobs}
              />
            </MenuItem>
          </Menu>
        </Stack>
        <Stack mt={3} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Box>
            <Typography variant='h4' fontWeight={600}>
              {formatMoney(dayLimit[0])}
            </Typography>
            <Typography variant='subtitle1' color={"text.secondary"}>
              Limit dzienny
            </Typography>
          </Box>
          <Button variant='contained' size='small' color='error' onClick={() => {setBackdropDayLimit(true)}}>
            Zmień limit
          </Button>
        </Stack>
        <Stack mt={3} spacing={2}>
          {data.map((job, index) => (
            <Stack key={index} direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
              <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
                <Avatar variant='rounded' sx={{ backgroundColor: "primary.dark" }}>
                  {job.icon}
                </Avatar>
                <Stack spacing={0.3}>
                  <Typography variant='body1' fontWeight={600}>
                    {job.title} {job.per}
                  </Typography>
                  {job.multiplier ? (
                    <Stack direction={"row"} spacing={1.5}>
                      <Typography variant='body1' color='success'>
                        ${job.currentSalary}
                      </Typography>
                      {job.currentSalary === job.defaultSalary ? null : (
                        <Typography variant='body1' color='error'>
                          <s>${job.defaultSalary}</s>
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Stack direction={"row"} spacing={1.5}>
                      <Typography variant='body1' color='success'>
                        ${job.currentSalary[0]} - ${job.currentSalary[1]}
                      </Typography>
                      <Typography variant='body1' color='error'>
                        {JSON.stringify(job.currentSalary) === JSON.stringify(job.defaultSalary) ? null : (
                          <s>
                            ${job.defaultSalary[0]} ─ ${job.defaultSalary[1]}
                          </s>
                        )}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
              <Button
                variant='contained'
                size='small'
                color='error'
                onClick={() => {
                  setBackdropPayday(true)
                  setBackdropData({
                    id: job.title,
                    title: "Ustal dla " + job.title + " za " + job.per,
                    description: [
                      job.multiplier
                        ? `Przykładowo: Fotograf: $250/jedno oddanie zdjęć * wartośćWprowadzonaNiżej = wypłata`
                        : `Przykładowo: Dostawca pizzy: Losuj od "$${job.defaultSalary[0]}" do "$${job.defaultSalary[1]}" za dostarczenie jednej pizzy.`,
                      job.multiplier ? `Domyślnie: $${job.defaultSalary}` : `Domyślnie: $${job.defaultSalary[0]} - $${job.defaultSalary[1]}`,
                    ],
                    per: job.per,
                    currentSalary: job.currentSalary,
                  })
                }}>
                Zmień
              </Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
      <Dialog
        open={backdropPayday}
        onClose={() => {
          setBackdropPayday(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{backdropData.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{backdropData.description[0]}</DialogContentText>
          <DialogContentText mt={1} mb={1} id='alert-dialog-description'>
            {backdropData.description[1]}
          </DialogContentText>
          {Array.isArray(backdropData.currentSalary) ? (
            <Stack mt={1} spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                label={"Od"}
                value={backdropData.currentSalary[0]}
                onChange={(event) =>
                  setBackdropData((prevData) => ({
                    ...prevData,
                    currentSalary: [Number(event.target.value), prevData.currentSalary[1]],
                  }))
                }
              />
              <TextField
                variant='outlined'
                fullWidth
                label={"Do"}
                value={backdropData.currentSalary[1]}
                onChange={(event) =>
                  setBackdropData((prevData) => ({
                    ...prevData,
                    currentSalary: [prevData.currentSalary[0], Number(event.target.value)],
                  }))
                }
              />
            </Stack>
          ) : (
            <TextField
              variant='outlined'
              fullWidth
              label={backdropData.per}
              value={backdropData.currentSalary}
              onChange={(event) =>
                setBackdropData((prevData) => ({
                  ...prevData,
                  currentSalary: Number(event.target.value),
                }))
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setData((prevData) =>
                prevData.map((job) =>
                  job.title === backdropData.id
                    ? {
                        ...job,
                        currentSalary: backdropData.currentSalary,
                      }
                    : job
                )
              )
              setBackdropPayday(false)
              sendNotification("success", backdropData.id, "Pomyślnie zmieniono wynagrodzenie.")
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdropPayday(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={backdropDayLimit}
        onClose={() => {
          setBackdropDayLimit(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Ustawienia limitu dziennego</DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>Domyślna wartość: {formatMoney(defaultDayPaydayLimit)}</DialogContentText>
          <TextField
            id='DayLimit'
            label='Limit'
            variant='outlined'
            fullWidth
            value={dayLimit[1]}
            onChange={(event) => {
              setDayLimit([dayLimit[0], event.target.value]);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setDayLimit([dayLimit[1], dayLimit[1]])
              setBackdropDayLimit(false)
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdropDayLimit(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Jobs
