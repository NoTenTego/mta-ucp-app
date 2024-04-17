import React, { useState } from "react"
import { Card, CardContent, Stack, Typography, TextField, useMediaQuery, Button, alpha } from "@mui/material"
import { makeRequest } from "../../axios"
import { IconTextField } from "../../components/IconTextField"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

const beta = true

function Register({ theme, setLoginState }) {
  const isSmallScreen = useMediaQuery("(max-width:900px)")

  const [login, setLogin] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState({ value: "", visible: false })
  const [confirmPassword, setConfirmPassword] = useState({ value: "", visible: false })
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [confirmationCode, setConfirmationCode] = useState("")
  const [pageInfo, setPageInfo] = useState("")

  const [betaCode, setBetaCode] = useState("")

  const registerAccount = async () => {
    try {
      const response = await makeRequest.post("auth/register", {
        username: login,
        email,
        password: password.value,
        confirmPassword: confirmPassword.value,
        betaCode,
      })

      if (response.data) {
        setError(null)
        setPage(2)
        setPageInfo("Kod potwierdzający rejestrację został wysłany na podany adres email.")
      }
    } catch (err) {
      setError(err.response ? err.response.data : "Wystąpił nieznany błąd")
    }
  }

  const activateAccount = async () => {
    try {
      const response = await makeRequest.post("auth/activateAccount", {
        username: login,
        confirmationCode: confirmationCode,
      })

      if (response.data) {
        setLoginState(1)
      }
    } catch (err) {
      setError(err.response.data)
      setPageInfo("")
    }
  }

  const resendConfirmationCode = async () => {
    try {
      const response = await makeRequest.post("auth/resendConfirmationCode", {
        username: login,
      })

      if (response.data) {
        setPageInfo(response.data)
        setError(null)
      }
    } catch (err) {
      setError(err.response.data)
      setPageInfo("")
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
                  Posiadasz już konto?
                </Typography>
                <Button
                  variant='contained'
                  sx={{ width: "fit-content" }}
                  onClick={() => {
                    setLoginState(1)
                  }}>
                  Zaloguj się!
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ width: isSmallScreen ? "100%" : "450px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent>
              <Stack>
                <Typography variant='h6' textAlign={"center"}>
                  {page === 1 ? "Witaj na Avalon RP!" : "Potwierdzenie konta"}
                </Typography>
                <Typography variant='subtitle2' textAlign={"center"} color={"text.secondary"}>
                  {page === 1 ? "Stwórz konto i rozpocznij nową przygodę" : "Wpisz login na który ma zostać wysłany kod potwierdzający."}
                </Typography>
              </Stack>
              {page === 1 ? (
                <>
                  <Stack spacing={1.5} mt={3}>
                    <TextField
                      variant='outlined'
                      label='Nazwa użytkownika'
                      value={login}
                      onChange={(event) => {
                        setLogin(event.target.value)
                      }}
                    />
                    <TextField
                      variant='outlined'
                      label='Email'
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
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
                    <IconTextField
                      variant='outlined'
                      label='Powtórz Hasło'
                      type={confirmPassword.visible ? null : "password"}
                      value={confirmPassword.value}
                      iconEnd={confirmPassword.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      clickFunction={() => {
                        setConfirmPassword((prevState) => ({
                          ...prevState,
                          visible: !confirmPassword.visible,
                        }))
                      }}
                      onChange={(event) => {
                        setConfirmPassword((prevState) => ({
                          ...prevState,
                          value: event.target.value,
                        }))
                      }}
                    />
                    {beta && (
                      <TextField
                        variant='outlined'
                        label='Kod zaproszeniowy'
                        value={betaCode}
                        onChange={(event) => {
                          setBetaCode(event.target.value)
                        }}
                      />
                    )}
                    {error ? (
                      <Typography variant='body1' color={"error"}>
                        {error}
                      </Typography>
                    ) : null}
                    <Button variant='contained' color='primary' onClick={registerAccount}>
                      Stwórz konto
                    </Button>
                    <Stack spacing={1} direction={'row'} justifyContent={'center'}>
                      <Typography variant='body1'>Masz kod potwierdzający?</Typography>
                      <Typography
                        variant='body1'
                        sx={{ color: "primary.main", cursor: "pointer" }}
                        onClick={() => {
                          setPage(2)
                          setError(null)
                        }}>
                        Wprowadź go!
                      </Typography>
                    </Stack>
                  </Stack>
                </>
              ) : (
                <>
                  <Stack spacing={2} mt={3}>
                    <TextField
                      variant='outlined'
                      label='Nazwa użytkownika'
                      value={login}
                      onChange={(event) => {
                        setLogin(event.target.value)
                      }}
                    />
                    <TextField
                      variant='outlined'
                      label='Kod potwierdzający'
                      value={confirmationCode}
                      onChange={(event) => {
                        setConfirmationCode(event.target.value)
                      }}
                    />
                    {error ? (
                      <Typography variant='body1' color={"error"}>
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant='body1'>{pageInfo}</Typography>
                    )}
                    <Stack spacing={1}>
                      <Button variant='contained' color='primary' onClick={activateAccount}>
                        Potwierdź konto
                      </Button>
                      <Button variant='contained' color='error' size='small' onClick={resendConfirmationCode}>
                        Wyślij nowy kod
                      </Button>
                    </Stack>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Register
