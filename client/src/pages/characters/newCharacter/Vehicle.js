/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, useMediaQuery, Button, Card, CardMedia, Divider, Skeleton } from "@mui/material"
import React, { useEffect, useState } from "react"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { ReadTextField } from "../../../components/ReadTextField"
import { makeRequest } from "../../../axios"

function Vehicle({ characterData, setCharacterData, setActiveStep, sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:830px)")

  const [currentVehicle, setCurrentVehicle] = useState(0)
  const [vehicles, setVehicles] = useState([])

  const validateAllData = () => {
    if (characterData["vehicle"] === null) {
      sendNotification("error", "Pojazd startowy", "Musisz wybrać pojazd żeby przejść dalej.")
      return false
    }

    setCharacterData((prevData) => ({
      ...prevData,
      vehicle: vehicles[currentVehicle].mta_model
    }))

    setActiveStep(3)
  }

  const fetchFreeVehicles = async () => {
    try {
      const response = await makeRequest.get("characters/getFreeVehicles")
      if (response.status === 200) {
        setVehicles(response.data)
        setCharacterData((prevData) => ({
          ...prevData,
          vehicle: response.data[0].mta_model,
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNextVehicle = () => {
    if (currentVehicle >= vehicles.length-1) {
      return
    }

    setCurrentVehicle(currentVehicle + 1)
  }

  const handlePreviousVehicle = () => {
    if (currentVehicle === 0) {
      return
    }

    setCurrentVehicle(currentVehicle - 1)
  }

  useEffect(() => {
    fetchFreeVehicles()
  }, [])

  return (
    <Stack spacing={3}>
      {vehicles.length === 0 ? (
        <Skeleton height={250}/>
      ) : (
        <>
          <Card>
            <Stack direction={"row"}>
              <Stack sx={{ width: "50%" }}>
                <CardMedia
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    height: isSmallScreen ? "100px" : "200px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <img style={{ height: isSmallScreen ? "100px" : "200px" }} src={require(`../../../assets/images/vehicles/${vehicles[currentVehicle].mta_model}.png`)} alt={vehicles[currentVehicle].mta_model}></img>
                </CardMedia>
                <Stack spacing={1} direction={"row"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)", paddingBottom: "10px" }}>
                  <Button variant='outlined' disabled={currentVehicle === 0} onClick={handlePreviousVehicle}>
                    <ArrowBackIosNewIcon />
                  </Button>
                  <Button variant='outlined' disabled={currentVehicle >= vehicles.length-1} onClick={handleNextVehicle}>
                    <ArrowForwardIosIcon />
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={1.2} alignItems={"flex-end"} sx={{ width: "50%", backgroundColor: "rgba(0, 0, 0, 0.2)" }} justifyContent={"center"}>
                <ReadTextField label={"Model MTA"} value={vehicles[currentVehicle].mta_model} />
                <ReadTextField label={"Marka"} value={vehicles[currentVehicle].brand} />
                <ReadTextField label={"Model"} value={vehicles[currentVehicle].model} />
                <ReadTextField label={"Rok"} value={vehicles[currentVehicle].year} />
              </Stack>
            </Stack>
          </Card>
          <Divider />
          <Stack direction={isSmallScreen ? "column" : "row"} spacing={1} justifyContent={"flex-end"}>
            <Button
              size='large'
              variant='outlined'
              color='primary'
              onClick={() => {
                setActiveStep(1)
              }}>
              Zmień ubranie
            </Button>
            <Button variant='contained' size='large' color='primary' onClick={validateAllData}>
              Zatwierdź
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default Vehicle
