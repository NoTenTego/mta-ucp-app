import React, { useEffect, useState } from "react"
import { Box, Button, Paper, Stack, Typography, alpha } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { DataGrid, GridToolbarContainer, GridFooterContainer, GridActionsCellItem, GridToolbarColumnsButton, GridToolbarFilterButton, GridRowModes, GridRowEditStopReasons, gridClasses, plPL } from "@mui/x-data-grid"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import { formatMoney } from "../../../../components/Utils"
import RankPermissions from "./RankPermissions"
import { makeRequest } from "../../../../axios"

function EditToolbar(props) {
  const { rows, setRows, rowModesModel, setRowModesModel } = props

  const handleClick = () => {
    for (const id in rowModesModel) {
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.View },
      }))
    }

    const newId = "temp"

    setRows((oldRows) => [...oldRows, { id: newId, isNew: true }])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Stwórz nową rangę
      </Button>
    </GridToolbarContainer>
  )
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  )
}

function CustomFooter(props) {
  return (
    <GridFooterContainer>
      <EditToolbar {...props} />
    </GridFooterContainer>
  )
}

function Ranks({ theme, businessId, data, sendNotification }) {
  const [rowModesModel, setRowModesModel] = useState({})
  const [rows, setRows] = useState(data)
  const [columns, setColumns] = useState([])

  const handleSavePermissions = (rank, permissions) => {
    makeRequest
      .post("groups/updateRankPermissions", { businessId, permissions, rankId: rank.id })
      .then((response) => {
        setRows((oldRows) =>
          oldRows.map((row) => {
            if (row.id === rank.id) {
              return {
                ...row,
                permissions: response.data,
              }
            }
            return row
          })
        )
      })
      .catch((error) => {
        sendNotification("error", "chuj", error.response.data)
      })
  }

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
      { field: "name", headerName: "Nazwa", width: 300, editable: true },
      {
        field: "payday",
        headerName: "Zarobki",
        width: 200,
        editable: true,
        valueFormatter: (params) => {
          return formatMoney(params.value)
        },
      },
      {
        field: "permissions",
        headerName: "Uprawnienia",
        width: 200,
        renderCell: (params) => {
          const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit

          if (!isInEditMode) {
            if (params.value && params.value.length > 0) {
              return (
                <>
                  {params.value
                    .filter((value) => value.used === true)
                    .map((value, index, array) => (
                      <span key={value.id}>
                        {value.id}
                        {index < array.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </>
              )
            }
          } else {
            if (params.value && params.value.length > 0) {
              return <RankPermissions rank={params.row} items={params.value} handleSavePermissions={handleSavePermissions} />
            }
          }

          return null
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

    makeRequest.post("groups/deleteRank", { id: id })
  }

  const processRowUpdate = async (newRow) => {
    let updatedRow = { ...newRow, isNew: false }

    try {
      if (newRow.isNew) {
        // nowa ranga
        const response = await makeRequest.post("groups/makeNewRank", {
          businessId,
          name: newRow.name,
          payday: newRow.payday,
        })

        updatedRow = {
          ...newRow,
          isNew: false,
          permissions: response.data.businessPermissions,
          id: response.data.insertId,
        }

        setRows((oldRows) => oldRows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      } else {
        await makeRequest.post("groups/editRank", {
          id: newRow.id,
          name: newRow.name,
          payday: newRow.payday,
        })

        updatedRow = { ...newRow, isNew: false }
        setRows((oldRows) => oldRows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      }

      return updatedRow
    } catch (error) {
      if (newRow.isNew) {
        sendNotification("error", "Coś poszło nie tak..", error.response.data)
      } else {
        sendNotification("error", "Coś poszło nie tak..", error.response.data)
      }

      throw error
    }
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
    <Stack spacing={1}>
      <Typography variant='body1'>Lista dostępnych rang</Typography>
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
            footer: (props) => <CustomFooter {...props} rows={rows} />,
          }}
          slotProps={{
            toolbar: { columns, setColumns, rowModesModel, setRowModesModel },
            footer: { rows, setRows, rowModesModel, setRowModesModel },
          }}
        />
      </Box>
    </Stack>
  )
}

export default Ranks
