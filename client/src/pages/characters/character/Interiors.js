import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import { Stack } from "@mui/material"
import { interiorsList } from "../../../data/InteriorList"
import { ReadTextField } from '../../../components/ReadTextField'

export default function Interiors({ interior }) {
  const findInteriorPicture = () => {
    let mergedInteriorList = [].concat(...interiorsList[0], interiorsList[1], interiorsList[2])
    let interiorData = mergedInteriorList.find((obj) => obj.id === interior.id)
    if (!interiorData) {
      return ""
    }

    return interiorData.picture
  }

  return (
    <Card elevation={0}>
      <CardMedia component='img' height={150} image={findInteriorPicture()} alt={interior.id} />
      <CardContent>
        <Stack spacing={1}>
          <ReadTextField label={"Nazwa"} value={interior.name} />
        </Stack>
      </CardContent>
    </Card>
  )
}
