import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import { Stack } from "@mui/material"
import { ReadTextField } from "../../../components/ReadTextField"

export default function Vehicles({ vehicle }) {
  
  function formatOdometer(str) {
    str = String(str)
    const digits = str.replace(/\D/g, "").split("")

    const commasCount = Math.floor((digits.length - 1) / 3)

    for (let i = 1; i <= commasCount; i++) {
      const insertIndex = digits.length - i * 3
      digits.splice(insertIndex, 0, " ")
    }

    return digits.join("") + ' km'
  }

  return (
    <Card elevation={0}>
      <CardMedia component='img' height={150} image={require(`../../../assets/images/vehicles/${String(vehicle.mta_model)}.png`)} alt={vehicle.mta_model} />
      <CardContent>
        <Stack spacing={1}>
          <ReadTextField label={"Model"} value={vehicle.brand + ' ' + vehicle.model} />
          <ReadTextField label={"Przebieg"} value={formatOdometer(vehicle.odometer)} />
        </Stack>
      </CardContent>
    </Card>
  )
}
