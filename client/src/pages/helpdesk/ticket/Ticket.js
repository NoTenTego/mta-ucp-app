import { Button, Chip, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Card, CardContent } from "@mui/material"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import LockIcon from "@mui/icons-material/Lock"
import { Box, Container, Stack } from "@mui/system"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { alpha } from "@mui/material/styles"
import { motion } from "framer-motion"
import { getRankName } from "../../../data/Ranks"
import { makeRequest } from "../../../axios"
import { TextField } from "@mui/material"
import Notification from "../../../components/Notification"
import { AuthContext } from "../../../context/AuthContext"

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

function getTimeAgoString(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  const timeDiff = now.getTime() - date.getTime()
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (timeDiff < 0) {
    return `przed chwilą`
  }

  if (seconds < 60) {
    return `${seconds} sekund temu`
  } else if (minutes < 60) {
    return `${minutes} minut temu`
  } else if (hours < 24) {
    return `${hours} godzin temu`
  } else {
    return `${days} dni temu`
  }
}

function Ticket({ theme }) {
  const { id } = useParams()
  const [data, setData] = useState({})
  const [answer, setAnswer] = useState("")

  const notification = useRef()

  const { currentUser } = useContext(AuthContext)

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
  }

  const fetchAllAnswers = async () => {
    try {
      const response = await makeRequest.post("helpdesk/getAllAnswers", {
        ticketId: id,
      })
      if (response.data) {
        setData(response.data)
      }
    } catch (error) {
      setData({})
    }
  }

  useEffect(() => {
    fetchAllAnswers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddAnswer = async () => {
    try {
      const response = await makeRequest.post("helpdesk/addAnswer", {
        ticketId: id,
        answer: answer,
      })
      if (response.status === 200) {
        fetchAllAnswers()
        setAnswer("")
      }
    } catch (error) {
      sendNotification("error", "Odpowiedź do zgłoszenia", error.response.data)
    }
  }

  const handleToggleTicket = async () => {
    const response = await makeRequest.post("helpdesk/toggleTicket", {
      ticketId: id,
    })

    if (response.status === 200) {
      setData((prevState) => ({
        ...prevState,
        topicData: {
          ...prevState.topicData,
          status: response.data,
        },
      }))
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
      {!data.topicData ? (
        <Typography variant='body1'>Nie posiadasz dostępu do tego zgłoszenia.</Typography>
      ) : (
        <Container>
          <Notification ref={notification} />
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
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component='th' scope='row'>
                    {id}
                  </TableCell>
                  <TableCell>{categoryName[data.topicData.category]}</TableCell>
                  <TableCell>{data.topicData.title}</TableCell>
                  {data.topicData.status === 0 ? (
                    <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>
                      <Chip icon={<LockOpenIcon />} label='Otwarte' color='success' />
                    </TableCell>
                  ) : data.topicData.status === 1 ? (
                    <TableCell sx={{ fontWeight: "600", fontSize: "16px" }}>
                      <Chip icon={<LockIcon />} label='Zamknięte' color='error' />
                    </TableCell>
                  ) : null}
                  <TableCell>{data.topicData.username}</TableCell>
                  <TableCell>{new Date(data.topicData.createdDate).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2}>
            <Box sx={{ padding: "10px", borderTop: "none" }} component={Paper} elevation={0}>
              <Stack spacing={1.4}>
                <Typography variant='h6' sx={{ fontWeight: "600", fontSize: "16px" }}>
                  Opis zgłoszenia
                </Typography>
                <Typography variant='span1'>{data.topicData.description}</Typography>
                <Divider />
                <Grid container gap={1} justifyContent={"flex-end"}>
                  {(currentUser.admin_level > 0 || currentUser.support_level > 0) && data.topicData.status === 0 ? (
                    <Grid item>
                      <Button variant='contained' color='error' onClick={handleToggleTicket}>
                        Zamknij zgłoszenie
                      </Button>
                    </Grid>
                  ) : null}
                  {(currentUser.admin_level > 0 || currentUser.support_level > 0) && data.topicData.status === 1 ? (
                    <Grid item>
                      <Button variant='contained' color='success' onClick={handleToggleTicket}>
                        Otwórz zgłoszenie
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              </Stack>
            </Box>
          </Stack>
          <Stack spacing={2} sx={{ marginTop: data.comments.length > 0 ? "30px" : null }} mb={4}>
            {data.comments.map((comment, index) => (
              <Box key={index} sx={{ padding: "10px" }} component={Paper} elevation={0}>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Stack direction='row' spacing={1}>
                      <Typography>{comment.username}</Typography>
                      {data.topicData.username === comment.username ? (
                        <Typography sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.5), padding: "2px 6px", borderRadius: "6px", fontSize: "13px", height: "100%" }}>Autor zgłoszenia</Typography>
                      ) : (
                        <Typography
                          sx={{
                            backgroundColor: alpha(getRankName(comment.admin, comment.supporter).rankColor, 0.2),
                            padding: "2px 6px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            height: "100%",
                          }}>
                          {getRankName(comment.admin, comment.supporter).rankName}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant='subtitle1'>
                      <b>{getTimeAgoString(comment.created)}</b>
                    </Typography>
                  </Box>
                  <Divider />
                  <Typography variant='span1'>{comment.content}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>

          {data.topicData.status === 1 || currentUser.admin_level > 0 || currentUser.support_level > 0 ? (
            <>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      id='standard-basic'
                      label='Treść odpowiedzi'
                      variant='outlined'
                      rows={4}
                      multiline
                      fullWidth
                      onChange={(event) => {
                        setAnswer(event.target.value)
                      }}
                      value={answer}
                    />
                    <Button variant='contained' sx={{ marginTop: "6px", width:'fit-content' }} onClick={handleAddAnswer}>
                      Dodaj odpowiedź
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : (
            <Box
              sx={{
                height: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid",
                borderColor: theme.palette.divider,
              }}>
              <Typography variant='subtitle1'>Nie możesz odpowiadać na zamknięte zgłoszenie</Typography>
            </Box>
          )}
          <Box sx={{ marginTop: "16px" }}></Box>
        </Container>
      )}
    </motion.div>
  )
}

export default Ticket
