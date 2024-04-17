import React from "react"
import { LinearProgress, Stack, Typography, Box, useMediaQuery, CardContent, Card } from "@mui/material"
import { ReadTextField } from "../../../components/ReadTextField"
import { formatMoney } from "../../../components/Utils"

function Stats({ character }) {
  const isSmallScreen = useMediaQuery("(max-width:500px)")

  const getSkinColorName = (skinColor) => {
    const skinColorNames = [
      { skinColor: 0, name: "Ciemna" },
      { skinColor: 1, name: "Jasna" },
      { skinColor: 2, name: "Biała" },
    ]

    return skinColorNames[skinColor].name
  }

  let gymStats = null
  if (character["gym_stats"]) {
    gymStats = JSON.parse(character["gym_stats"])
  }

  return (
    <Stack spacing={1.5} sx={{ minWidth: "300px" }}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction={isSmallScreen ? "column" : "row"} spacing={1.5}>
              <Stack sx={{ width: "100%" }} spacing={1.5}>
                <ReadTextField label='Imię i nazwisko' value={character["charactername"].replace("_", " ")} />
                <ReadTextField label='Płeć' value={character["gender"] === 0 ? "Mężczyzna" : "Kobieta"} />
                <ReadTextField label='Data utworzenia' value={new Date(character["creation_date"]).toLocaleDateString()} />
                <ReadTextField label='Gotówka' value={formatMoney(character["money"])} />
              </Stack>
              <Stack sx={{ width: "100%" }} spacing={1.5}>
                <ReadTextField label='Wiek' value={character["age"]} />
                <ReadTextField label='Kolor skóry' value={getSkinColorName(character["skincolor"])} />
                <ReadTextField label='Rozegrane godziny' value={character["hours"]} />
                <ReadTextField label='Stan konta' value={formatMoney(character["bankmoney"])} />
              </Stack>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant='subtitle1'>Siła</Typography>
                <LinearProgress sx={{ height: "7px" }} variant='determinate' value={gymStats && gymStats["strength"]} />
              </Box>
              <Box>
                <Typography variant='subtitle1'>Kondycja</Typography>
                <LinearProgress sx={{ height: "7px" }} variant='determinate' value={gymStats && gymStats["stamina"]} />
              </Box>
              <Box>
                <Typography variant='subtitle1'>Wytrzymałość</Typography>
                <LinearProgress sx={{ height: "7px" }} variant='determinate' value={gymStats && gymStats["endurance"]} />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default Stats
