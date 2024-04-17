/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"
import { fileNames, maleSkins, femaleSkins } from "./Data"
import { Button, Card, CardMedia, Stack, useMediaQuery, Divider, Skeleton } from "@mui/material"
import { motion } from "framer-motion"
import Grid from "@mui/material/Unstable_Grid2"

function Skin({ characterData, setCharacterData, setActiveStep, sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:830px)")

  useEffect(() => {
    setCharacterData((prevData) => ({
      ...prevData,
      skin: null,
    }))
  }, [characterData["gender"]])

  function checkFileExistence(fileNames, skinIds) {
    return skinIds.filter((skinId) => fileNames.includes(`${skinId}.webp`)).map((skinId) => `${skinId}.webp`)
  }

  const maleSkinFileNames = checkFileExistence(fileNames, maleSkins)
  const femaleSkinFileNames = checkFileExistence(fileNames, femaleSkins)
  const allSkins = [maleSkinFileNames, femaleSkinFileNames]

  const validateAllData = () => {
    if (characterData["skin"] === null) {
      sendNotification("error", "Ubranie", "Musisz wybrać ubranie żeby przejść dalej.")
      return false
    }

    setActiveStep(2)
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={1} sx={{ height: "520px", overflowY: "auto", padding: "1rem" }}>
        {allSkins[characterData["gender"]].map((skin, index) => (
          <Grid key={index} sx={{ flexGrow: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                setCharacterData((prevData) => ({
                  ...prevData,
                  skin: skin.replace(".webp", ""),
                }))
              }}>
              <Card
                elevation={0}
                onClick={() => {
                  setCharacterData((prevData) => ({
                    ...prevData,
                    skin: skin.replace(".webp", ""),
                  }))
                }}>
                <CardMedia
                  sx={{
                    transition: "all 0.3s",
                    cursor: characterData["skin"] === skin.replace(".webp", "") ? "default" : "pointer",
                    backgroundColor: characterData["skin"] === skin.replace(".webp", "") ? "primary.main" : "rgba(0, 0, 0, 0.2)",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}>
                    <img style={{ height: isSmallScreen ? "100px" : "150px" }} src={require(`../../../assets/images/skins/${skin}`)} alt={skin} loading="lazy"></img>
                </CardMedia>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Divider/>
      <Stack direction={isSmallScreen ? "column" : "row"} spacing={1} justifyContent={"flex-end"}>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => {
            setActiveStep(0)
          }}>
          Zmień dane personalne
        </Button>
        <Button variant='contained' color='primary' onClick={validateAllData} disabled={characterData["skin"] === null}>
          Zatwierdź
        </Button>
      </Stack>
    </Stack>
  )
}

export default Skin
