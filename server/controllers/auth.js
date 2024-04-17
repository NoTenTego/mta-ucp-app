import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import md5 from "md5"
import validator from "validator"
import nodemailer from "nodemailer"
import useragent from "useragent"

const beta = true

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

function generateRandomNumbers(length) {
  const characters = "0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

function isDateWithinOneDay(date) {
  const currentDate = new Date()
  const oneDayInMillis = 24 * 60 * 60 * 1000

  const timeDifference = Math.abs(currentDate - date)

  return timeDifference < oneDayInMillis
}

const transporter = nodemailer.createTransport({
  host: "serwer2305075.home.pl",
  port: 465,
  secure: true,
  auth: {
    user: "ekipa@avalon-rp.pl",
    pass: "sd!e47s37#5b36Kl",
  },
})

export const login = async (req, res) => {
  const userAgentString = req.headers["user-agent"]
  const userAgent = useragent.parse(userAgentString)

  const browserName = userAgent.family
  const platform = userAgent.os.family

  const data = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM accounts WHERE username = ?", [req.body.username], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  if (!data.length > 0) {
    return res.status(404).json("Nieprawidłowe dane uwierzytelniające.")
  }

  const encryptionRule = data[0].salt
  const encryptedPassword = md5(md5(req.body.password).toLowerCase() + encryptionRule).toLowerCase()

  if (encryptedPassword !== data[0].password) {
    return res.status(401).json("Nieprawidłowe dane uwierzytelniające.")
  }

  db.query("INSERT INTO recent_logins (account, browser, platform, ip_adress) VALUES (?, ?, ?, ?)", [data[0].id, browserName, platform, req.ip], (err) => {
    if (err) {
      return res.status(500).json("Wystąpił problem z logowaniem. [001]")
    }
  })

  const token = jwt.sign({ id: data[0].id, username: data[0].username, permissions: { admin: data[0].admin_level, support: data[0].support_level, vct_level: data[0].vct_level } }, process.env.JWT_SECRET_KEY, {
    expiresIn: req.body.rememberMe ? "2592000000" : "259200000",
  })
  const csrfToken = jwt.sign({ id: data[0].id }, process.env.CSRF_SECRET_KEY, {
    expiresIn: req.body.rememberMe ? "2592000000" : "259200000",
  })

  const { password, salt, password_recovery, invitation, premium, ...others } = data[0]
  const updatedOthers = { ...others, premium: JSON.parse(data[0].premium) };

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .cookie("csrfToken", csrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json(updatedOthers)
}

export const logout = (req, res) => {
  res.clearCookie("accessToken").clearCookie("csrfToken")

  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .clearCookie("csrfToken", {
      secure: true,
      sameSite: "none",
    })

    .status(200)
    .json("User has been logged out.")
}

export const register = async (req, res) => {
  const { username, email, password, confirmPassword, betaCode } = req.body

  if (beta) {
    const foundBetatestCode = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM betatest_codes WHERE value=?`, [betaCode], (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    })

    if (foundBetatestCode.length === 0) {
      return res.status(400).json("Nieprawidłowy kod zaproszeniowy.")
    }
  }

  if (username.length < 3 || username.length > 25) {
    return res.status(400).json("Nazwa użytkownika musi mieć od 3 do 20 znaków.")
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json("Nieprawidłowy adres email.")
  }

  if (!isPasswordSecure(password)) {
    return res.status(400).json("Hasło musi być bezpieczne: co najmniej 8 znaków, jedna wielka litera, jedna mała litera, jedna cyfra i jeden znak specjalny.");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Potwierdzenie hasła nie pasuje.")
  }

  const foundAccount = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM accounts WHERE username = ? OR email = ?", [username, email], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  if (foundAccount.length > 0) {
    return res.status(400).json("Użytkownik o podanym loginie lub adresie email już istnieje.")
  }

  const registrationCode = generateRandomNumbers(6)
  const mailOptions = {
    from: "ekipa@avalon-rp.pl",
    to: email,
    subject: "Witaj w naszej społeczności!",
    html: `
        <html>
          <body>
            <p>Cześć ${username}!</p>
            <p>Dziękujemy za rejestrację na naszej platformie. Jesteśmy podekscytowani, że do nas dołączyłeś.</p>
            <p>Twój kod do rejestracji konta: <h3>${registrationCode}</h3></p>
            <p>Kod będzie ważny 1 dzień.</p>
            <p>Aby jeszcze bardziej zanurzyć się w naszej społeczności, zapraszamy Cię także na nasz serwer Discord, gdzie możesz poznać innych użytkowników, uzyskać wsparcie i dzielić się swoimi pomysłami!</p>
            <p><a href="https://discord.gg/z2h7GTU7jN">Dołącz do naszego serwera Discord</a></p>
            <p>Pozdrawiamy!</p>
            <p>Ekipa Avalon RP</p>
          </body>
        </html>
      `,
  }

  const salt = generateSalt()
  const encryptedPassword = md5(md5(password).toLowerCase() + salt).toLowerCase()

  const insertQuery = "INSERT INTO accounts (username, password, salt, email, invitation, beta, premium) VALUES (?, ?, ?, ?, ?, ?, ?)"
  const accountCreated = await new Promise((resolve, reject) => {
    db.query(
      insertQuery,
      [
        username,
        encryptedPassword,
        salt,
        email,
        JSON.stringify({ code: registrationCode, date: new Date() }),
        beta,
        JSON.stringify({
          points: 0,
          active_until: 1710500073,
        }),
      ],
      (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      }
    )
  })

  if (accountCreated) {
    transporter.sendMail(mailOptions, (emailErr, emailInfo) => {
      if (emailErr) {
        console.error("Błąd wysyłania wiadomości email:", emailErr)
        return res.status(500).json("Wystąpił błąd serwera podczas rejestracji.")
      }
    })

    db.query(`DELETE FROM betatest_codes WHERE value=?`, [betaCode], (err) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera podczas usuwania kodu beta.")
      }
    })

    db.query(
      `INSERT INTO notifications SET account_id=?, title=?, description=?`,
      [accountCreated.insertId, "Witaj!", "Wspaniale, że dołączyłeś do naszego grona! Nie zapomnij, że zakładając konto, masz możliwość logowania się zarówno w grze, jak i na forum!"],
      (err) => {
        if (err) {
          return res.status(500).json("Wystąpił błąd serwera podczas tworzenia powiadomienia.")
        }
      }
    )

    return res.status(201).json("Rejestracja zakończona pomyślnie. Kod potwierdzający konto został wysłany na podany adres email.")
  }
}

export const activateAccount = (req, res) => {
  const { username, confirmationCode } = req.body
  if (!username || !confirmationCode) {
    return res.status(400).json("Wysłano nieprawidłowe dane.")
  }

  db.query("SELECT invitation FROM accounts WHERE username = ?", [username], function (err, data) {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    const invitation = JSON.parse(data[0].invitation)

    if (invitation.code === confirmationCode && isDateWithinOneDay(new Date(invitation.date))) {
      db.query("UPDATE accounts SET activated=1, invitation=null WHERE username = ?", [username], function (err, data) {
        if (err) {
          return res.status(500).json("Wystąpił błąd serwera.")
        }

        return res.status(201).json("Konto zostało pomyślnie potwierdzone.")
      })
    } else {
      return res.status(400).json("Kod jest przestarzały lub nieprawidłowy.")
    }
  })
}

export const resendConfirmationCode = (req, res) => {
  const { username } = req.body

  db.query("SELECT * FROM accounts WHERE username = ?", [username], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    if (data.length === 0) {
      return res.status(404).json("Nie znaleziono konta o podanym loginie.")
    }

    if (data[0].activated === 1) {
      return res.status(400).json("Twoje konto jest już potwierdzone.")
    }

    const registrationCode = generateRandomNumbers(6)
    const mailOptions = {
      from: "ekipa@avalon-rp.pl",
      to: data[0].email,
      subject: "Potwierdzenie konta.",
      html: `
        <html>
          <body>
            <p>Cześć ${username}!</p>
            <p>Otrzymaliśmy prośbę o przypomnienie kodu potwierdzającego.</p>
            <p>Oto on: <h3>${registrationCode}</h3></p>
            <p>Kod będzie ważny 1 dzień.</p>
            <p>Aby jeszcze bardziej zanurzyć się w naszej społeczności, zapraszamy Cię także na nasz serwer Discord, gdzie możesz poznać innych użytkowników, uzyskać wsparcie i dzielić się swoimi pomysłami!</p>
            <p><a href="https://discord.gg/z2h7GTU7jN">Dołącz do naszego serwera Discord</a></p>
            <p>Pozdrawiamy!</p>
            <p>Ekipa Avalon RP</p>
          </body>
        </html>
      `,
    }

    db.query("UPDATE accounts SET invitation=? WHERE username=?", [JSON.stringify({ code: registrationCode, date: new Date() }), username], (err, result) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera podczas rejestracji.")
      }

      return res.status(201).json("Kod potwierdzający został wysłany na adres email przypisany do konta.")
    })

    transporter.sendMail(mailOptions, (emailErr, emailInfo) => {
      if (emailErr) {
        console.error("Błąd wysyłania wiadomości email:", emailErr)
        return res.status(500).json("Wystąpił błąd serwera podczas rejestracji.")
      }
    })
  })
}

export const recoveryPassword = (req, res) => {
  const { email } = req.body

  db.query("SELECT * FROM accounts WHERE email = ?", [email], (err, data) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    if (data.length === 0) {
      return res.status(404).json("Nie znaleziono konta o podanym adresie email.")
    }

    const recoveryCode = generateRandomNumbers(6)
    const mailOptions = {
      from: "ekipa@avalon-rp.pl",
      to: data[0].email,
      subject: "Odzyskiwanie hasła.",
      html: `
        <html>
          <body>
            <p>Cześć ${data[0].username}!</p>
            <p>Otrzymaliśmy prośbę o odzyskanie hasła. Na potrzebę tego procesu wygenerowaliśmy kod, który musisz wpisać w UCP.</p>
            <p>Oto on: <h3>${recoveryCode}</h3></p>
            <p>Kod będzie ważny 1 dzień.</p>
            <p>Aby jeszcze bardziej zanurzyć się w naszej społeczności, zapraszamy Cię także na nasz serwer Discord, gdzie możesz poznać innych użytkowników, uzyskać wsparcie i dzielić się swoimi pomysłami!</p>
            <p><a href="https://discord.gg/z2h7GTU7jN">Dołącz do naszego serwera Discord</a></p>
            <p>Pozdrawiamy!</p>
            <p>Ekipa Avalon RP</p>
          </body>
        </html>
      `,
    }

    db.query("UPDATE accounts SET password_recovery=? WHERE email=?", [JSON.stringify({ code: recoveryCode, date: new Date() }), data[0].email], (err, result) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera podczas rejestracji.")
      }

      return res.status(201).json("Kod odzyskiwania został wysłany na adres email.")
    })

    transporter.sendMail(mailOptions, (emailErr, emailInfo) => {
      if (emailErr) {
        console.error("Błąd wysyłania wiadomości email:", emailErr)
        return res.status(500).json("Wystąpił błąd serwera podczas rejestracji.")
      }
    })
  })
}

export const changePassword = (req, res) => {
  const { email, recoveryCode, password, confirmPassword } = req.body

  if (!isPasswordSecure(password)) {
    return res.status(400).json("Hasło musi być bezpieczne: co najmniej 8 znaków, jedna wielka litera, jedna mała litera, jedna cyfra i jeden znak specjalny.");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Potwierdzenie hasła nie pasuje.")
  }

  if (!recoveryCode || !email) {
    return res.status(400).json("Brakuje kodu odzyskiwania lub adresu email.")
  }

  db.query("SELECT password_recovery FROM accounts WHERE email = ?", [email], function (err, data) {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    const password_recovery = JSON.parse(data[0].password_recovery)

    if (password_recovery.code === recoveryCode && isDateWithinOneDay(new Date(password_recovery.date))) {
      const salt = generateSalt()
      const encryptedPassword = md5(md5(password).toLowerCase() + salt).toLowerCase()

      db.query("UPDATE accounts SET password=?, salt=?, password_recovery=null WHERE email = ?", [encryptedPassword, salt, email], function (err, data) {
        if (err) {
          return res.status(500).json("Wystąpił błąd serwera.")
        }

        return res.status(201).json("Hasło zostało pomyślnie zmienione")
      })
    } else {
      return res.status(400).json("Kod jest przestarzały lub nieprawidłowy.")
    }
  })
}
