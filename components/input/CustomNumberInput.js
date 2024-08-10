
import { TextField } from "@mui/material";
import { Component } from "react";

export default class CustomNumberInput extends Component {
  render() {
    const { label, value, setValue, check, error } = this.props;

    return (
      <TextField
        label={label}
        size="small"
        InputLabelProps={{ shrink: true }}
        value={value}
        error={error}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          const value = check(e.target.value) ? 0 : e.target.value;
          const float = parseFloat(value);
          const rounded = Math.round(float * 100);
          setValue(rounded / 100);
        }}
        onChange={(e) => {
          const value = e.target.value;
          if (value != "") {
            if (check(value)) return;
          }
          setValue(value);
        }}
      />
    );
  }
}