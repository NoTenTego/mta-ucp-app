import React, { useState, useRef } from "react"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import Accounts from "./Accounts"
import Characters from "./Characters"
import Notification from "../../../components/Notification"

function PlayersManagement({ theme }) {
  const notification = useRef()
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Notification ref={notification} />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", margin: 0 }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            <Tab label='Konta' value='1' />
            <Tab label='Postacie' value='2' />
            <Tab label='Postacie w grze' value='3' />
            <Tab label='Grupy' value='4' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Accounts sendNotification={sendNotification} />
        </TabPanel>
        <TabPanel value='2'>
          <Characters sendNotification={sendNotification} />
        </TabPanel>
        <TabPanel value='3'>Item Three</TabPanel>
        <TabPanel value='4'>Item Three</TabPanel>
      </TabContext>
    </Box>
  )
}

export default PlayersManagement
