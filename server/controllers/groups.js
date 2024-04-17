import { db } from "../connect.js"
import { getUserDataFromToken } from "../utils/auth.js"

export const getCharacterGroups = async (req, res) => {
  const token = req.cookies.accessToken
  const userData = getUserDataFromToken(token)
  const businessId = req.body.id

  const selectCharactersWithBusiness = `
  SELECT characters.id, characters.charactername, characters.last_active AS lastActive, found.business, found.rank, businessRanks.name AS rankName, accounts.username
  FROM characters
  CROSS JOIN JSON_TABLE(
    characters.business,
    '$[*]' COLUMNS (
      business INT PATH '$.business',
      \`rank\` INT PATH '$.rank'
    )
  ) AS found
  LEFT JOIN business_ranks AS businessRanks ON businessRanks.id = found.rank
  LEFT JOIN accounts ON accounts.id = characters.account
  WHERE found.business = ?`

  let employees = await new Promise((resolve, reject) => {
    db.query(selectCharactersWithBusiness, [businessId], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  employees.forEach((item) => {
    if (item.rankName === null) {
      item.rank = ""
    }
  })

  let businessRanks = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM business_ranks WHERE business_id = ?`, [businessId], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  businessRanks = businessRanks.map((rank) => ({
    id: rank.id,
    business_id: rank.business_id,
    name: rank.name,
    payday: rank.payday,
    permissions: JSON.parse(rank.permissions),
  }))

  const data = {
    employees,
    businessRanks,
  }

  return res.status(200).json(data)
}

export const makeNewRank = async (req, res) => {
  const businessId = req.body.businessId
  const name = req.body.name
  const payday = req.body.payday

  if (!name || name.length < 1) {
    return res.status(500).json("Nazwa jest zbyt krótka.")
  }

  if (!Number(payday)) {
    return res.status(500).json("Wypłata musi być liczbą.")
  }

  if (payday < 500 || payday > 1250) {
    return res.status(500).json("Zakres wypłaty: $500 - $1250")
  }

  const selectBusinessPermissions = `SELECT permissions FROM businesses WHERE id=?`

  let businessPermissions = await new Promise((resolve, reject) => {
    db.query(selectBusinessPermissions, [businessId], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  businessPermissions = JSON.parse(businessPermissions[0].permissions)

  const insertNewRank = `INSERT INTO business_ranks SET business_id=?, name=?, payday=?, permissions=?`

  db.query(insertNewRank, [businessId, name, payday, JSON.stringify(businessPermissions)], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json({ businessPermissions, insertId: result.insertId })
  })
}

export const editRank = (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const payday = req.body.payday

  if (!name || name.length < 1) {
    return res.status(500).json("Nazwa jest zbyt krótka.")
  }

  if (!Number(payday)) {
    return res.status(500).json("Wypłata musi być liczbą.")
  }

  if (payday < 500 || payday > 1250) {
    return res.status(500).json("Zakres wypłaty: $500 - $1250")
  }

  const editRank = `UPDATE business_ranks SET name=?, payday=? WHERE id=?`

  db.query(editRank, [name, payday, id], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json("Pomyślnie edytowano range.")
  })
}

export const deleteRank = (req, res) => {
  const id = req.body.id

  const deleteRank = `DELETE FROM business_ranks WHERE id=?`

  db.query(deleteRank, [id], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json("Pomyślnie usunięto range.")
  })
}

export const updateRankPermissions = async (req, res) => {
  const businessId = req.body.businessId
  const permissions = req.body.permissions
  const rankId = req.body.rankId

  const selectBusinessPermissions = `SELECT permissions FROM businesses WHERE id=?`

  let businessPermissions = await new Promise((resolve, reject) => {
    db.query(selectBusinessPermissions, [businessId], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  businessPermissions = JSON.parse(businessPermissions[0].permissions)

  const newPermissions = businessPermissions.map((permission) => {
    const foundPermission = permissions.find((item) => permission.id === item.id && permission.access === true)

    return {
      ...permission,
      used: foundPermission ? true : false,
    }
  })

  const updateRankPermissions = `UPDATE business_ranks SET permissions=? WHERE id=?`

  db.query(updateRankPermissions, [JSON.stringify(newPermissions), rankId], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(newPermissions)
  })
}

export const editPermission = (req, res) => {
  const businessId = req.body.businessId
  const permissionId = req.body.permissionId
  const access = req.body.access

  const editPermissionQuery = `
    UPDATE businesses
    SET permissions = JSON_SET(permissions, CONCAT('$[', ?, '].access'), ?)
    WHERE id = ?;
  `

  db.query(editPermissionQuery, [permissionId - 1, access, businessId], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json(access)
  })
}

export const editEmployee = async (req, res) => {
  const businessId = req.body.businessId
  let rank = req.body.rank
  const employeeId = req.body.employeeId

  const editPermissionQuery = `
      UPDATE characters
      SET business = JSON_SET(business, CONCAT('$[', ?, '].rank'), ?)
      WHERE id = ?;
    `

  if (rank.length === 0) {
    db.query(editPermissionQuery, [businessId - 1, '', employeeId], (err, result) => {
      if (err) {
        return res.status(500).json("Wystąpił błąd serwera.")
      }

      return res.status(200).json({ rank, rankName: '' })
    })

    return
  }

  if (!Number(rank)) {
    return res.status(500).json("Nie odnaleziono rangi o podanym ID dla twojego biznesu.")
  }

  const selectRankName = `SELECT name FROM business_ranks WHERE business_id = ? AND id = ?`

  const rankNameResult = await new Promise((resolve, reject) => {
    db.query(selectRankName, [businessId, rank], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  if (rankNameResult.length === 0 || !rankNameResult[0].name) {
    return res.status(500).json("Nie odnaleziono rangi o podanym ID dla twojego biznesu.")
  }

  db.query(editPermissionQuery, [businessId - 1, rank, employeeId], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json({ rank, rankName: rankNameResult[0].name })
  })
}

export const deleteEmployee = async (req, res) => {
  const characterId = req.body.characterId
  const businessId = req.body.businessId

  const characterBusinesses = `SELECT business FROM characters WHERE id=?`

  let businesses = await new Promise((resolve, reject) => {
    db.query(characterBusinesses, [characterId], (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })

  businesses = JSON.parse(businesses[0]["business"])
  businesses = businesses.filter((element) => element.business !== businessId)
  businesses = JSON.stringify(businesses)

  const characterNewBusinesses = `UPDATE characters SET business=? WHERE id=?`

  db.query(characterNewBusinesses, [businesses, characterId], (err, result) => {
    if (err) {
      return res.status(500).json("Wystąpił błąd serwera.")
    }

    return res.status(200).json("Pomyślnie zwolniono pracownika.")
  })
}
