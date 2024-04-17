import React from "react"
import { Divider, Stack, useMediaQuery, Button, Card, CardMedia } from "@mui/material"
import { makeRequest } from "../../../axios"
//import { freeVehicles } from "./Data"
import { ReadTextField } from "../../../components/ReadTextField"
import { useNavigate } from "react-router-dom"

function PersonalData({ characterData, setActiveStep, sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:830px)")
  const navigate = useNavigate()

  const dateTime = new Date(characterData["birthday"])

  const options = { day: "numeric", month: "long" }
  const result = dateTime.toLocaleString("pl-PL", options)

  /*const findVehicle = (vehicleId) => {
    return freeVehicles.find((vehicle) => vehicle.id === vehicleId)
  }*/

  const getRaceName = (race) => {
    if (race === 0) {
      return "Ciemna"
    } else if (race === 1) {
      return "Biała"
    } else {
      return "Jasna"
    }
  }

  const getClassName = (className) => {
    if (className === 0) {
      return "Gangster"
    } else if (className === 1) {
      return "Biznesmen"
    } else {
      return "Cywil"
    }
  }

  const getGenderName = (gender) => {
    if (gender === 0) {
      return "Mężczyzna"
    } else {
      return "Kobieta"
    }
  }

  const createCharacter = async () => {
    try {
      const response = await makeRequest.post("characters/newCharacter", { characterData: characterData })
      if (response.data) {
        navigate("/characters")
      }
    } catch (error) {
      sendNotification("error", "Tworzenie postaci", error.response.data)
    }
  }

  return (
    <Stack spacing={2}>
      <Divider>Informacje o postaci</Divider>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Imię i nazwisko"} value={characterData["name"]} />
        <ReadTextField label={"Klasa"} value={getClassName(characterData["class"])} />
      </Stack>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Karnacja"} value={getRaceName(characterData["race"])} />
        <ReadTextField label={"Płeć"} value={getGenderName(characterData["gender"])} />
      </Stack>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Wzrost"} value={characterData["height"]} />
        <ReadTextField label={"Waga"} value={characterData["weight"]} />
      </Stack>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Dzień i miesiąc urodzenia"} value={result} />
        <ReadTextField label={"Wiek"} value={characterData["age"]} />
      </Stack>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Siła"} value={characterData["strength"]} />
        <ReadTextField label={"Kondycja"} value={characterData["stamina"]} />
      </Stack>
      <Stack spacing={2} direction={isSmallScreen ? "column" : "row"}>
        <ReadTextField label={"Wytrzymałość"} value={characterData["endurance"]} />
        <ReadTextField label={"Majętność"} value={characterData["wealth"]} />
      </Stack>
      <Divider>Pojazd & Ubranie</Divider>
      <Stack direction={"row"} spacing={2}>
        <Card sx={{ width: "50%" }} elevation={0}>
          <CardMedia
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              height: isSmallScreen ? "100px" : "200px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}>
            <img style={{ height: isSmallScreen ? "100px" : "200px" }} src={require(`../../../assets/images/vehicles/${characterData["vehicle"]}.png`)} alt={characterData["vehicle"]}></img>
          </CardMedia>
        </Card>
        <Card sx={{ width: "50%" }} elevation={0}>
          <CardMedia
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              height: isSmallScreen ? "100px" : "200px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}>
            <img style={{ height: isSmallScreen ? "100px" : "200px" }} src={require(`../../../assets/images/skins/${characterData["skin"]}.webp`)} alt={characterData["skin"]}></img>
          </CardMedia>
        </Card>
      </Stack>
      <Divider/>
      <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
        <Button
          variant='outlined'
          color='primary'
          fullWidth
          onClick={() => {
            setActiveStep(2)
          }}>
          Zmień pojazd startowy
        </Button>
        <Button variant='contained' color='primary' fullWidth onClick={createCharacter}>
          Stwórz postać!
        </Button>
      </Stack>
    </Stack>
  )
}

export default PersonalData
