import { Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, Card, CardContent } from "@mui/material"
import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { makeRequest } from "../../../axios"
import Notification from "../../../components/Notification"

function NewTicket({ theme }) {
  const navigate = useNavigate()

  const [category, setCategory] = useState("8")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const notification = useRef()

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
  }

  const handleMakeTicket = async () => {
    try {
      const response = await makeRequest.post("helpdesk/makeTicket", {
        category: category,
        title: title,
        description: description,
      })
      if (response.status === 200) {
        navigate("/helpdesk")
      }
    } catch (error) {
      sendNotification("error", "Nowe zgłoszenie", error.response.data)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Container>
        <Notification ref={notification} />
        <Typography variant='h5' mb={1}>
          Stwórz zgłoszenie
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-label'>Kategoria zgłoszenia</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={category}
                  label='Kategoria zgłoszenia'
                  onChange={(event) => {
                    setCategory(event.target.value)
                  }}>
                  <MenuItem value={"1"}>Punkty Premium</MenuItem>
                  <MenuItem value={"2"}>Zgłoś błąd w grze</MenuItem>
                  <MenuItem value={"3"}>Zgłoś gracza</MenuItem>
                  <MenuItem value={"4"}>Apelacja od bana</MenuItem>
                  <MenuItem value={"5"}>Apelacja od AJ</MenuItem>
                  <MenuItem value={"6"}>Problem z kontem</MenuItem>
                  <MenuItem value={"7"}>Problem z pojazdem/interiorem</MenuItem>
                  <MenuItem value={"8"}>Inne</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ marginTop: "15px" }}
                id='standard-basic'
                label='Tytuł zgłoszenia'
                variant='outlined'
                fullWidth
                onChange={(event) => {
                  setTitle(event.target.value)
                }}
                value={title}
              />
              <TextField
                sx={{ marginTop: "15px" }}
                id='standard-basic'
                label='Opis zgłoszenia'
                variant='outlined'
                rows={4}
                multiline
                fullWidth
                onChange={(event) => {
                  setDescription(event.target.value)
                }}
                value={description}
              />
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={"row"} spacing={1} sx={{ marginTop: "15px" }}>
          <Button variant='contained' color='primary' sx={{ width: "fit-content" }} onClick={handleMakeTicket}>
            Wyślij zgłoszenie
          </Button>
          <Button
            variant='outlined'
            color='primary'
            sx={{ width: "fit-content" }}
            onClick={() => {
              navigate("/helpdesk")
            }}>
            Moje zgłoszenia
          </Button>
        </Stack>
      </Container>
    </motion.div>
  )
}

export default NewTicket
