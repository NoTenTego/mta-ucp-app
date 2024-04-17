/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react"
import { Stack, useMediaQuery, Card, Box, CardContent, Typography, alpha } from "@mui/material"
import { Explore, SportsEsports, Security, Healing, MonetizationOn, ArtTrack, Search, LocalMall, SportsFootball, Home, Nightlife, EmojiFoodBeverage, DirectionsBus } from "@mui/icons-material"
import Masonry from "@mui/lab/Masonry"
import { AuthContext } from "../../../context/AuthContext"
import { makeRequest } from "../../../axios"

const achievementsData = [
  {
    title: "Biznesowy Magnat",
    description: "Osiągnij określoną wartość zysku z prowadzenia własnej firmy lub biznesu.",
    icon: <MonetizationOn sx={{ fontSize: 70 }} />,
    active: "2024-01-15", // Przykładowa data aktywacji
  },
  {
    title: "Eksplorator Miasta",
    description: "Zbadaj wszystkie kluczowe obszary miasta, odkryj ukryte miejsca i zabytki.",
    icon: <Explore sx={{ fontSize: 70 }} />,
    active: false, // Przykładowa data aktywacji
  },
  {
    title: "Kierowca Rajdowy",
    description: "Uzyskaj pierwsze miejsce w co najmniej 10 wyścigach samochodowych na serwerze.",
    icon: <SportsEsports sx={{ fontSize: 70 }} />,
    active: false, // Osiągnięcie nieaktywne
  },
  {
    title: "Łowca Przestępców",
    description: "Pomóż w zatrzymaniu lub schwytaniu określonej liczby poszukiwanych przestępców.",
    icon: <Security sx={{ fontSize: 70 }} />,
    active: "2024-01-12", // Przykładowa data aktywacji
  },
  {
    title: "Dobry Samaritańczyk",
    description: "Udziel pomocy innym graczom w trudnych sytuacjach co najmniej 50 razy.",
    icon: <Healing sx={{ fontSize: 70 }} />,
    active: "2024-01-18", // Przykładowa data aktywacji
  },
  {
    title: "Mistrz Kradzieży",
    description: "Udało Ci się dokonać skomplikowanej kradzieży bez zostawiania śladów.",
    icon: <Search sx={{ fontSize: 70 }} />,
    active: false, // Osiągnięcie nieaktywne
  },
  {
    title: "Mecenas Sztuki",
    description: "Wspieraj lokalną scenę artystyczną poprzez zakup dzieł sztuki od innych graczy.",
    icon: <ArtTrack sx={{ fontSize: 70 }} />,
    active: false, // Przykładowa data aktywacji
  },
  {
    title: "Detektyw",
    description: "Rozwiązuj zagadki kryminalne i udowodnij swoje umiejętności detektywistyczne.",
    icon: <Search sx={{ fontSize: 70 }} />,
    active: "2024-01-25", // Przykładowa data aktywacji
  },
  {
    title: "Elegancki Handlarz",
    description: "Zdobądź określoną liczbę punktów handlowych, handlując towarami na serwerze.",
    icon: <LocalMall sx={{ fontSize: 70 }} />,
    active: false, // Osiągnięcie nieaktywne
  },
  {
    title: "Sportowiec Miejski",
    description: "Bierz udział w różnych wydarzeniach sportowych na serwerze, takich jak piłka nożna, wyścigi rowerowe itp.",
    icon: <SportsFootball sx={{ fontSize: 70 }} />,
    active: "2024-01-28", // Przykładowa data aktywacji
  },
  {
    title: "Zdobywca Nieruchomości",
    description: "Zakup określoną liczbę nieruchomości na serwerze.",
    icon: <Home sx={{ fontSize: 70 }} />,
    active: "2024-01-30", // Przykładowa data aktywacji
  },
  {
    title: "Król Rozrywki",
    description: "Organizuj udane imprezy, koncerty lub inne wydarzenia rozrywkowe.",
    icon: <Nightlife sx={{ fontSize: 70 }} />,
    active: "2024-02-05", // Przykładowa data aktywacji
  },
  {
    title: "Mistrz Barmański",
    description: "Pracuj jako barman i zdobądź renomę za obsługę klientów.",
    icon: <EmojiFoodBeverage sx={{ fontSize: 70 }} />,
    active: "2024-02-10", // Przykładowa data aktywacji
  },
  {
    title: "Legenda Transportu Publicznego",
    description: "Zdobądź określoną liczbę pozytywnych opinii jako kierowca komunikacji publicznej.",
    icon: <DirectionsBus sx={{ fontSize: 70 }} />,
    active: "2024-02-15", // Przykładowa data aktywacji
  },
  // Dodaj więcej osiągnięć według potrzeb
]

