import React, { useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails, TextField, CardContent, Card, Typography, Box, Tab, tabsClasses, Stack, Button } from "@mui/material"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Search } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const faqData = {
  "Błędy i Propozycje": [
    {
      question: "Jak zaktualizować konto?",
      answer: "Przejdź do Ustawienia konta i wybierz Aktualizuj konto.",
    },
  ],
  "Zgłoszenie gracza": [
    {
      question: "Jak zgłosić nieodpowiednie zachowanie?",
      answer: "Użyj /report lub skontaktuj się z administracją.",
    },
    {
      question: "Czy zgłoszenia są anonimowe?",
      answer: "Tak, zachowujemy poufność.",
    },
  ],
  "Skargi na Administracje": [
    {
      question: "Jak złożyć skargę na admina?",
      answer: "Zgłoś na forum serwera lub skontaktuj się z wyższymi członkami administracji.",
    },
  ],
  platnosci: [
    {
      question: "Jak mogę zaktualizować swoje konto?",
      answer: "Aby zaktualizować swoje konto, należy przejść do sekcji Ustawienia konta i wybrać opcję Aktualizuj konto.",
    },
    {
      question: "Jak mogę zmienić metodę płatności?",
      answer: "Aby zmienić metodę płatności, należy przejść do sekcji Ustawienia konta i wybrać opcję Zmień metodę płatności.",
    },
  ],
  Ogólne: [
    {
      question: "Ile osób może jednocześnie grać na serwerze?",
      answer: "Sprawdź informacje na stronie głównej.",
    },
  ],
}

const Faq = () => {
  const [searchText, setSearchText] = useState("")
  const [value, setValue] = React.useState("Błędy i Propozycje")

  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value)
  }

  const filteredFaqData = Object.entries(faqData).flatMap(([category, faqs]) =>
    faqs
      .filter((faq) => {
        const regex = new RegExp(searchText, "i")
        return regex.test(faq.question) || regex.test(faq.answer)
      })
      .map((faq) => ({ ...faq, category }))
  )

  const groupedFaqData = filteredFaqData.reduce((acc, faq) => {
    const { category, ...rest } = faq
    return {
      ...acc,
      [category]: [...(acc[category] || []), rest],
    }
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Stack spacing={8}>
        <Card sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} elevation={0}>
          <CardContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Typography variant='h5' color='primary.main' textAlign={"center"}>
              <b>Witaj, jak możemy Ci pomóc?</b>
            </Typography>
            <Typography variant='subtitle1' color='text.primary' textAlign={"center"}>
              możesz wybrać już dostępne najpopularniejsze pytania lub skontaktować się z nami
            </Typography>

            <TextField
              value={searchText}
              onChange={handleSearchTextChange}
              variant='outlined'
              size='large'
              sx={{ width: "100%", maxWidth: "750px", marginTop: "20px" }}
              placeholder='Wyszukaj pytanie'
              InputProps={{
                startAdornment: <Search />,
              }}
            />
          </CardContent>
        </Card>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'
                variant='scrollable'
                scrollButtons
                allowScrollButtonsMobile
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { width: "0" },
                    "@media (max-width: 900px)": {
                      "&.Mui-disabled": { opacity: 0.3, width: "40px" },
                    },
                  },
                }}>
                {Object.keys(faqData).map((category) => (
                  <Tab key={category} label={category} value={category} />
                ))}
              </TabList>
            </Box>
            {Object.entries(groupedFaqData).map(([category, faqs]) => (
              <TabPanel key={category} value={category}>
                {faqs.map((faq, index) => (
                  <Accordion key={index} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </TabPanel>
            ))}
          </TabContext>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "60px", marginBottom: "30px" }}>
          <Typography variant='h5' color='primary.main' textAlign='center' mt={1} mb={1}>
            Chcesz nas o coś zapytać?
          </Typography>
          <Typography variant='subtitle2' textAlign='center' mb={2}>
            jeśli nie możesz znaleźć pytania w naszym FAQ, zawsze możesz się z nami skontaktować
          </Typography>
          <Button
            variant="contained"
            color='primary'
            sx={{marginBottom:'15px'}}
            onClick={() => {
              navigate("/helpdesk/new")
            }}>
            Stwórz zgłoszenie
          </Button>
        </Box>
      </Stack>
    </motion.div>
  )
}

export default Faq
