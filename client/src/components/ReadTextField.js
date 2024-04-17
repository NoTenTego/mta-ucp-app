import { TextField } from "@mui/material"

export const ReadTextField = ({ label, value }) => {
  return (
    <TextField
      id='outlined-read-only-input'
      label={label}
      defaultValue={value}
      value={value}
      InputProps={{
        readOnly: true,
      }}
      multiline
      variant='standard'
      fullWidth
      sx={{
        "& .MuiInput-underline": { pointerEvents: "none" },
        "& .MuiInput-underline:before": { borderBottomColor: "text.secondary" },
      }}
    />
  )
}
