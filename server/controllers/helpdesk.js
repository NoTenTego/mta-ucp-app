import { db } from "../connect.js"
import { getUserDataFromToken, hasPermission } from "../utils/auth.js"

export const getAllTickets = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  let ticketsQuery = "SELECT tickets.*, accounts.username AS username FROM tickets, accounts WHERE tickets.created_by=? AND accounts.id = tickets.created_by"

  if (hasPermission(token, 1, 1)) {
    ticketsQuery = "SELECT tickets.*, accounts.username AS username FROM tickets, accounts WHERE accounts.id = tickets.created_by"
  }

  db.query(ticketsQuery, [userData.id], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(data)
  })
}

export const makeTicket = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  const category = req.body.category
  const title = req.body.title
  const description = req.body.description

  if (title.length < 3) {
    return res.status(404).json("Tytuł jest zbyt krótki.")
  }

  if (description.length < 3) {
    return res.status(404).json("Opis zgłoszenia jest zbyt krótki.")
  }

  const ticketsQuery = "INSERT INTO tickets SET category=?, title=?, description=?, created_by=?"

  db.query(ticketsQuery, [category, title, description, userData.id], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(data)
  })
}

export const addAnswer = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const answer = req.body.answer
  const ticketId = req.body.ticketId

  if (answer.length < 1) {
    return res.status(404).json("Odpowiedź jest zbyt krótka, rozpisz się trochę.")
  }

  db.query("INSERT INTO tickets_answers SET ticket=?, creator=?, answer=?", [ticketId, userData.id, answer], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json('Pomyślnie dodano odpowiedź.')
  })
}

export const toggleTicket = (req, res) => {
  const ticketId = req.body.ticketId
  const token = req.cookies.accessToken

  if (!hasPermission(token, 1, 1)) {
    return res.status(404).json("Nie posiadasz permisji, żeby zmienić status zgłoszenia.")
  }

  db.query("SELECT status FROM tickets WHERE id=?", [ticketId], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    const currentStatus = data[0]?.status || 0
    const newStatus = currentStatus === 0 ? 1 : 0

    db.query("UPDATE tickets SET status=? WHERE id=?", [newStatus, ticketId], (err, updateData) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera.")
      }

      return res.status(200).json(newStatus)
    })
  })
}

export const getAllAnswers = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  const ticketId = req.body.ticketId

  let data = {
    topicData: {},
    comments: [],
  }

  db.query("SELECT tickets.status, tickets.created_by, tickets.created_date, tickets.description, tickets.category, tickets.title, accounts.username AS username FROM tickets, accounts WHERE tickets.id=? AND accounts.id = tickets.created_by", [ticketId], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    const row = result[0]
    data.topicData.username = row.username
    data.topicData.status = row.status
    data.topicData.category = row.category
    data.topicData.title = row.title
    data.topicData.description = row.description
    data.topicData.createdDate = row.created_date
    data.topicData.createdBy = row.created_by

    if (row.created_by !== userData.id && !hasPermission(token, 1, 1)) {
      return res.status(404).json("Nie masz dostępu do tego zgłoszenia.")
    }

    db.query("SELECT tickets_answers.created_date AS created, tickets_answers.answer AS content, accounts.username, accounts.support_level AS support, accounts.admin_level AS admin FROM tickets_answers, accounts WHERE tickets_answers.ticket=? AND accounts.id=tickets_answers.creator", [ticketId], (err, result) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera.")
      }

      data.comments = result.map((row) => ({
        username: row.username,
        admin: row.admin,
        created: row.created,
        content: row.content,
        supporter:row.support
      }))

      return res.status(200).json(data)
    })
  })
}
