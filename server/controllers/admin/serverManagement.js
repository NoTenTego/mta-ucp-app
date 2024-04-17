import { db } from "../../connect.js"
import { getUserDataFromToken, hasPermission } from "../../utils/auth.js"

export const getItemlist = (req, res) => {
  const token = req.cookies.accessToken
  
  if (!hasPermission(token, 1, 1)) {
    return res.status(401).json('Nie posiadasz uprawnień do przeglądania listy przedmiotów.')
  }

  db.query(`SELECT id, name, itemID AS type, value_1 AS value1, value_2 AS value2, category FROM itemlist`, (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(data)
  })
}

export const makeItem = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const {name, itemID, value_1, value_2, category} = req.body

  if (!hasPermission(token, 2)) {
    return res.status(401).json('Nie posiadasz uprawnień do tworzenia przedmiotów.')
  }

  db.query(`INSERT INTO itemlist SET name=?, itemID=?, value_1=?, value_2=?, category=?, createdBy=?`, [name, itemID, value_1, value_2, category, userData.username], (err, result) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(result.insertId)
  })
}

export const deleteItem = (req, res) => {
  const token = req.cookies.accessToken
  const id = req.body

  if (!hasPermission(token, 2)) {
    return res.status(401).json('Nie posiadasz uprawnień do usuwania przedmiotów.')
  }

  db.query(`DELETE FROM itemlist WHERE id=?`, [id], (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json('Pomyślnie usunięto przedmiot.')
  })
}