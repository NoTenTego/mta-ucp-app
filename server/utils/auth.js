import jwt from "jsonwebtoken"

export const getUserDataFromToken = (token) => {
  const secretKey = process.env.JWT_SECRET_KEY

  try {
    const decodedData = jwt.verify(token, secretKey)
    return decodedData
  } catch (error) {
    return null
  }
}

export const hasPermission = (token, admin, support) => {
  const userData = getUserDataFromToken(token)

  if (userData.permissions.admin >= admin) {
    return true;
  }

  if (support !== undefined && userData.permissions.support >= support) {
    return true;
  }

  return false;
}