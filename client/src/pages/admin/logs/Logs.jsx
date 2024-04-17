import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@emotion/react";
import SelectVariants from "./SelectVariants";
import TextField from "@mui/material/TextField";
import InputSlider from "./InputSlider";
import { Divider, Button } from "@mui/material";
import { makeRequest } from "../../../axios";
import DataTable from "./DataTable";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import LinearProgress from "@mui/material/LinearProgress";

const sourceType = [
  { value: "source", name: "Źródło" },
  { value: "affected", name: "Zamieszany" },
  { value: "content", name: "Zawartość" },
];

const logsType = [
  { name: "Rozmowa IC", value: "7" },
  { name: "Rozmowa OOC", value: "8" },
  { name: "Chat /a", value: "3" },
  { name: "/me", value: "12" },
  { name: "/ame", value: "40" },
  { name: "/do", value: "14" },
  { name: "/pm", value: "15" },
  { name: "/gov", value: "16" },
  { name: "/don", value: "17" },
  { name: "/r", value: "9" },
  { name: "/f", value: "11" },
  { name: "/o", value: "18" },
  { name: "/s", value: "19" },
  { name: "/m", value: "20" },
  { name: "/w", value: "21" },
  { name: "/c", value: "22" },
  { name: "Chat Gamemasterów", value: "24" },
  { name: "Rozmowy telefoniczne", value: "29" },
  { name: "Komendy administracji", value: "4" },
  { name: "Zgłoszenia administracji", value: "38" },
  { name: "Ostrzeżenia anticheat", value: "5" },
  { name: "Spokrewnione z pojazdami", value: "6" },
  { name: "Spokrewnione z nieruchomościami", value: "37" },
  { name: "Transfer pieniędzy", value: "25" },
  { name: "Przenoszenie przedmiotów", value: "39" },
];

function Logs({ theme, user }) {
  const [rowLimit, setRowLimit] = useState(10);
  const [keyWord, setKeyWord] = useState("");
  const [logType, setLogType] = useState("");
  const [keyWordType, setKeyWordType] = useState("source");
  const [logsTable, setLogsTable] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await makeRequest.post(
        "logs/getLogs",
        {

          rowLimit,
          keyWord,
          logType,
          keyWordType,
        }
      );

      if (response.data.length > 0) {
        setLogsTable((oldArray) => [...oldArray, response.data]);
      } else {
        setOpenNotification(true);
        setNotificationText("Nie znaleziono żadnych logów.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyWordChange = (event) => {
    setKeyWord(event.target.value);
  };

  return (
    <motion.div
      id='portfolio'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ThemeProvider theme={theme}>
        <Grid
          container
          spacing={4}
        >
          <Grid>
            <SelectVariants
              label={"Typ słowa kluczowego"}
              data={sourceType}
              value={keyWordType}
              setValue={setKeyWordType}
            />
          </Grid>

          <Grid>
            <SelectVariants
              label={"Rodzaj logów"}
              data={logsType}
              value={logType}
              setValue={setLogType}
            />
          </Grid>

          <Grid>
            <TextField
              id='keyWord'
              label='Słowo kluczowe'
              variant='outlined'
              sx={{ minWidth: 220 }}
              onChange={handleKeyWordChange}
            />
          </Grid>

          <Grid>
            <InputSlider
              title={"Maks. ilość wyników"}
              step={1}
              min={1}
              max={200}
              value={rowLimit}
              setValue={setRowLimit}
            />
          </Grid>
          <Grid sx={{ width: "100%" }}>
            <Button
              sx={{ width: "100%", height: "50px" }}
              variant='contained'
              onClick={handleSubmit}
            >
              WYSZUKAJ LOGI
            </Button>
          </Grid>
          <Grid sx={{ width: "100%" }}>
            <Divider/>
          </Grid>

          <Grid sx={{ width: "100%" }}>
            {logsTable.map((element, index) => (
              <Accordion
                component={Paper}
                elevation={3}
                sx={{ width: "100%" }}
                key={index}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1a-content'
                >
                  <Typography>
                    Wyszukany wynik słowa kluczowego:{" "}
                    <b sx={{ backgroundColor: "red" }}>{element[0].content}</b>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <DataTable rows={element} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
        {isLoading ? <LinearProgress sx={{ marginTop: "16px" }} /> : null}
      </ThemeProvider>
    </motion.div>
  );
}

export default Logs;
