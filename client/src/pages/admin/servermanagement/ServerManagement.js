import { Grid } from "@mui/material"
import { motion } from "framer-motion"
import React, { useRef } from "react"
import Notification from "../../../components/Notification"
import Jobs from "./Jobs"
import Fuel from "./Fuel"
import Corners from "./Corners"
import Factions from "./Factions"
import Itemlist from "./Itemlist"

function ServerManagement({ theme }) {
  const notification = useRef()

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
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
      <Grid container gap={4} mb={3}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Jobs sendNotification={sendNotification} />
        </Grid>
        <Grid sx={{ flexGrow: 5, overflowX: "auto" }}>
          <Corners sendNotification={sendNotification} theme={theme} />
        </Grid>
        <Grid item sx={{ flexGrow: 1 }}>
          <Fuel sendNotification={sendNotification} />
        </Grid>
        <Grid item sx={{ flexGrow: 2.4 }}>
          <Factions sendNotification={sendNotification} />
        </Grid>
        <Grid sx={{ flexGrow: 5, overflowX: "auto" }}>
          <Itemlist sendNotification={sendNotification} theme={theme} />
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default ServerManagement
