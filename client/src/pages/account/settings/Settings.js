import { motion } from "framer-motion"
import React, { useRef } from "react"
import { Tab } from "@mui/material"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import Box from "@mui/material/Box"
import Account from "./Account"
import Security from "./Security"
import Notification from "../../../components/Notification"

//salt,

/*const accountInfo = {
  username: "NoTetnTego",
  email: "noTetnTego@gmail.com",
  registerdate: new Date(),
  lastlogin: new Date(),
  credits: 52,
  hours: 3052,
  premium: true,
}*/

function Settings({ theme }) {
  const [value, setValue] = React.useState("1")
  const notification = useRef()

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Notification ref={notification} />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            <Tab label='Konto' value='1' />
            <Tab label='Bezpieczeństwo' value='2' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Account theme={theme} sendNotification={sendNotification} />
        </TabPanel>
        <TabPanel value='2' >
          <Security sendNotification={sendNotification}/>
        </TabPanel>
      </TabContext>
    </motion.div>
  )
}

export default Settings
