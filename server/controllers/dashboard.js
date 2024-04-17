import { db } from "../connect.js"

let gameServerData = []

export const getAllStats = (req, res) => {
  gameServerData = req.body[0]
  res.status(200).json({ message: "done" })
}

export const getAll = (req, res) => {
  return res.status(200).json(gameServerData)
}

export const getServerTimestamp = (req, res) => {
  return res.status(200).json(Math.floor(Date.now() /1000))
}

export const getServerStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM accounts) AS accounts,
      (SELECT COUNT(*) FROM characters) AS characters,
      (SELECT COUNT(*) FROM interiors) AS interiors,
      (SELECT COUNT(*) FROM vehicles) AS vehicles;
  `

  db.query(query, [], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(result[0])
  })
}

export const getTopPlayers = (req, res) => {
  const query = `SELECT id, charactername AS fullName, bankmoney AS bankMoney, class FROM characters ORDER BY bankmoney DESC LIMIT 10`

  db.query(query, [], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(result)
  })
}