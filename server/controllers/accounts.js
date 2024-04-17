import { db } from "../connect.js"
import { getUserDataFromToken } from "../utils/auth.js"
import md5 from "md5"

function isPasswordSecure(password) {
  // Sprawdź, czy hasło ma co najmniej 8 znaków
  if (password.length < 8) {
    return false;
  }

  // Sprawdź, czy hasło ma maksymalnie 50 znaków
  if (password.length > 50) {
    return false;
  }

  // Sprawdź, czy hasło zawiera co najmniej jedną wielką literę
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Sprawdź, czy hasło zawiera co najmniej jedną małą literę
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Sprawdź, czy hasło zawiera co najmniej jedną cyfrę
  if (!/\d/.test(password)) {
    return false;
  }

  // Sprawdź, czy hasło zawiera co najmniej jeden znak specjalny
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  // Jeśli przeszło wszystkie powyższe sprawdzenia, hasło jest uznane za bezpieczne
  return true;
}

function generateSalt() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let salt = ""
  for (let i = 0; i < 16; i++) {
    salt += characters[Math.floor(Math.random() * characters.length)]
  }
  return salt
}

export const getCurrentAccount = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  db.query(`SELECT * FROM accounts WHERE id=? `, [userData.id], (err, data) => {
    if (err) return res.status(500).json(err)

    const { password, salt, password_recovery, invitation, premium, ...others } = data[0]
    const updatedOthers = { ...others, premium: JSON.parse(data[0].premium) };
    
    return res.status(200).json(updatedOthers)
  })
}

export const getNotifications = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  const selectNotifications = `
    SELECT
      notifications.id,
      notifications.title,
      notifications.description,
      notifications.created_date,
      notifications.status,
      accounts.username,
      COALESCE(characters.charactername, '') AS charactername
    FROM
      notifications
      JOIN accounts ON accounts.id = notifications.account_id
      LEFT JOIN characters ON characters.id = notifications.character_id
    WHERE
      notifications.account_id=? AND status < 2
  `

  db.query(selectNotifications, [userData.id], (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(data)
  })
}

export const changeNotification = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  const status = req.body.status
  const id = req.body.id

  db.query(`UPDATE notifications SET status=? WHERE id=? AND account_id=?`, [status, id, userData.id], (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(id)
  })
}

export const changePassword = async (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const { oldPassword, password, confirmPassword } = req.body

  const accountData = await new Promise((resolve, reject) => {
    db.query('SELECT password, salt FROM accounts WHERE id=?', [userData.id], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  const accountSalt = accountData[0].salt
  const accountEncryptedPassword = md5(md5(oldPassword).toLowerCase() + accountSalt).toLowerCase()
  if (accountEncryptedPassword !== accountData[0].password) {
    return res.status(400).json("Twoje stare hasło jest nieprawidłowe.")
  }

  if (!isPasswordSecure(password)) {
    return res.status(400).json("Hasło musi być bezpieczne: co najmniej 8 znaków, jedna wielka litera, jedna mała litera, jedna cyfra i jeden znak specjalny.");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Hasła nie są identyczne.")
  }

  const salt = generateSalt()
  const encryptedPassword = md5(md5(password).toLowerCase() + salt).toLowerCase()

  db.query("UPDATE accounts SET password=?, salt=? WHERE id=?", [encryptedPassword, salt, userData.id], function (err, data) {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json("Hasło zostało pomyślnie zmienione")
  })
}

export const getRecentLogins = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  db.query("SELECT * FROM recent_logins WHERE account=?", [userData.id], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd z serverem.")
    }

    return res.status(200).json(result)
  })
}
