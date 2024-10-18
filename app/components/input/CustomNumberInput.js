
import { TextField } from "@mui/material";
import { Component } from "react";

export default class CustomNumberInput extends Component {
  render() {
    const { label, value, setValue, check, error, className } = this.props;

    return (
      <TextField
        className={className}
        label={label}
        size="small"
        InputLabelProps={{ shrink: true }}
        value={value}
        error={error}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          let value = check(e.target.value) ? 0 : e.target.value;
          if (value === "") value = 0;
          const float = parseFloat(value);
          const rounded = Math.round(float * 10);
          setValue(rounded / 10);
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