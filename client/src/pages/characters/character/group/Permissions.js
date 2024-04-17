import React, { useContext } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import { Card, Stack, CardContent, FormControl, FormControlLabel, Checkbox, Typography } from "@mui/material"
import { AuthContext } from "../../../../context/AuthContext"
import { makeRequest } from "../../../../axios"
import { useState } from "react"
import { useEffect } from "react"

function Permissions({ businessId, items, sendNotification }) {
  const { currentUser } = useContext(AuthContext)
  const [data, setData] = useState([])

  useEffect(() => {
    setData(items)
  }, [items])
  

  const handleChangePermission = async (event, item) => {
    if (currentUser.admin_level > 0) {
      const response = await makeRequest.post("groups/editPermission", {
        businessId,
        permissionId: item.id,
        access: !item.access,
      })
      if (response.status === 200) {
        setData((prevState) => {
          const updatedData = prevState.map((permission) => {
            if (permission.id === item.id) {
              return { ...permission, access: response.data };
            }
            return permission;
            
          })

          return updatedData;
        })
      }
    }

    event.preventDefault()
  }

  return (
    <Stack spacing={1}>
      <Typography variant='body1'>Lista dostępnych uprawnień</Typography>
      <Card elevation={0}>
        <CardContent>
          <Grid container spacing={2}>
            {data.map((item, index) => (
              <Grid key={index} xs='auto'>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.access}
                        onClick={(event) => {
                          handleChangePermission(event, item)
                        }}
                      />
                    }
                    label={item.name}
                  />
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default Permissions
