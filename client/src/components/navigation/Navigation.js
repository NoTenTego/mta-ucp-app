import { useEffect, useRef, useState } from "react"
import SideNavigation from "./SideNavigation"
import TopNavigation from "./TopNavigation"
import { makeRequest } from "../../axios"
import { AuthContext } from "../../context/AuthContext"

const Navigation = ({ isSmallScreen, theme, navigate, handleChangeTheme, setOpen }) => {
  const { currentUser } = useRef(AuthContext)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      const response = await makeRequest.get("/accounts/getNotifications")
      if (response.status === 200) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.log("Wystąpił błąd z pobieraniem powiadomień")
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchNotifications()
    }
  }, [navigate])

  return isSmallScreen ? (
    <SideNavigation theme={theme} handleChangeTheme={handleChangeTheme} notifications={notifications} setNotifications={setNotifications} setOpenLogin={setOpen} />
  ) : (
    <TopNavigation theme={theme} navigate={navigate} handleChangeTheme={handleChangeTheme} notifications={notifications} setNotifications={setNotifications} setOpen={setOpen} />
  )
}

export default Navigation
