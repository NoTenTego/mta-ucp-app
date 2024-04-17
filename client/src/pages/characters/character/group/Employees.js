import React, { useEffect, useState } from "react"
import { Box, Paper, Stack, Typography, alpha } from "@mui/material"
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridToolbarColumnsButton, GridToolbarFilterButton, GridRowModes, GridRowEditStopReasons, gridClasses, plPL } from "@mui/x-data-grid"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import { makeRequest } from "../../../../axios"

function getTimeAgoString(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  const timeDiff = now.getTime() - date.getTime()
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (timeDiff < 0) {
    return `przed chwilą`
  }

  if (seconds < 60) {
    return `${seconds} sekund temu`
  } else if (minutes < 60) {
    return `${minutes} minut temu`
  } else if (hours < 24) {
    return `${hours} godzin temu`
  } else {
    return `${days} dni temu`
  }
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

function Employees({ theme, businessId, data, sendNotification }) {
  const [rowModesModel, setRowModesModel] = useState({})
  const [rows, setRows] = useState(data)
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const actionColumn = {
      field: "actions",
      type: "actions",
      headerName: "Funkcje",
      width: 150,
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
            <GridActionsCellItem key={id} icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='error' />,
          ]
        }

        return [
          <GridActionsCellItem key={id} icon={<EditIcon />} label='Edit' className='textPrimary' onClick={handleEditClick(id)} color='inherit' />,
          <GridActionsCellItem key={id} icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='error' />,
        ]
      },
    }

    const staticColumns = [
      {
        field: "username",
        headerName: "Gracz",
        width: 300,
      },
      {
        field: "charactername",
        headerName: "Dane osobowe",
        width: 300,
        valueFormatter: (params) => {
          return params.value.replace("_", " ")
        },
      },
      {
        field: "rank",
        headerName: "Ranga",
        width: 250,
        editable: true,
        valueFormatter: (params) => {
          const foundCharacter = rows.find((row) => row.id === params.id)
          return foundCharacter.rankName
        },
      },
      {
        field: "lastActive",
        headerName: "Ostatnio aktywny",
        width: 170,
        valueFormatter: (params) => {
          return getTimeAgoString(params.value)
        },
      },
    ]

    setColumns([{ field: "id", headerName: "ID", width: 100 }, ...staticColumns, actionColumn])
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeleteClick = (id) => () => {
    setRows((oldRows) => oldRows.filter((row) => row.id !== id))

    makeRequest.post("groups/deleteEmployee", { characterId: id, businessId })
  }

  const processRowUpdate = async (newRow) => {
    try {
      const response = await makeRequest.post("groups/editEmployee", {
        businessId,
        rank: newRow.rank,
        employeeId: newRow.id,
      })

      newRow.rank = response.data.rank
      newRow.rankName = response.data.rankName

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
    <Stack spacing={1}>
      <Typography variant='body1'>Lista osób w grupie</Typography>
      <Box sx={{ height: "387px" }} component={Paper} elevation={0}>
        <DataGrid
          sx={{
            border: "none",
            [`& .${gridClasses.row}.even`]: {
              backgroundColor: alpha(theme.palette.background.paper, 0.2),

              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.2),
              },
            },
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
          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
          slots={{
            toolbar: (props) => <CustomToolbar {...props} rows={rows} />,
          }}
          slotProps={{
            toolbar: { columns, setColumns, rowModesModel, setRowModesModel },
          }}
          initialState={{
            ...rows.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </Stack>
  )
}

export default Employees
