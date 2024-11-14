import {
    TextField,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import { Component } from "react";

export default class TextFieldWithX extends Component {
  render() {
    const { label, name, value, setValue} = this.props;

    return (
      <TextField
        variant="outlined"
        size="small"
        label={label}
        name={name}
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <Tooltip title="Clear">
              <InputAdornment
                  position="end"
                  onClick={() => {
                    setValue("");
                    document.querySelector(`input[name="${name}"]`).focus();
                  }}
                sx={{
                  cursor: 'pointer',
                  padding: 1.5,
                  margin: -1.5,
                }}
              >✗</InputAdornment>
            </Tooltip>
          ),
        }}
        {...this.props}
        />
    );
  }
}