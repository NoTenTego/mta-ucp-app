import React from "react"
import { motion } from "framer-motion"
import Grid from "@mui/material/Unstable_Grid2"
import Statistics from "./Statistics"
import Players from "./Players"
import TopPlayers from "./TopPlayers"
import ServerStatus from "./ServerStatus"

function Dashboard({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Grid container spacing={2}>
        <Grid sx={{ flexGrow: 1 }}>
          <Statistics />
        </Grid>
        <Grid sx={{ flexGrow: 1 }}>
          <ServerStatus />
        </Grid>
        <Grid sx={{ flexGrow: 1 }}>
          <Players />
        </Grid>
        <Grid sx={{ flexGrow: 1.66 }}>
          <TopPlayers />
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default Dashboard
