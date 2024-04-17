/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react"
import { Box, Paper, Button, Chip } from "@mui/material"
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridToolbarColumnsButton, GridToolbarFilterButton, GridRowModes, GridRowEditStopReasons, gridClasses, plPL } from "@mui/x-data-grid"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom"
import { makeRequest } from "../../../axios"
function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

function Characters({ sendNotification }) {
  const [rowModesModel, setRowModesModel] = useState({})
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])

  const navigate = useNavigate()

  const fetchItemlist = async () => {
    try {
      const response = await makeRequest.get("admin/getCharacters")
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
        field: "settings",
        headerName: "Szczegóły",
        renderCell: (params) => {
          return (
            <Button
              variant='text'
              size='small'
              onClick={() => {
                navigate(`/characters/details/${params.id}`)
              }}>
              Przejdź
            </Button>
          )
        },
      },
      {
        field: "charactername",
        headerName: "Dane osobowe",
        width: 250,
        editable: true,
      },
      {
        field: "username",
        headerName: "Nazwa użytkownika",
        width: 250,
        valueGetter: (params) => {
          return params.value + ' (' + params.row.account + ')'
        }
      },
      {
        field: "class",
        headerName: "Klasa",
        width: 130,
        editable: true,
        type: "singleSelect",
        getOptionValue: (value) => value.code,
        getOptionLabel: (value) => value.name,
        valueOptions: [
          { code: 0, name: "Gangster" },
          { code: 1, name: "Biznesmen" },
          { code: 2, name: "Cywil" },
        ],
      },
      {
        field: "skincolor",
        headerName: "Kolor skóry",
        width: 130,
        editable: true,
        type: "singleSelect",
        getOptionValue: (value) => value.code,
        getOptionLabel: (value) => value.name,
        valueOptions: [
          { code: 0, name: "Ciemna" },
          { code: 1, name: "Biała" },
          { code: 2, name: "Jasna" },
        ],
      },
      {
        field: "gender",
        headerName: "Płeć",
        width: 130,
        editable: true,
        type: "singleSelect",
        getOptionValue: (value) => value.code,
        getOptionLabel: (value) => value.name,
        valueOptions: [
          { code: 0, name: "Mężczyzna" },
          { code: 1, name: "Kobieta" },
        ],
      },
      {
        field: "age",
        headerName: "Wiek",
        width: 90,
        editable: true,
        type: "number",
      },
      {
        field: "day",
        headerName: "Dzień ur.",
        width: 90,
        editable: true,
        type: "number",
      },
      {
        field: "month",
        headerName: "Miesiąc ur.",
        width: 100,
        editable: true,
        type: "number",
      },
      {
        field: "weight",
        headerName: "Waga",
        width: 90,
        editable: true,
        type: "number",
      },
      {
        field: "height",
        headerName: "Wzrost",
        width: 90,
        editable: true,
        type: "number",
      },
      {
        field: "active",
        headerName: "Status",
        width: 130,
        type: "number",
        renderCell: ({value}) => {
          return value === 1 ? <Chip label="aktywna" color="success" size="small" /> : <Chip label="nieaktywna" color="error" size="small"/>
        }
      },
    ]

    setColumns([actionColumn, { field: "id", headerName: "ID", width: 80 }, ...staticColumns])
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
      //await makeRequest.post("admin/editAccount", {
      //  id: newRow.id,
      //  ban: newRow.ban,
      //  username: newRow.username,
      //})

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
            outline: "none",
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

export default Characters
