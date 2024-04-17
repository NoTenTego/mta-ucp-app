import { useContext, useEffect, useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Typography, useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import LockIcon from "@mui/icons-material/Lock"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { motion } from "framer-motion"
import { makeRequest } from "../../axios.js"
import { AuthContext } from "../../context/AuthContext"

const categoryName = {
  1: "Punkty Premium",
  2: "Zgłoś błąd w grze",
  3: "Zgłoś gracza",
  4: "Apelacja od bana",
  5: "Apelacja od AJ",
  6: "Problem z kontem",
  7: "Problem z pojazdem/interiorem",
  8: "Inne",
}

const CustomRow = ({ row }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const statuses = [
    { icon: <LockOpenIcon />, label: "Otwarte", color: "success" },
    { icon: <LockIcon />, label: "Zamknięte", color: "error" },
  ]

  return (
    <>
      <TableRow key={row.name}>
        <TableCell component='th' scope='row'>
          {row.id}
        </TableCell>
        <TableCell>{categoryName[row.category]}</TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>
          <Chip icon={statuses[row.status].icon} label={statuses[row.status].label} color={statuses[row.status].color} />
        </TableCell>
        <TableCell>{row.username}</TableCell>
        <TableCell>{new Date(row.created_date).toLocaleString()}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <Chip
              icon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              label='Podgląd'
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setOpen(!open)
              }}
            />
            <Chip
              icon={<ExitToAppIcon />}
              label='Przejdź'
              sx={{ cursor: "pointer" }}
              color='primary'
              onClick={() => {
                navigate("ticket/" + row.id)
              }}
            />
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7} sx={{backgroundColor:'background.paperLight'}}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box mt={2} mb={2}>
              <Stack spacing={1.4}>
                <Typography variant='h6' sx={{ fontWeight: "600", fontSize: "16px" }}>
                  Opis zgłoszenia
                </Typography>
                <Typography variant='span1'>{row.description}</Typography>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function Helpdesk() {
  const isSmallScreen = useMediaQuery("(max-width:900px)")
  const navigate = useNavigate()
  const { rank } = useContext(AuthContext)

  const [backdropOpen, setBackdropOpen] = useState(false)

  const [rows, setRows] = useState([])

  const fetchAllTickets = async () => {
    const response = await makeRequest.get("helpdesk/getAllTickets")
    if (response.data) {
      setRows(response.data)
    }
  }

  useEffect(() => {
    fetchAllTickets()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Stack spacing={3} mb={1}>
        <Stack direction={isSmallScreen ? "column" : "row"} justifyContent={"space-between"} alignItems={isSmallScreen ? "flex-start" : "center"} spacing={2}>
          <Box>
            <Typography variant='h6'>{rank === 1 ?  "Wszystkie zgłoszenia graczy" : "Moje zgłoszenia"}</Typography>
            <Typography variant='subtitle2' color={"text.secondary"}>
              {rank === 1 ?  "Centrum pomocy to miejsce w którym gracze mogą kontaktować się z ekipą serwera." : "Centrum Pomocy to miejsce gdzie możesz kontaktować się z administracją"}
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setBackdropOpen(true)
            }}>
            Stwórz zgłoszenie
          </Button>
        </Stack>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 750 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Identyfikator</TableCell>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Kategoria</TableCell>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Tytuł</TableCell>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Stworzył</TableCell>
                <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>Data stworzenia</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell component='th' scope='row'>
                    Nie posiadasz żadnych zgłoszeń
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => <CustomRow key={index} row={row} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={backdropOpen}
          onClose={() => {
            setBackdropOpen(false)
          }}
          PaperProps={{
            elevation: 0, // Ustawienie elevation na 0
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>{"Skontaktuj się"}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>Zanim przejdziesz dalej, sprawdź naszą gotową baze pytań i odpowiedzi</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                navigate("/helpdesk/new")
              }}>
              Stwórz nowe zgłoszenie
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                navigate("/helpdesk/faq")
              }}>
              Przejdź do FAQ
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </motion.div>
  )
}
