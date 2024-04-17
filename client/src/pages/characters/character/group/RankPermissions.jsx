import * as React from "react"
import { Divider, Button, ListItemIcon, ListItemText, Grid, List, Card, CardHeader, ListItem, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a, b) {
  return [...a, ...not(b, a)]
}

function RankPermissions({ rank, items, handleSavePermissions }) {
  const [checked, setChecked] = React.useState([])
  const [left, setLeft] = React.useState([])
  const [right, setRight] = React.useState([])
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const availableItems = items.filter((item) => item.access === true)

    const leftItems = availableItems.filter((item) => item.used === false)
    setLeft(leftItems)

    const rightItems = availableItems.filter((item) => item.used === true)
    setRight(rightItems)
  }, [items])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const customList = (title, items) => (
    <Card elevation={0}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 300,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component='div'
        role='list'>
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`

          return (
            <ListItem key={value.id} role='listitem' button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          )
        })}
      </List>
    </Card>
  )

  return (
    <>
      <Button variant='outlined' onClick={handleClickOpen}>
        Ustawienia
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          elevation: 0,
        }}>
        <DialogTitle id='alert-dialog-title'>{"Lista dostępnych uprawnień"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent='center' alignItems='center'>
            <Grid item>{customList("Dostępne", left)}</Grid>
            <Grid item>
              <Grid container direction='column' alignItems='center'>
                <Button sx={{ my: 0.5 }} variant='outlined' size='small' onClick={handleCheckedRight} disabled={leftChecked.length === 0} aria-label='move selected right'>
                  &gt;
                </Button>
                <Button sx={{ my: 0.5 }} variant='outlined' size='small' onClick={handleCheckedLeft} disabled={rightChecked.length === 0} aria-label='move selected left'>
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList("Wybrane", right)}</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined'>
            Anuluj
          </Button>
          <Button autoFocus variant='contained' onClick={() => {
            handleSavePermissions(rank, right)
            handleClose()
            }}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RankPermissions
