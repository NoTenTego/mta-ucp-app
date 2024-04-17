import { db } from "../connect.js"
import { getUserDataFromToken, hasPermission } from "../utils/auth.js"

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let randomString = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }

  return randomString
}

export const getAllCharacters = (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)

  db.query(`SELECT * FROM characters WHERE account=?`, [userData.id], (err, data) => {
    if (err) return res.status(500).json(err)

    return res.status(200).json(data)
  })
}

export const getCharacterData = async (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const characterId = req.body.id

  const characterData = await new Promise((resolve, reject) => {
    db.query(
      `
    SELECT
    characters.charactername, characters.active, characters.gender, characters.money, characters.age, characters.skincolor, characters.bankmoney, characters.account, characters.id, characters.creation_date, characters.gym_stats, characters.hours, characters.business
    FROM characters
    WHERE characters.id=?
  `,
      [characterId],
      async (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      }
    )
  })

  if (characterData.length === 0) {
    return res.status(404).json("Postać nie została znaleziona.")
  }

  if (userData.id !== characterData[0]["account"] && !hasPermission(token, 1, 1)) {
    return res.status(403).json("Brak dostępu.")
  }

  let businesses = JSON.parse(characterData[0]["business"])
  businesses = businesses ? businesses : []

  const businessesNames = await Promise.all(
    businesses.map(async (businessObject) => {
      try {
        const result = await new Promise((resolve, reject) => {
          db.query(`SELECT businesses.*, characters.charactername AS ownerName FROM businesses LEFT JOIN characters ON characters.id = businesses.owner WHERE businesses.id=?`, [businessObject.business], (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        })

        return result[0] || null
      } catch (error) {
        console.error(error)
        return null
      }
    })
  )

  const items = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM items WHERE owner=?`, [characterId], async (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  const vehicles = await new Promise((resolve, reject) => {
    db.query(
      `
    SELECT
    vehlib.mta_model, vehicles.odometer, vehlib.brand, vehlib.model
    FROM vehicles
    LEFT JOIN vehlib ON vehicles.vehlib = vehlib.id
    WHERE owner=?
  `,
      [characterId],
      async (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      }
    )
  })

  const interiors = await new Promise((resolve, reject) => {
    db.query(
      `
    SELECT
      id, name, description
    FROM interiors
    WHERE owner=?
  `,
      [characterId],
      async (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      }
    )
  })

  const characterResponse = {
    characters: characterData[0],
    businesses: businessesNames,
    items,
    vehicles,
    interiors,
  }

  return res.status(200).json(characterResponse)
}

function checkPersonalData(fullName) {
  if (!fullName) {
    sendNotification("error", "Dane osobowe", `Dane nie są uzupełnione.`)
    return false
  }

  if (fullName.length > 50) {
    sendNotification("error", "Dane osobowe", `Imię i nazwisko mają więcej niż 50 znaków.`)
    return false
  }

  const nameParts = fullName.split(" ")
  if (nameParts.length !== 2) {
    sendNotification("error", "Dane osobowe", `Dane osobowe muszą składać się dwóch części - Imię i Nazwisko`)
    return false
  }

  const firstName = nameParts[0]
  const lastName = nameParts[1]
  const startsWithUppercase = /^[A-Z]/
  if (!startsWithUppercase.test(firstName) || !startsWithUppercase.test(lastName)) {
    sendNotification("error", "Dane osobowe", `Imię lub nazwisko nie zaczynają się od dużej litery.`)
    return false
  }

  if (firstName.length < 3 || lastName.length < 3) {
    sendNotification("error", "Dane osobowe", `Imię lub nazwisko jest zbyt krótkie`)
    return false
  }

  const specialCharacters = /[^A-Za-z0-9'"\s]/
  if (specialCharacters.test(firstName) || specialCharacters.test(lastName)) {
    sendNotification("error", "Dane osobowe", `Imię lub nazwisko zawiera znaki specjalne.`)
    return false
  }
  return true
}

const CharacterSpawnpoints = [
  { x: 2177.5078125, y: -1743.525390625, z: 13.546875 },
  { x: 1762.400390625, y: -1860.7197265625, z: 13.578392982483 },
  { x: 806.0712890625, y: -1334.9111328125, z: 13.546875 },
]

const vehiclesSpawnPoints = {
  0: [[824.5166015625, -1314.9892578125, 13.546875, 0]],
  1: [[824.5166015625, -1314.9892578125, 13.546875, 0]],
  2: [[1496.8330078125, -1724.5966796875, 13.5546875, 0]],
}

export const getFreeVehicles = (req, res) => {
  db.query('SELECT * FROM vehlib WHERE free=1', [], (err, result) => {
    if (err) {
      return res.status(400).json('Wystąpił błąd w pobieraniu pojazdów.')
    }

    return res.status(200).json(result)
  })
}

function getRandomVehicleSpawn(index) {
  const spawnPointArray = vehiclesSpawnPoints[index]

  if (spawnPointArray && spawnPointArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * spawnPointArray.length)
    return spawnPointArray[randomIndex]
  } else {
    return [824.5166015625, -1314.9892578125, 13.546875]
  }
}

export const newCharacter = async (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const characterData = req.body.characterData

  const actualCharacters = await new Promise((resolve, reject) => {
    db.query('SELECT id FROM characters WHERE account=?', [userData.id], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  if (actualCharacters.length > 2) {
    return res.status(400).json("Możesz posiadać maksymalnie 3 postacie.")
  }

  if (!checkPersonalData(characterData.name)) {
    return res.status(400).json("Nieprawidłowe dane personalne")
  }

  if (characterData.height < 100 || characterData.height > 210 || characterData.weight < 30 || characterData.weight > 150 || characterData.age < 16 || characterData.age > 100) {
    return res.status(400).json("Nieprawidłowy wzrost, waga lub wiek.")
  }

  if (
    characterData.strength < 0 ||
    characterData.strength > 100 ||
    characterData.stamina < 0 ||
    characterData.stamina > 100 ||
    characterData.endurance < 0 ||
    characterData.endurance > 100 ||
    characterData.wealth < 0 ||
    characterData.wealth > 100
  ) {
    return res.status(400).json("Nieprawidłowe statystyki postaci, dopuszczalny zakres: 0-100")
  }

  const characterName = characterData.name.replace(" ", "_")

  const checkQuery = "SELECT * FROM characters WHERE charactername=?"
  db.query(checkQuery, [characterName], (checkErr, checkData) => {
    if (checkErr) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }
    if (checkData.length > 0) {
      return res.status(400).json("Użytkownik o podanych danych osobowych już istnieje.")
    }

    const { skin, race, gender, age, height, weight, wealth } = characterData
    const fingerPrint = generateRandomString(32)
    const characterClass = characterData["class"]

    let startMoney = 1000
    if (characterClass === 0) {
      startMoney = 500
    } else if (characterClass === 1) {
      startMoney = 2000
    } else {
      startMoney = 1000
    }
    startMoney = startMoney + wealth * 50

    const dateTime = new Date(characterData["birthday"])
    const day = dateTime.getDate()
    const month = dateTime.getMonth() + 1

    const { x, y, z } = CharacterSpawnpoints[characterClass]

    const gymStats = JSON.stringify({ strength: characterData.strength, stamina: characterData.stamina, endurance: characterData.endurance })

    const characterQuery = `INSERT INTO characters SET charactername=?, account=?, class=?, skin=?, gender=?, age=?, skincolor=?, weight=?, height=?, fingerprint=?, bankmoney=?, day=?, month=?, gym_stats=?, x=?, y=?, z=?`
    db.query(characterQuery, [characterName, userData.id, characterClass, skin, gender, age, race, weight, height, fingerPrint, startMoney, day, month, gymStats, x, y, z], function (err, result) {
      if (err) {
        return res.status(400).json(err)
      }

      if (result.insertId) {
        /*const [x, y, z, rotz] = getRandomVehicleSpawn(characterClass);
        const vehicleQuery = `INSERT INTO pojazdy SET type=?, owner=?, itemID=?, itemValue=?`
        db.query(vehicleQuery, [1, result.insertId, 16, skin], function (err, result) {
          if (err) {
            return res.status(500).json(err)
          }
  
        })*/

        return res.status(200).json("Pomyślnie stworzono postać.")
      }
    })
  })
}
