import { Card, CardContent, Stack, Typography, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText } from "@mui/material"
import React, { useState } from "react"

function Fuel({ sendNotification }) {
  const [backdrop, setBackdrop] = useState(false)
  const defaultFuelPrice = 10
  const [fuelPrice, setFuelPrice] = useState([defaultFuelPrice, defaultFuelPrice])

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant='h5'>Ustawienia paliwa</Typography>

        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"flex-end"} spacing={5}>
          <Box mt={3}>
            <Typography variant='h4' fontWeight={600}>
              ${fuelPrice[0]}
            </Typography>
            <Stack spacing={-0.75} mb={2.5}>
              <Typography variant='subtitle1' color={"text.secondary"}>
                Cena za litr
              </Typography>
              <Typography variant='subtitle1' color={"text.secondary"}>
                Domyślna wartość: ${defaultFuelPrice}
              </Typography>
            </Stack>
            <Button variant='contained' color='error' size='small' onClick={() => setBackdrop(true)}>
              Zmień
            </Button>
          </Box>
          <img src={require("../../../assets/images/vehicles/fuel.png")} style={{ height: "150px" }} alt='fuel'></img>
        </Stack>
      </CardContent>

      <Dialog
        open={backdrop}
        onClose={() => {
          setBackdrop(false)
        }}
        PaperProps={{
          elevation: 0,
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Ustawienia paliwa</DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>Domyślna wartość: ${defaultFuelPrice}</DialogContentText>
          <TextField
            id='Fuel'
            label='Cena'
            variant='outlined'
            value={fuelPrice[1]}
            onChange={(event) => {
              setFuelPrice([fuelPrice[0], event.target.value])
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setFuelPrice([fuelPrice[1], fuelPrice[1]])
              setBackdrop(false)
            }}>
            Zmień
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              setBackdrop(false)
            }}>
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Fuel
