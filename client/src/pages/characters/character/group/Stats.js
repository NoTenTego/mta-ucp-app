import React from "react"
import { CardContent, Card } from "@mui/material"
import { ReadTextField } from "../../../../components/ReadTextField"
import { formatMoney } from "../../../../components/Utils"
import Grid from "@mui/material/Unstable_Grid2"

function Stats({ data }) {
  const getTypeName = (type) => {
    if (type === 0) {
      return "Biznes"
    } else if (type === 1) {
      return "Frakcja"
    } else {
      return "Organizacja przestępcza"
    }
  }

  const rows = [
    { label: "Identyfikator", value: data.id },
    { label: "Nazwa", value: data.name },
    { label: "Nazwa dyżuru", value: data.duty_name },
    { label: "Właściciel", value: data.ownerName },
    { label: "Typ", value: getTypeName(data.type) },
    { label: "Stan konta bankowego", value: formatMoney(data.money) },
  ]

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={3}>
          {rows.map((row, index) => (
            <Grid key={index} sx={{ flexGrow: 1 }}>
              <ReadTextField label={row.label} value={row.value} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Stats
