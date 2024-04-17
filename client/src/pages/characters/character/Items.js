import { Card, CardContent, Stack, TextField, Typography } from "@mui/material"
import * as React from "react"

const ReadTextField = ({ value, widthSize }) => {
  return (
    <TextField
      id='outlined-read-only-input'
      defaultValue={value}
      InputProps={{
        readOnly: true,
      }}
      variant='standard'
      size='small'
      focused={false}
      sx={{
        width: widthSize,
        "& .MuiInput-underline": {
          pointerEvents: "none",
        },
      }}
    />
  )
}

export default function Items({ items }) {
  return (
    <Stack spacing={1.5}>
      <Card sx={{ width: "100%" }} elevation={0}>
        <CardContent>
          <Stack direction='row' spacing={1}>
            <Typography variant='h6' color={"text.secondary"} sx={{ width: "50%" }}>
              Nazwa
            </Typography>
            <Typography variant='h6' color={"text.secondary"} sx={{ width: "25%" }}>
              Wartość 1
            </Typography>
            <Typography variant='h6' color={"text.secondary"} sx={{ width: "25%" }}>
              Wartość 2
            </Typography>
          </Stack>
          <Stack mt={2} spacing={1} sx={{ height: "277px", overflowY: "auto" }}>
            {items.map((item, index) => (
              <Stack key={index} direction='row' spacing={1}>
                <ReadTextField value={item.name} widthSize='50%' />
                <ReadTextField value={item.value_1} widthSize='25%' />
                <ReadTextField value={item.value_2} widthSize='25%' />
              </Stack>
            ))}
          </Stack>
          <Typography mt={2} variant='subtitle1' color={"text.secondary"} sx={{ backgroundColor:"background.default", padding:'1px 5px', borderRadius:'6px', width:'fit-content' }}>
            Ilość przedmiotów: {items.length}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}
