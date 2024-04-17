import React from "react"
import TextField from "@mui/material/TextField"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Stack, useMediaQuery, Typography, Button, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Alert, Divider } from "@mui/material"
import "dayjs/locale/pl"

function PersonalData({ characterData, setCharacterData, setActiveStep, sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:830px)")

  const updateCharacterStats = (stat, value) => {
    const perkPointsAvailable = characterData["perkPoints"]
    value = Math.min(value, 100)

    const currentStatValue = characterData[stat]

    if (perkPointsAvailable >= value - currentStatValue) {
      const newStatValue = Math.max(0, value)
      const difference = newStatValue - currentStatValue

      setCharacterData((prevData) => ({
        ...prevData,
        perkPoints: perkPointsAvailable - difference,
        [stat]: newStatValue,
      }))
    }
  }

  function checkPersonalData(fullName) {
    if (!fullName) {
      sendNotification("error", "Dane osobowe", `Dane nie są uzupełnione.`)
      return false
    }

    if (fullName.length > 50) {
      sendNotification("error", "Dane osobowe", `Imię i nazwisko mają więcej niż 50 znaków.`)
      return false
    }

    const nameParts = fullName.split(" ")
    if (nameParts.length !== 2) {
      sendNotification("error", "Dane osobowe", `Dane osobowe muszą składać się dwóch części - Imię i Nazwisko`)
      return false
    }

    const firstName = nameParts[0]
    const lastName = nameParts[1]
    const startsWithUppercase = /^[A-Z]/
    if (!startsWithUppercase.test(firstName) || !startsWithUppercase.test(lastName)) {
      sendNotification("error", "Dane osobowe", `Imię lub nazwisko nie zaczynają się od dużej litery.`)
      return false
    }

    if (firstName.length < 3 || lastName.length < 3) {
      sendNotification("error", "Dane osobowe", `Imię lub nazwisko jest zbyt krótkie`)
      return false
    }

    const specialCharacters = /[^A-Za-z0-9'"\s]/
    if (specialCharacters.test(firstName) || specialCharacters.test(lastName)) {
      sendNotification("error", "Dane osobowe", `Imię lub nazwisko zawiera znaki specjalne.`)
      return false
    }
    return true
  }

  const validateAllData = () => {
    //trzeba to przeniesc do serwera
    let error = false

    if (!checkPersonalData(characterData["name"])) {
      error = true
    }

    if (characterData["height"] > 210 || characterData["height"] < 100) {
      sendNotification("error", "Wzrost", `Twoja postać musi mieć wzrost o zakresie 100-210 cm.`)
      error = true
    }

    if (characterData["weight"] > 150 || characterData["weight"] < 30) {
      sendNotification("error", "Waga", `Twoja postać musi mieć wage o zakresie 30-150 kg.`)
      error = true
    }

    if (characterData["age"] > 100 || characterData["age"] < 16) {
      sendNotification("error", "Wiek", `Twoja postać musi mieć wiek o zakresie 16-100 lat.`)
      error = true
    }

    if (!error) {
      setActiveStep(1)
    }
  }

  return (
    <Card elevation={0} sx={{ boxShadow: "none" }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Alert severity='info'>Imię i nazwisko musi zaczynać się z dużej litery i być zangielszczone. Przykład: John Tomato</Alert>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              id='name'
              label='Imię i nazwisko'
              value={characterData["name"]}
              fullWidth
              onChange={(event) => {
                setCharacterData((prevData) => ({
                  ...prevData,
                  name: event.target.value,
                }))
              }}
            />
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label-class'>Klasa</InputLabel>
              <Select
                labelId='demo-simple-select-label-class'
                id='demo-simple-select-class'
                value={characterData["class"]}
                label='Klasa'
                onChange={(event) => {
                  setCharacterData((prevData) => ({
                    ...prevData,
                    class: event.target.value,
                  }))
                }}>
                <MenuItem value={0}>Gangster</MenuItem>
                <MenuItem value={1}>Biznesmen</MenuItem>
                <MenuItem value={2}>Cywil</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label-race'>Karnacja</InputLabel>
              <Select
                labelId='demo-simple-select-label-race'
                id='demo-simple-select-race'
                value={characterData["race"]}
                label='Karnacja'
                onChange={(event) => {
                  setCharacterData((prevData) => ({
                    ...prevData,
                    race: event.target.value,
                  }))
                }}>
                <MenuItem value={0}>Ciemna</MenuItem>
                <MenuItem value={1}>Biała</MenuItem>
                <MenuItem value={2}>Jasna</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label-gender'>Płeć</InputLabel>
              <Select
                labelId='demo-simple-select-label-gender'
                id='demo-simple-select-gender'
                value={characterData["gender"]}
                label='Płeć'
                onChange={(event) => {
                  setCharacterData((prevData) => ({
                    ...prevData,
                    gender: event.target.value,
                  }))
                }}>
                <MenuItem value={0}>Mężczyzna</MenuItem>
                <MenuItem value={1}>Kobieta</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              id='height'
              label='Wzrost'
              fullWidth
              type='number'
              value={characterData["height"]}
              onChange={(event) => {
                setCharacterData((prevData) => ({
                  ...prevData,
                  height: Math.floor(event.target.value),
                }))
              }}
            />
            <TextField
              id='weight'
              label='Waga'
              fullWidth
              type='number'
              value={characterData["weight"]}
              onChange={(event) => {
                setCharacterData((prevData) => ({
                  ...prevData,
                  weight: Math.floor(event.target.value),
                }))
              }}
            />
          </Stack>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pl'>
              <DatePicker
                views={["day", "month"]}
                label='Dzień i miesiąc urodzenia'
                sx={{ width: isSmallScreen ? "100%" : "50%" }}
                value={characterData["birthday"]}
                onChange={(newValue) => {
                  setCharacterData((prevData) => ({
                    ...prevData,
                    birthday: newValue,
                  }))
                }}
              />
            </LocalizationProvider>
            <TextField
              id='age'
              label='Wiek'
              sx={{ width: isSmallScreen ? "100%" : "50%" }}
              type='number'
              value={characterData["age"]}
              onChange={(event) => {
                setCharacterData((prevData) => ({
                  ...prevData,
                  age: Math.floor(event.target.value),
                }))
              }}
            />
          </Stack>
          <Alert severity='info'>
            Rozdzielenie punktów na atrybuty postaci to kluczowy aspekt tworzenia postaci, gdzie masz do dyspozycji 100 punktów. Postać, która zaniedbuje wytrzymałość, nie może uczęszczać na siłownię, ale istnieje możliwość korzystania z
            różnych specyfików w celu chwilowego przywrócenia energii. Mnożnik majątku określa ilość pieniędzy, jakie posiadasz na początku gry, wpływając tym samym na Twoje możliwości finansowe.
          </Alert>
          <Typography variant='h6'>Pozostałe punkty: {characterData["perkPoints"]}</Typography>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              id='strength'
              label='Siła'
              type='number'
              fullWidth
              value={characterData["strength"]}
              onChange={(event) => {
                updateCharacterStats("strength", event.target.value)
              }}
            />
            <TextField
              id='stamina'
              label='Kondycja'
              type='number'
              fullWidth
              value={characterData["stamina"]}
              onChange={(event) => {
                updateCharacterStats("stamina", event.target.value)
              }}
            />
          </Stack>
          <Stack spacing={2.5} direction={isSmallScreen ? "column" : "row"}>
            <TextField
              id='endurance'
              label='Wytrzymałość'
              type='number'
              fullWidth
              value={characterData["endurance"]}
              onChange={(event) => {
                updateCharacterStats("endurance", event.target.value)
              }}
            />
            <TextField
              id='wealth'
              label='Majętność'
              type='number'
              fullWidth
              value={characterData["wealth"]}
              onChange={(event) => {
                updateCharacterStats("wealth", event.target.value)
              }}
            />
          </Stack>
          <Divider/>
          <Button variant='contained' color='primary' onClick={validateAllData}>
            Zatwierdź
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PersonalData
