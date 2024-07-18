
import { Autocomplete, TextField } from "@mui/material";
import { Component } from "react";

export default class CustomAutoComplete extends Component {
  render() {
    const { label, value, data, dataLabel, callback, defaultValue, error } =
      this.props;
    
    let displayValue = null;
    if (defaultValue != undefined) {
      displayValue = defaultValue;
    } else if (value != undefined && value[dataLabel]) {
      displayValue = value[dataLabel]
    }
    
    return (
      <Autocomplete
        disabled={defaultValue != undefined}
        size="small"
        fullWidth
        disablePortal
        options={data.map((e) => e[dataLabel])}
        value={displayValue}
        onChange={(e, v) => {
          callback(data.filter((e) => e[dataLabel] == v)[0]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            InputLabelProps={{ shrink: true }}
            label={label}
          />
        )}
      />
    );
  }
}