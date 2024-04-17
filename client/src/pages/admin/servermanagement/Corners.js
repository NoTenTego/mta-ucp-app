import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Card,
  Typography,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  DialogContent,
  DialogContentText,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React, { useState } from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { formatMoney } from "../../../components/Utils"

function Corners({ sendNotification, theme }) {
  const defaultDayCornerLimit = 5000
  const [dayLimit, setDayLimit] = useState([defaultDayCornerLimit, defaultDayCornerLimit])
  const [backdropCorner, setBackdropCorner] = useState(false)
  const [backdropLimit, setBackdropLimit] = useState(false)
  const [backdropCornerData, setBackdropCornerData] = useState({ id: null, name: "", price: [], defaultPrice: [] })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [data, setData] = useState({
    cells: ["ID", "Nazwa", "Aktualna cena", "Domyślna cena"],
    drugs: [
      { id: 34, name: "Kokaina", price: [180, 240], defaultPrice: [180, 240] },
      { id: 35, name: "Morfina", price: [95, 170], defaultPrice: [180, 240] },
      { id: 36, name: "Ekstazy", price: [150, 190], defaultPrice: [180, 240] },
      { id: 37, name: "Heroina", price: [90, 110], defaultPrice: [180, 240] },
      { id: 38, name: "Marihuana", price: [40, 100], defaultPrice: [180, 240] },
      { id: 39, name: "Metamfetamina", price: [120, 140], defaultPrice: [180, 240] },
      { id: 40, name: "Epinefryna", price: [100, 180], defaultPrice: [180, 240] },
      { id: 41, name: "LSD", price: [110, 140], defaultPrice: [180, 240] },
      { id: 42, name: "Grzyby psylocybinowe", price: [50, 110], defaultPrice: [180, 240] },
      { id: 43, name: "PCP", price: [70, 100], defaultPrice: [180, 240] },
    ],
  })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResetCorners = () => {
    sendNotification("success", "Przywróć domyślne", "Przywrócono")

    const updatedData = data.drugs.map((corner) => {
      const [min, max] = corner.defaultPrice
      return { ...corner, price: [min, max] }
    })

    setData((prevData) => ({
      ...prevData,
      drugs: updatedData,
    }))
    setDayLimit([defaultDayCornerLimit, defaultDayCornerLimit])

    handleClose()
  }

  return (
    <Stack spacing={1}>
      <Card elevation={0}>
        <CardContent>
          <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant='h5'>Ceny narkotyków na cornerach</Typography>
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
                  onClick={handleResetCorners}
                />
              </MenuItem>
            </Menu>
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={3}>
            <Box>
              <Typography variant='h4' fontWeight={600}>
                {formatMoney(dayLimit[0])}
              </Typography>
              <Typography variant='subtitle1' color={"text.secondary"}>
                Limit dzienny
              </Typography>
            </Box>
            <Button variant='contained' color='error' onClick={() => setBackdropLimit(true)}>
              ZMIEŃ LIMIT
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <TableContainer component={Paper} elevation={0} sx={{ height: "340px" }}>
        <Table aria-label='simple table' size='small' stickyHeader sx={{ minWidth: "650px", overflow: "auto" }}>
          <TableHead>
            <TableRow>
              {data.cells.map((cell, index) => (
                <TableCell key={index} align='left' sx={{ fontWeight: "600", fontSize: "16px", backgroundColor: "primary.dark", color: "#ffffff" }}>
                  {cell}
                </TableCell>
              ))}
              <TableCell align='left' sx={{ backgroundColor: "primary.dark" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.drugs.map((drug, index) => (
              <TableRow key={index}>
                <TableCell>{drug.id}</TableCell>
                <TableCell>{drug.name}</TableCell>
                <TableCell>{"$" + drug.price[0] + " - $" + drug.price[1]}</TableCell>
                <TableCell sx={{ color: JSON.stringify(drug.price) === JSON.stringify(drug.defaultPrice) ? "text.error" : "error.main" }}>{"$" + drug.defaultPrice[0] + " - $" + drug.defaultPrice[1]}</TableCell>
                <TableCell>
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={() => {
                      setBackdropCornerData(drug)
                      setBackdropCorner(true)
                    }}>
                    Zmień
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={backdropCorner}
        onClose={() => {
          setBackdropCorner(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{backdropCornerData.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Domyślne cena: ${backdropCornerData.defaultPrice[0]} - ${backdropCornerData.defaultPrice[1]}
          </DialogContentText>

          <Stack mt={1} spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label={"Od"}
              value={backdropCornerData.price[0]}
              onChange={(event) =>
                setBackdropCornerData((prevData) => ({
                  ...prevData,
                  price: [Number(event.target.value), prevData.price[1]],
                }))
              }
            />
            <TextField
              variant='outlined'
              fullWidth
              label={"Do"}
              value={backdropCornerData.price[1]}
              onChange={(event) =>
                setBackdropCornerData((prevData) => ({
                  ...prevData,
                  price: [prevData.price[0], Number(event.target.value)],
                }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setData((prevData) => {
                const drugs = prevData.drugs || []

                const updatedDrugs = drugs.map((drug) =>
                  drug.id === backdropCornerData.id
                    ? {
                        ...drug,
                        price: backdropCornerData.price,
                      }
                    : drug
                )

                return {
                  ...prevData,
                  drugs: updatedDrugs,
                }
              })
              setBackdropCorner(false)
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdropCorner(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={backdropLimit}
        onClose={() => {
          setBackdropLimit(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Ustawienia limitu dziennego</DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>Domyślna wartość: {formatMoney(defaultDayCornerLimit)}</DialogContentText>
          <TextField
            id='DayLimit'
            label='Limit'
            variant='outlined'
            fullWidth
            value={dayLimit[1]}
            onChange={(event) => {
              setDayLimit([dayLimit[0], event.target.value])
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setDayLimit([dayLimit[1], dayLimit[1]])
              setBackdropLimit(false)
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdropLimit(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default Corners
