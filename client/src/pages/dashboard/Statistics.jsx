import React, { useState } from "react"
import { Card, CardContent, Typography, Grid, Stack, Avatar } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import PeopleIcon from "@mui/icons-material/People"
import HomeWorkIcon from "@mui/icons-material/HomeWork"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import { makeRequest } from "../../axios"

function Statistics() {
  const [items, setItems] = useState([
    { title: "Konta", value: "245", icon: <AccountCircleIcon />, color: "primary.main" },
    { title: "Postacie", value: "321", icon: <PeopleIcon />, color: "success.main" },
    { title: "Nieruchomości", value: "113", icon: <HomeWorkIcon />, color: "error.main" },
    { title: "Pojazdy", value: "233", icon: <DirectionsCarIcon />, color: "warning.main" },
  ])

  const fetchAllStats = async () => {
    const response = await makeRequest.get("dashboard/getServerStats");
    if (response.data) {
      setItems((prevState) =>
        prevState.map((item, index) => ({
          ...item,
          value: response.data[["accounts", "characters", "interiors", "vehicles"][index]],
        }))
      );
    }
  };

  React.useEffect(() => {
    fetchAllStats()
  }, [])

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant='body1'>Statystyki serwera</Typography>
          <Typography variant='body1' color='text.secondary'>
            Ostatnia aktualizacja: 18:11
          </Typography>
          <Grid container gap={4}>
            {items.map((item, index) => (
              <Grid item key={index}>
                <Stack direction={"row"} spacing={1.5} alignItems={"center"}>
                  <Avatar sx={{ bgcolor: item.color }} variant='rounded'>
                    {item.icon}
                  </Avatar>
                  <Stack justifyContent={"flex-end"}>
                    <Typography variant='body2' color={"text.secondary"}>
                      {item.title}
                    </Typography>
                    <Typography variant='h6'>{item.value}</Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Statistics
