import { createContext, useEffect, useState } from "react"
import { makeRequest } from "../axios"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

function areObjectsEqual(obj1, obj2) {
  obj1 = JSON.stringify(obj1)
  obj2 = JSON.stringify(obj2)

  if (obj1 === obj2) {
    return true
  } else {
    return false
  }
}

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
  const [rank, setRank] = useState(0)

  const login = async (inputs) => {
    const res = await makeRequest.post("auth/login", inputs)
    setCurrentUser(res.data)
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser))

    currentUser && (currentUser.admin_level > 0 || currentUser.support_level > 0) ? setRank(1) : setRank(0)
  }, [currentUser])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await makeRequest.post("accounts/current")
        if (!areObjectsEqual(currentUser, res.data)) {
          await makeRequest.post("auth/logout")
          setCurrentUser(null)
          localStorage.clear()
          navigate("/")
        }
      } catch (error) {
        console.error(error)
        setCurrentUser(null)
      }
    }

    const fetchTokens = async () => {
      try {
        const response = await makeRequest.post("token/getTokens")
        if (!response?.data && currentUser) {
          await makeRequest.post("auth/logout")
          setCurrentUser(null)
          localStorage.clear()
          navigate("/")
        } else if (response?.data && currentUser) {
          fetchData()
        }
      } catch (error) {
        console.error(error)
        setCurrentUser(null)
      }
    }

    const intervalId = setInterval(fetchTokens, 500)
    return () => clearInterval(intervalId)
  }, [currentUser, navigate])

  return <AuthContext.Provider value={{ currentUser, login, rank }}>{children}</AuthContext.Provider>
}
