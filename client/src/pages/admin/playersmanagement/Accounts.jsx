/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react"
import { Box, Paper } from "@mui/material"
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridToolbarColumnsButton, GridToolbarFilterButton, GridRowModes, GridRowEditStopReasons, gridClasses, plPL } from "@mui/x-data-grid"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import { makeRequest } from "../../../axios"
function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

function Accounts({sendNotification}) {
  const [rowModesModel, setRowModesModel] = useState({})
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])

  const fetchItemlist = async () => {
    try {
      const response = await makeRequest.get("admin/getAccounts")
      if (response.data) {
        setRows(response.data)
      }
    } catch (error) {
      sendNotification("error", "Coś poszło nie tak..", error.message)
    }
  }

  useEffect(() => {
    fetchItemlist()
  }, [])

  useEffect(() => {
    const actionColumn = {
      field: "actions",
      type: "actions",
      headerName: "Funkcje",
      width: 80,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
          ]
        }

        return [<GridActionsCellItem key={id} icon={<EditIcon />} label='Edit' className='textPrimary' onClick={handleEditClick(id)} color='inherit' />]
      },
    }

    const staticColumns = [
      {
        field: "username",
        headerName: "Nazwa użytkownika",
        flex:1,
        editable: true,
      },
      {
        field: "hours",
        headerName: "Godziny w grze",
        width: 300,
      },
      {
        field: "ban",
        headerName: "Status",
        width: 200,
        editable: true,
        valueFormatter: (params) => {
          return params.value == 1 ? "Konto zbanowane" : ""
        },
      },
      {
        field: "beta",
        headerName: "Beta testy",
        width: 200,
        valueFormatter: (params) => {
          return params.value == 1 ? "Brał udział" : ""
        },
      },
    ]

    setColumns([actionColumn, { field: "id", headerName: "ID", width: 100 }, ...staticColumns])
  }, [rows, rowModesModel])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const processRowUpdate = async (newRow) => {
    try {
      await makeRequest.post("admin/editAccount", {
        id: newRow.id,
        ban: newRow.ban,
        username: newRow.username,
      })

      setRows((oldRows) => oldRows.map((row) => (row.id === newRow.id ? newRow : row)))

      return newRow
    } catch (error) {
      sendNotification("error", "Coś poszło nie tak..", error.response.data)
      return
    }
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
    <Box component={Paper} elevation={0} sx={{ marginBottom: "25px" }}>
      <DataGrid
        sx={{
          border: "none",
          [`& .${gridClasses.row}:hover`]: {
            backgroundColor: "unset",
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
        }}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
        editMode='row'
        disableColumnMenu
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={() => {}}
        slots={{
          toolbar: (props) => <CustomToolbar {...props} rows={rows} />,
        }}
        slotProps={{
          toolbar: { columns, setColumns, rowModesModel, setRowModesModel },
        }}
        initialState={{
          ...rows.initialState,
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10]}
      />
    </Box>
  )
}

export default Accounts
