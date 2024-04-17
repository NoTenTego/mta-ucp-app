import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import Stats from "./Stats"
import Items from "./Items"
import Vehicles from "./Vehicles"
import Interiors from "./Interiors"
import { Box, Divider, Typography, tabsClasses } from "@mui/material"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import { makeRequest } from "../../../axios"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import Group from "./group/Group"

function Character({ theme }) {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [value, setValue] = React.useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const fetchCharacterData = async () => {
    try {
      const response = await makeRequest.post("characters/getCharacterData", { id: id })
      if (response.data) {
        setData(response.data)
      } else {
        setData(false)
      }
    } catch (error) {
      console.log(error);
      setData(false)
    }
  }

  useEffect(() => {
    fetchCharacterData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (data === false) {
    return <Typography variant='h5'>Niestety nie posiadasz permisji, aby zobaczyć tą postać.</Typography>
  }

  return (
    <>
      {data !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}>
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
                <Tab label='Informacje o postaci' value='1' />
                {data.businesses.map((business, index) => (
                  <Tab key={index + 2} label={business.name} value={String(index + 2)} />
                ))}
              </TabList>
            </Box>
            <TabPanel value='1' sx={{ padding: "0", paddingTop: "25px" }}>
              <Grid container spacing={3}>
                <Grid xs='auto' sx={{ flexGrow: 1 }}>
                  <Stats character={data.characters} />
                </Grid>
                <Grid sx={{ flexGrow: 5 }}>
                  <Items items={data.items} />
                </Grid>
                {data.vehicles.length > 0 ? (
                  <>
                    <Grid xs='auto' sx={{ width: "100%" }}>
                      <Divider></Divider>
                    </Grid>
                    {data.vehicles.map((vehicle, index) => (
                      <Grid key={index} xs='auto' sx={{ flexGrow: 1, maxWidth: "400px" }}>
                        <Vehicles vehicle={vehicle} />
                      </Grid>
                    ))}
                  </>
                ) : null}
                {data.interiors.length > 0 ? (
                  <>
                    <Grid xs='auto' sx={{ width: "100%" }}>
                      <Divider></Divider>
                    </Grid>
                    {data.interiors.map((interior, index) => (
                      <Grid key={index} xs='auto' sx={{ flexGrow: 1, maxWidth: "400px" }}>
                        <Interiors interior={interior} />
                      </Grid>
                    ))}
                  </>
                ) : null}
              </Grid>
            </TabPanel>
            {data.businesses.map((business, index) => (
              <TabPanel key={index + 2} value={String(index + 2)} sx={{ padding: "0", paddingTop: "25px" }}>
                <Group theme={theme} business={business} />
              </TabPanel>
            ))}
          </TabContext>
        </motion.div>
      ) : null}
    </>
  )
}

export default Character
