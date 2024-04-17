import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@mui/styles"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import HoverPopover from "material-ui-popup-state/HoverPopover"
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state"
import MenuItem from "@mui/material/MenuItem"

const styles = (theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing.unit,
  },
})

const HoverPopoverPopupState = ({ theme, routeItem, title, data, navigate }) => (
  <PopupState variant='popover' popupId='demoPopover'>
    {(popupState) => (
      <div>
        <Button
          {...bindHover(popupState)}
          variant={window.location.pathname.search(routeItem) >= 1 ? "contained" : "text"}
          sx={{
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "500",
            borderRadius: "21px",
            paddingX: "22px",
            ...(window.location.pathname.search(routeItem) >= 1 ? { color: "white", background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})` } : {color: 'text.primary'}),
          }}>
          {title}
        </Button>
        <HoverPopover
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          elevation={0}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
            },
          }}>
          <Box
            sx={{
              width: "fit-content",
              border: "1px solid",
              borderRadius: "6px",
              borderColor: "divider",
              marginTop: "20px",
              paddingTop: "6px",
              paddingBottom: "6px",
              backgroundColor: "background.paper",
            }}>
            {data.map((item, index) => (
              <MenuItem
                sx={
                  window.location.pathname === item.route
                    ? {
                        background: window.location.pathname.search(routeItem) >= 1 ? `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})` : null,
                        color: "white",
                      }
                    : null
                }
                key={index}
                onClick={() => {
                  navigate(item.route)
                  popupState.close()
                }}>
                {item.title}
              </MenuItem>
            ))}
          </Box>
        </HoverPopover>
      </div>
    )}
  </PopupState>
)

HoverPopoverPopupState.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(HoverPopoverPopupState)
