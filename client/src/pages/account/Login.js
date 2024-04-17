import React, { useContext, useState } from "react"
import { Card, CardContent, Stack, Typography, TextField, FormControlLabel, Checkbox, useMediaQuery, Button, alpha } from "@mui/material"
import { AuthContext } from "../../context/AuthContext"
import { IconTextField } from "../../components/IconTextField"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

function Login({ theme, setLoginState, setOpen }) {
  const isSmallScreen = useMediaQuery("(max-width:900px)")
  const { login } = useContext(AuthContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState({ value: "", visible: false })
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    try {
      await login({ username: username, password: password.value, rememberMe: rememberMe })
      setOpen(false)
    } catch (err) {
      setError(err.response ? err.response.data : "Wystąpił nieznany błąd")
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
          <Card
            sx={{
              width: isSmallScreen ? "100%" : "350px",
              height: isSmallScreen ? "150px" : "530px",
              backgroundImage: `url(${require("../../assets/images/gta5bg.webp")})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: `linear-gradient(-90deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${theme.palette.background.paperLight} 50%)`,
              }}>
              <Stack spacing={1} sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.85), padding: "1rem", backdropFilter: "blur(6px)", borderRadius: "8px" }} justifyContent={"center"} alignItems={"center"}>
                <Typography variant='h6' fontWeight={600}>
                  Nowy na serwerze?
                </Typography>
                <Button
                  variant='contained'
                  sx={{ width: "fit-content" }}
                  onClick={() => {
                    setLoginState(2)
                  }}>
                  Stwórz konto!
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ width: isSmallScreen ? "100%" : "450px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent>
              <Stack>
                <Typography variant='h6' textAlign={"center"}>
                  Witaj na Avalon RP!
                </Typography>
                <Typography variant='subtitle2' textAlign={"center"} color={"text.secondary"}>
                  Zaloguj się na swoje konto i kontynuuj przygodę
                </Typography>
              </Stack>
              <Stack spacing={1.5} mt={3}>
                <TextField
                  variant='outlined'
                  label='Nazwa użytkownika'
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                  }}
                />
                <IconTextField
                  variant='outlined'
                  label='Hasło'
                  type={password.visible ? null : "password"}
                  value={password.value}
                  iconEnd={password.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  clickFunction={() => {
                    setPassword((prevState) => ({
                      ...prevState,
                      visible: !password.visible,
                    }))
                  }}
                  onChange={(event) => {
                    setPassword((prevState) => ({
                      ...prevState,
                      value: event.target.value,
                    }))
                  }}
                />
                {error ? (
                  <Typography variant='body1' color={"error"}>
                    {error}
                  </Typography>
                ) : null}
                <FormControlLabel
                  label='Zapamiętaj mnie'
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => {
                        setRememberMe(event.target.checked)
                      }}
                      color='primary'
                    />
                  }
                />
                <Button variant='contained' color='primary' onClick={handleSubmit}>
                  ZALOGUJ SIĘ
                </Button>
                <Typography
                  variant='body1'
                  sx={{ color: "primary.main", cursor: "pointer" }}
                  textAlign={'center'}
                  onClick={() => {
                    setLoginState(3)
                  }}>
                  Zapomniałem hasła
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Login
