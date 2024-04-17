import * as React from "react"
import { Card, CardContent, Stack, Typography } from "@mui/material"
import { DataGrid, plPL } from "@mui/x-data-grid"
import { makeRequest } from "../../axios"

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "fullName",
    headerName: "Dane osobowe",
    width: 200,
  },
  {
    field: "hours",
    headerName: "Godziny",
    width: 130,
  },
  {
    field: "ping",
    headerName: "Ping",
    type: "number",
    width: 130,
  },
]

function Players() {
  const [rows, setRows] = React.useState([])

  const fetchAllCharacters = async () => {
    const response = await makeRequest.get("dashboard/getAll")
    if (response.data) {
      setRows(response.data)
    }
  }

  React.useEffect(() => {
    fetchAllCharacters()
  }, [])

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant='body1'>Lista osób dostępnych w grze</Typography>
          <DataGrid
            sx={{ minHeight: "418px" }}
            rows={rows}
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
  )
}

export default Players
