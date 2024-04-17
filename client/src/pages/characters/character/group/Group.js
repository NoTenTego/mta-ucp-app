import React, { useEffect, useRef, useState } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import Stats from "./Stats"
import { motion } from "framer-motion"
import Employees from "./Employees"
import Ranks from "./Ranks"
import Permissions from "./Permissions"
import { makeRequest } from "../../../../axios"
import Notification from "../../../../components/Notification"

function Group({ theme, business }) {
  const [data, setData] = useState(null)

  const notification = useRef(Notification)

  const fetchGroupData = async () => {
    try {
      const response = await makeRequest.post("groups/getGroupData", { id: business.id })
      if (response.data) {
        setData(response.data)
      }
    } catch (error) {
      setData(false)
    }
  }

  const sendNotification = (type, title, desc) => {
    notification.current.handleNotification(type, title, desc)
  }

  useEffect(() => {
    fetchGroupData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!data) {
    return
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
      <Notification ref={notification}/>
      <Grid container spacing={3}>
        <Grid sx={{ flexGrow: 1 }}>
          <Stats data={business} />
        </Grid>
        <Grid sx={{ flexGrow: 1 }}>
          <Employees theme={theme} businessId={business.id} data={data.employees} sendNotification={sendNotification} />
        </Grid>
        <Grid>
          <Permissions businessId={business.id} items={JSON.parse(business.permissions)} sendNotification={sendNotification} />
        </Grid>
        <Grid sx={{ flexGrow: 10 }}>
          <Ranks theme={theme} data={data.businessRanks} businessId={business.id} sendNotification={sendNotification} />
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default Group
