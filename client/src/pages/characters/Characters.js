import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Unstable_Grid2"
import { Typography, Button, Stack, useMediaQuery, Card, CardContent, alpha } from "@mui/material"
import { useNavigate } from "react-router-dom"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { ReadTextField } from "../../components/ReadTextField"
import { motion } from "framer-motion"
import { makeRequest } from "../../axios"

function Characters({ theme }) {
  const isSmallScreen = useMediaQuery("(max-width:500px)")
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])

  const fetchAllCharacters = async () => {
    const response = await makeRequest.get("characters/getAllCharacters")
    if (response.data) {
      setCharacters(response.data)
    }
  }

  useEffect(() => {
    fetchAllCharacters()
  }, [])

  function formatMoney(str) {
    str = String(str)
    const digits = str.replace(/\D/g, "").split("")

    const commasCount = Math.floor((digits.length - 1) / 3)

    for (let i = 1; i <= commasCount; i++) {
      const insertIndex = digits.length - i * 3
      digits.splice(insertIndex, 0, ".")
    }

    return "$" + digits.join("")
  }

  const getSkinColorName = (skinColor) => {
    const skinColorNames = [
      { skinColor: 0, name: "Ciemna" },
      { skinColor: 1, name: "Jasna" },
      { skinColor: 2, name: "Biała" },
    ]

    return skinColorNames[skinColor].name
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
      {characters.length === 0 ? (
        <Card
          elevation={0}
          sx={{ width: "350px", height: "340px", "&:hover": { background: alpha(theme.palette.primary.main, 0.3), cursor: "pointer" } }}
          onClick={() => {
            navigate("new")
          }}>
          <CardContent sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stack justifyContent={"center"} alignItems={"center"}>
              <PersonAddIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant='h6' sx={{ color: "primary.main", fontWeight: 600 }}>
                STWÓRZ POSTAĆ
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <Grid container spacing={3}>
            {characters.map((character, index) => (
              <Grid key={index} sx={{ flexGrow: 1, width: "350px", maxWidth: "500px" }}>
                <Card elevation={0}>
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack justifyContent={"center"} alignItems={"center"}>
                        <Typography variant='h6' textAlign={"center"}>
                          {character["charactername"].replace("_", " ")}
                        </Typography>
                        <Typography
                          textAlign={"center"}
                          sx={{
                            backgroundColor: character["active"] === 1 ? (theme.palette.mode === "dark" ? alpha(theme.palette.primary.main, 0.5) : alpha(theme.palette.primary.light, 0.5)) : alpha(theme.palette.error.main, 0.5),
                            padding: "2px 6px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            height: "100%",
                            width: "fit-content",
                          }}>
                          {character["active"] === 1 ? "Aktywna" : "Nieaktywna"}
                        </Typography>
                      </Stack>
                      <Stack direction={isSmallScreen ? "column" : "row"} spacing={1.5}>
                        <Stack sx={{ width: "100%" }} spacing={1.5}>
                          <ReadTextField label='Imię i nazwisko' value={character["charactername"].replace("_", " ")} />
                          <ReadTextField label='Płeć' value={character["gender"] === 0 ? "Mężczyzna" : "Kobieta"} />
                          <ReadTextField label='Gotówka' value={formatMoney(character["money"])} />
                        </Stack>
                        <Stack sx={{ width: "100%" }} spacing={1.5}>
                          <ReadTextField label='Wiek' value={character["age"]} />
                          <ReadTextField label='Kolor skóry' value={getSkinColorName(character["skincolor"])} />
                          <ReadTextField label='Stan konta' value={formatMoney(character["bankmoney"])} />
                        </Stack>
                      </Stack>
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {
                          navigate(`details/${character["id"]}`)
                        }}>
                        Szczegóły
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid sx={{ flexGrow: 1, width: "350px", maxWidth: "500px" }}>
              <Card
                elevation={0}
                sx={{ height: "340px", "&:hover": { background: alpha(theme.palette.primary.main, 0.3), cursor: "pointer" } }}
                onClick={() => {
                  navigate("new")
                }}>
                <CardContent sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Stack justifyContent={"center"} alignItems={"center"}>
                    <PersonAddIcon sx={{ fontSize: 50, color: "primary.main" }} />
                    <Typography variant='h6' sx={{ color: "primary.main", fontWeight: 600 }}>
                      STWÓRZ POSTAĆ
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </motion.div>
  )
}

export default Characters
