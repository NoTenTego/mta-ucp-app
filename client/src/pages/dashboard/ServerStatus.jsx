import React, { useState } from "react"
import { Card, CardContent, Typography, Grid, Stack, Avatar, Button } from "@mui/material"
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction"
import PeopleIcon from "@mui/icons-material/People"
import UpdateIcon from "@mui/icons-material/Update"
import GppGoodIcon from "@mui/icons-material/GppGood"

function ServerStatus() {
  const [items, setItems] = useState([
    { title: "Online", value: "23 godziny", icon: <OnlinePredictionIcon />, color: "success.main" },
    { title: "Graczy", value: "1", icon: <PeopleIcon />, color: "primary.main" },
    { title: "Ostatni update", value: "24.11.2023", icon: <UpdateIcon />, color: "warning.main" },
    { title: "Wersja gry", value: "1.0", icon: <GppGoodIcon />, color: "error.main" },
  ])

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant='body1'>Status serwera</Typography>
          <Typography variant='body1' color='text.secondary'>Ostatnia aktualizacja: 18:11</Typography>
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

export default ServerStatus
