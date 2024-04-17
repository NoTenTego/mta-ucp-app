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
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  DialogContent,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { makeRequest } from "../../../axios"

function Itemlist({ sendNotification, theme }) {
  const [backdropItemlist, setBackdropItemlist] = useState(false)
  const [backdropItemlistData, setBackdropItemlistData] = useState({
    id: null,
    name: "",
    type: 1,
    value1: 1,
    value2: 1,
    category: 1,
  })

  const [data, setData] = useState({
    cells: ["DBID", "Nazwa", "Typ", "Wartość 1", "Wartość 2", "Kategoria"],
    items: [],
  })

  const fetchItemlist = async () => {
    const response = await makeRequest.get("admin/getItemlist")
    if (response.data) {
      setData((prevData) => ({
        ...prevData,
        cells: ["DBID", "Nazwa", "Typ", "Wartość 1", "Wartość 2", "Kategoria"],
        items: response.data,
      }))
    }
  }

  const handleMakeItem = async () => {
    const name = backdropItemlistData.name
    const itemID = backdropItemlistData.type
    const value_1 = backdropItemlistData.value1
    const value_2 = backdropItemlistData.value2
    const category = backdropItemlistData.category

    if (value_1.length < 1 || value_2.length < 1 || name.length < 2) {
      return sendNotification("error", "Tworzenie przedmiotu", 'Uzupełnij wszystkie dane przedmiotu')
    }

    try {
      const response = await makeRequest.post("admin/makeItem", {
        name: name,
        itemID: itemID,
        value_1: value_1,
        value_2: value_2,
        category: category,
      })

      if (response.data) {
        const newItem = {
          id: response.data,
          name: name,
          type: itemID,
          value1: value_1,
          value2: value_2,
          category: category,
        }

        setData((prevData) => ({
          ...prevData,
          items: [...prevData.items, newItem],
        }))

        sendNotification("success", "Tworzenie przedmiotu", "Pomyślnie stworzono przedmiot o nazwie " + name)
      }
    } catch (error) {
      sendNotification("error", "Tworzenie przedmiotu", error.response.data)
    }

    setBackdropItemlist(false)
  }

  const handleSaveItem = () => {
    setData((prevData) => {
      const items = prevData.items || []

      const updatedItems = items.map((item) =>
        item.id === backdropItemlistData.id
          ? {
              ...item,
              name: backdropItemlistData.name,
              type: Number(backdropItemlistData.type),
              value1: backdropItemlistData.value1,
              value2: backdropItemlistData.value2,
              category: Number(backdropItemlistData.category),
            }
          : item
      )

      return {
        ...prevData,
        items: updatedItems,
      }
    })

    sendNotification("success", "Edycja przedmiotu", "Pomyślnie zapisano przedmiot o nazwie " + backdropItemlistData.name)
    setBackdropItemlist(false)
  }

  useEffect(() => {
    fetchItemlist()
  }, [])

  function getTypeName(type) {
    switch (type) {
      case 1:
        return "Jedzenie"
      case 2:
        return "Inne"
      default:
        return "Nieznany typ"
    }
  }

  function getCategoryName(category) {
    switch (category) {
      case 1:
        return "Portfel"
      case 2:
        return "Przedmioty ogólne"
      case 3:
        return "Bronie"
      default:
        return "Nieznana kategoria"
    }
  }

  return (
    <Stack spacing={1}>
      <Card elevation={0}>
        <CardContent>
          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <Typography variant='h5'>Lista przedmiotów</Typography>
            <Button
              variant='contained'
              onClick={() => {
                setBackdropItemlistData({ id: null, name: "", type: 1, value1: 1, value2: 1, category: 1 })
                setBackdropItemlist(true)
              }}>
              Stwórz
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
            {data.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{getTypeName(item.type)}</TableCell>
                <TableCell>{item.value1}</TableCell>
                <TableCell>{item.value2}</TableCell>
                <TableCell>{getCategoryName(item.category)}</TableCell>
                <TableCell>
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={() => {
                      setBackdropItemlistData(item)
                      setBackdropItemlist(true)
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
        open={backdropItemlist}
        onClose={() => {
          setBackdropItemlist(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{backdropItemlistData.id ? backdropItemlistData.name + ", DBID: " + backdropItemlistData.id : "Nowy przedmiot"}</DialogTitle>
        <DialogContent>
          <Stack mt={1} spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label={"Nazwa"}
              value={backdropItemlistData.name}
              onChange={(event) =>
                setBackdropItemlistData((prevData) => ({
                  ...prevData,
                  name: event.target.value,
                }))
              }
            />
            <FormControl variant='outlined' sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='demo-simple-select-standard-label'>Typ</InputLabel>
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                value={backdropItemlistData.type}
                onChange={(event) =>
                  setBackdropItemlistData((prevData) => ({
                    ...prevData,
                    type: event.target.value,
                  }))
                }
                label='Typ'>
                <MenuItem value={1}>Jedzenie</MenuItem>
                <MenuItem value={2}>Inne</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant='outlined'
              fullWidth
              label={"Wartość 1"}
              value={backdropItemlistData.value1}
              onChange={(event) =>
                setBackdropItemlistData((prevData) => ({
                  ...prevData,
                  value1: event.target.value,
                }))
              }
            />
            <TextField
              variant='outlined'
              fullWidth
              label={"Wartość 2"}
              value={backdropItemlistData.value2}
              onChange={(event) =>
                setBackdropItemlistData((prevData) => ({
                  ...prevData,
                  value2: event.target.value,
                }))
              }
            />
            <FormControl variant='outlined' sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='demo-simple-select-standard-label'>Kategoria</InputLabel>
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                value={backdropItemlistData.category}
                onChange={(event) =>
                  setBackdropItemlistData((prevData) => ({
                    ...prevData,
                    category: event.target.value,
                  }))
                }
                label='Kategoria'>
                <MenuItem value={1}>Portfel</MenuItem>
                <MenuItem value={2}>Przedmioty ogólne</MenuItem>
                <MenuItem value={3}>Bronie</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          {backdropItemlistData.id ? (
            <Button variant='contained' color='primary' onClick={handleSaveItem}>
              Zmień
            </Button>
          ) : (
            <Button variant='contained' color='primary' onClick={handleMakeItem}>
              Stwórz
            </Button>
          )}
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdropItemlist(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default Itemlist
