import {
    TextField,
    InputAdornment,
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
            <InputAdornment
                position="end"
                onClick={() => {
                setValue("");
                document.querySelector(`input[name="${name}"]`).focus();
                }}
            >✗</InputAdornment>
            ),
        }}
        {...this.props}
        />
    );
  }
}