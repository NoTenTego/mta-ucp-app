import React, { useEffect, useState } from "react"
import { Card, CardContent, Typography, Stack, useMediaQuery, Button } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { IconTextField } from "../../../components/IconTextField"
import { DataGrid, plPL } from "@mui/x-data-grid"
import { makeRequest } from "../../../axios"

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "browser",
    headerName: "Przeglądarka",
    flex: 1,
  },
  {
    field: "platform",
    headerName: "Platforma",
    flex: 1,
  },
  {
    field: "creation_date",
    headerName: "Data",
    flex: 1,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleString()
    },
  },
]

function Security({ sendNotification }) {
  const isSmallScreen = useMediaQuery("(max-width:1000px)")

  const [oldPassword, setOldPassword] = useState({ value: "", visible: false })
  const [newPassword, setNewPassword] = useState({ value: "", visible: false })
  const [confimPassword, setConfimPassword] = useState({ value: "", visible: false })

  const [lastActivities, setLastActivities] = React.useState([])

  const handleChangePassword = async () => {
    try {
      const response = await makeRequest.post("accounts/changePassword", {
        oldPassword: oldPassword.value,
        password: newPassword.value,
        confirmPassword: confimPassword.value
      })
      if (response.status === 200) {
        setOldPassword({ value: "", visible: false })
        setNewPassword({ value: "", visible: false })
        setConfimPassword({ value: "", visible: false })

        sendNotification('success', 'Zmiana hasła.', 'Twoje hasło zostało zmienione.')
      }
    } catch (error) {
      sendNotification('error', 'Zmiana hasła.', error.response.data)
    }
  }

  const fetchRecentLogins = async () => {
    try {
      const response = await makeRequest.get("accounts/getRecentLogins")
      if (response) {
        setLastActivities(response.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchRecentLogins()
  }, [])

  return (
    <Stack spacing={3} mb={2}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant='h5'>Zmiana hasła</Typography>
            <Stack spacing={1} direction={isSmallScreen ? "column" : "row"}>
              <IconTextField
                variant='outlined'
                label='Stare hasło'
                fullWidth
                type={oldPassword.visible ? null : "password"}
                value={oldPassword.value}
                iconEnd={oldPassword.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                clickFunction={() => {
                  setOldPassword((prevState) => ({
                    ...prevState,
                    visible: !oldPassword.visible,
                  }))
                }}
                onChange={(event) => {
                  setOldPassword((prevState) => ({
                    ...prevState,
                    value: event.target.value,
                  }))
                }}
              />
              <IconTextField
                variant='outlined'
                label='Nowe hasło'
                fullWidth
                type={newPassword.visible ? null : "password"}
                value={newPassword.value}
                iconEnd={newPassword.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                clickFunction={() => {
                  setNewPassword((prevState) => ({
                    ...prevState,
                    visible: !newPassword.visible,
                  }))
                }}
                onChange={(event) => {
                  setNewPassword((prevState) => ({
                    ...prevState,
                    value: event.target.value,
                  }))
                }}
              />
              <IconTextField
                variant='outlined'
                label='Powtórz nowe hasło'
                fullWidth
                type={confimPassword.visible ? null : "password"}
                value={confimPassword.value}
                iconEnd={confimPassword.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                clickFunction={() => {
                  setConfimPassword((prevState) => ({
                    ...prevState,
                    visible: !confimPassword.visible,
                  }))
                }}
                onChange={(event) => {
                  setConfimPassword((prevState) => ({
                    ...prevState,
                    value: event.target.value,
                  }))
                }}
              />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant='h7'>Hasło powinno zawierać:</Typography>
              <Typography variant='h7' color={"text.secondary"}>
                - Minimum 8 znaków - im więcej, tym lepiej
              </Typography>

              <Typography variant='h7' color={"text.secondary"}>
                - Co najmniej jedna mała i jedna wielka litera
              </Typography>
              <Typography variant='h7' color={"text.secondary"}>
                - Co najmniej jedna cyfra i jeden symbol
              </Typography>
            </Stack>

            <Button variant='contained' sx={{ width: "fit-content" }} onClick={handleChangePassword}>
              Zapisz zmiany
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant='body1'>Ostatnie logowania</Typography>
            <DataGrid
              sx={{ minHeight: "418px" }}
              rows={lastActivities}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 9,
                  },
                },
              }}
              disableColumnMenu
              disableRowSelectionOnClick
              density='compact'
              localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
              autoHeight
              pageSizeOptions={[9]}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default Security
