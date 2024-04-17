import { db } from "../../connect.js"
import { hasPermission } from "../../utils/auth.js"

export const getAccounts = (req, res) => {
  const token = req.cookies.accessToken

  if (!hasPermission(token, 1, 1)) {
    return res.status(404).json("Nie posiadasz uprawnień do przeglądania kont graczy.")
  }

  db.query(`SELECT id, username, activated, hours, beta, ban FROM accounts`, (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(data)
  })
}

export const editAccount = (req, res) => {
  const token = req.cookies.accessToken

  if (!hasPermission(token, 2)) {
    return res.status(404).json("Nie posiadasz uprawnień do edycji kont graczy.")
  }

  const { ban, username, id } = req.body

  if (ban != 0 && ban != 1) {
    return res.status(404).json('1 - ban | 0 - brak bana XD')
  }

  db.query(`UPDATE accounts SET ban=?, username=? WHERE id=?`, [ban, username, id], (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json('Pomyślnie edytowano konto.')
  })
}

export const getCharacters = (req, res) => {
  const token = req.cookies.accessToken

  if (!hasPermission(token, 1, 1)) {
    return res.status(404).json("Nie posiadasz uprawnień do przeglądania postaci graczy.")
  }

  db.query(`SELECT characters.id, characters.account, accounts.username, characters.class, characters.charactername, characters.skincolor, characters.gender, characters.age, characters.day, characters.month, characters.weight, characters.height, characters.business, characters.active FROM characters INNER JOIN accounts ON characters.account = accounts.id`, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data)
  })
}

export const getBusinesses = (req, res) => {
  const token = req.cookies.accessToken
  
  if (!hasPermission(token, 1, 1)) {
    return res.status(404).json("Nie posiadasz uprawnień do przeglądania biznesów.")
  }

  db.query(`SELECT * FROM businesses`, (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(data)
  })
}