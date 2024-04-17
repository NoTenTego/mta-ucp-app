import * as React from "react"
import { Card, CardContent, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { formatMoney } from "../../components/Utils"
import { makeRequest } from "../../axios"

const className = {
  0: 'Gangster',
  1: 'Biznesmen',
  2: 'Cywil'
}

const columns = [
  { field: "id", headerName: "Miejsce", width: 90 },
  {
    field: "fullName",
    headerName: "Dane osobowe",
    width: 200,
  },
  {
    field: "bankMoney",
    headerName: "Stan konta",
    width: 150,
    valueGetter: (params) => formatMoney(params.row.bankMoney),
  },
  {
    field: "class",
    headerName: "Klasa postaci",
    type: "number",
    width: 110,
    valueGetter: (params) => {
      return className[params.value]
    }
  },
]

function TopPlayers() {
  const [rows, setRows] = React.useState([])

  const fetchAllStats = async () => {
    const response = await makeRequest.get("dashboard/getTopPlayers");
    if (response.data) {
      // Numerujemy wiersze od 1 do 10
      const numberedRows = response.data.map((row, index) => ({
        ...row,
        id: index + 1,
      }));
  
      setRows(numberedRows);
    }
  };

  React.useEffect(() => {
    fetchAllStats()
  }, [])

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant='body1'>Top 10 najbogatszych graczy</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            density='compact'
          />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TopPlayers
