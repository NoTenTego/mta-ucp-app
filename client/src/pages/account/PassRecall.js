import React, { useState } from "react"
import { Card, CardContent, Stack, Typography, TextField, useMediaQuery, Button, alpha } from "@mui/material"
import { makeRequest } from "../../axios"
import { IconTextField } from "../../components/IconTextField"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useNavigate } from "react-router-dom"

function PassRecall({ theme, setLoginState }) {
  const isSmallScreen = useMediaQuery("(max-width:900px)")
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [password, setPassword] = useState({ value: "", visible: false })
  const [confirmPassword, setConfirmPassword] = useState({ value: "", visible: false })
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pageInfo, setPageInfo] = useState("")

  const recoveryPassword = async () => {
    if (page === 1) {
      try {
        const response = await makeRequest.post("auth/recoveryPassword", {
          email: email,
        })
        if (response.data) {
          setPageInfo(response.data)
          setError(null)
          setPage(2)
        }
      } catch (err) {
        setError(err.response ? err.response.data : "Wystąpił nieznany błąd")
      }
    } else {
      try {
        const response = await makeRequest.post("auth/changePassword", {
          email: email,
          recoveryCode: recoveryCode,
          password: password.value,
          confirmPassword: confirmPassword.value,
        })
        if (response.data) {
          navigate("/login")
        }
      } catch (err) {
        setError(err.response ? err.response.data : "Wystąpił nieznany błąd")
      }
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
            <CardContent sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: `linear-gradient(-90deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${theme.palette.background.paperLight} 50%)` }}>
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
          <Card sx={{ width: isSmallScreen ? "100%" : "450px", display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <CardContent>
              <Stack>
                <Typography variant='h6' textAlign={'center'}>Odzyskiwanie hasła</Typography>
                <Typography variant='subtitle2' textAlign={'center'} color={"text.secondary"}>
                  Wpisz adres email na który chcesz wysłać prośbę o zmiane hasła.
                </Typography>
              </Stack>
              <Stack spacing={1.5} mt={3}>
                {page === 2 ? (
                  <>
                    <TextField
                      variant='outlined'
                      label='Email'
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                      }}
                    />
                    <TextField
                      variant='outlined'
                      label='Kod odzyskiwania'
                      value={recoveryCode}
                      onChange={(event) => {
                        setRecoveryCode(event.target.value)
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
                  </>
                ) : (
                  <TextField
                    variant='outlined'
                    label='Email'
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                    }}
                  />
                )}
                {error ? (
                  <Typography variant='body1' color={"error"}>
                    {error}
                  </Typography>
                ) : (
                  <Typography variant='body1'>{pageInfo}</Typography>
                )}
                <Button variant='contained' color='primary' onClick={recoveryPassword}>
                  {page === 1 ? "Wyślij" : "Zmień hasło"}
                </Button>
              </Stack>
              <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"} mt={3}>
                {page === 1 ? (
                  <>
                    <Typography variant='body1'>Posiadasz już kod?</Typography>
                    <Typography
                      variant='body1'
                      sx={{ color: "primary.main", cursor: "pointer" }}
                      onClick={() => {
                        setPage(2)
                        setError(null)
                      }}>
                      Wprowadź go!
                    </Typography>
                  </>
                ) : (
                  <>
                    {" "}
                    <Typography variant='body1'>Nie posiadasz kodu?</Typography>
                    <Typography
                      variant='body1'
                      sx={{ color: "primary.main", cursor: "pointer" }}
                      onClick={() => {
                        setPage(1)
                        setError(null)
                      }}>
                      Odzyskaj konto!
                    </Typography>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PassRecall
