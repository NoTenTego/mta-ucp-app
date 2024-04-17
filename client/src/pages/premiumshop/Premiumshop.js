import React from "react"
import Grid from "@mui/material/Unstable_Grid2"
import MultiActionAreaCard from "./MultiActionAreaCard"
import { premiumFunctions } from "./Data"
import { useMediaQuery, Alert } from "@mui/material"
import { motion } from "framer-motion"

function Premium() {
  const isSmallScreen = useMediaQuery("(max-width:800px)")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Alert severity="info">Ha! Mamy Cię! To nie jest sklep premium w którym musisz wydawać swoje ciężko zarobione pieniądze. Musisz za to spędzać swój cenny czas na naszym serwerze, aby zdobywać punkty premium :)) Możesz również zdobywać osiągnięcia za które otrzymujesz punkty. Wydawaj je do woli!</Alert>
      <Grid container spacing={3} mt={1}>
        {premiumFunctions.map((data, index) => {
          return (
            <Grid key={index} sx={{ flexGrow: 1, width: "350px", maxWidth: isSmallScreen ? null : "500px" }}>
              <MultiActionAreaCard imageSrc={data.imageSrc} headerName={data.headerName} description={data.description} price={data.price} />
            </Grid>
          )
        })}
      </Grid>
    </motion.div>
  )
}

export default Premium