function Account({ theme }) {
  const isSmallScreen = useMediaQuery("(max-width:1000px)")
  const { currentUser } = useContext(AuthContext)

  const [accountData, setAccountData] = useState([
    { title: "Nazwa użytkownika:", value: "" },
    { title: "Email:", value: "" },
    { title: "Punkty premium:", value: 0 },
    { title: "Czas spędzony w grze:", value: "0 godzin" },
    { title: "Konto:", value: "" },
  ])

  const [additionalData, setAdditionalData] = useState([
    { title: "Data rejestracji konta", value: "" },
    { title: "Status konta", value: "" },
  ])

  const fetchServerTimestamp = async () => {
    try {
      const response = await makeRequest.get("dashboard/getServerTimestamp")
      if (response) {
        setAccountData([
          { title: "Nazwa użytkownika:", value: currentUser.username || "" },
          { title: "Email:", value: currentUser.email || "" },
          { title: "Czas spędzony w grze:", value: currentUser.hours + " godzin" || "0 godzin" },
          { title: "Status konta", value: currentUser.ban === 1 ? "Zbanowane" : "Aktywne" },
        ])
        setAdditionalData([
          { title: "Punkty premium:", value: currentUser.premium.points || 0 },
          { title: "Konto:", value: currentUser.premium.active_until > response.data ? "Premium" : "Zwykłe" },
        ])
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchServerTimestamp()
  }, [currentUser])

  return (
    <Stack direction={isSmallScreen ? "column" : "row"} spacing={3} mb={2}>
      <Card elevation={0} sx={{ minWidth: "350px", height: "fit-content" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant='caption' color={"text.secondary"} fontWeight={600}>
              INFORMACJE O KONCIE
            </Typography>
            <Stack spacing={1.5}>
              {accountData.map((data, index) => (
                <Stack spacing={1} key={index} direction={"row"}>
                  <Typography variant='body1' fontWeight={600} color={"text.secondary"}>
                    {data.title}
                  </Typography>
                  <Typography variant='body1'>{data.value}</Typography>
                </Stack>
              ))}
            </Stack>
            <Typography variant='caption' color={"text.secondary"} fontWeight={600}>
              POZOSTAŁE
            </Typography>
            <Stack spacing={1.5}>
              {additionalData.map((data, index) => (
                <Stack spacing={1} key={index} direction={"row"}>
                  <Typography variant='body1' fontWeight={600} color={"text.secondary"}>
                    {data.title}
                  </Typography>
                  <Typography variant='body1'>{data.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card elevation={0} sx={{ width: "100%" }}>
        <CardContent>
          <Masonry columns={isSmallScreen ? 1 : 3} spacing={2}>
            {achievementsData
              .sort((a, b) => (a.active === false) - (b.active === false) || (a.active || 0) - (b.active || 0))
              .map((achievement, index) => (
                <Card variant='outlined' key={index}>
                  <CardContent>
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <Box
                        sx={{
                          backgroundColor: achievement.active !== false ? alpha(theme.palette.primary.main, 0.5) : alpha(theme.palette.error.main, 0.5),
                          padding: "2px 6px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        {achievement.icon}
                      </Box>
                      <Stack spacing={1}>
                        <Typography variant='body1'>{achievement.title}</Typography>
                        <Typography variant='body2'>{achievement.description}</Typography>
                        <Typography
                          textAlign={"center"}
                          sx={{
                            backgroundColor: achievement.active !== false ? alpha(theme.palette.primary.main, 0.5) : alpha(theme.palette.error.main, 0.5),
                            padding: "2px 6px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            height: "100%",
                            width: "fit-content",
                          }}>
                          {achievement.active !== false ? "Odblokowano: " + achievement.active : "Zablokowane"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Masonry>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default Account
