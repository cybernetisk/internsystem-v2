
import { Autocomplete, Box, createFilterOptions, Paper, Stack, TextField, Typography } from "@mui/material";
import { Component } from "react";

export default class CustomMultiAutoComplete extends Component {
  render() {
    const {
      label,
      value,
      data,
      dataLabel,
      subDataLabel,
      allowAdding,
      callback,
      defaultValue,
      error,
      disable,
    } = this.props;
    
    let displayValue = [];
    if (defaultValue != undefined) {
      displayValue = defaultValue;
    } else if (value != undefined && value) {
      displayValue = value
    }
    
    const maxSuggestions = data ? Math.min(data.length, 10) : 10;
    const filterOptions = createFilterOptions();
    
    return (
      <Autocomplete
        multiple
        disabled={disable || defaultValue != undefined}
        size="small"
        fullWidth
        disablePortal
        value={displayValue}
        options={data}
        
        // when a dropdown item is selected
        onChange={(e, v) => {
          // console.log(v);
          callback(v);
          // if (typeof v == "string") {
          // } else {
          // }
        }}
        
        // when looking for an item
        filterOptions={(options, state) => {
          let newOptions = filterOptions(options, state).slice(
            0,
            maxSuggestions
          );

          if (allowAdding && state.inputValue != "") {
            let item = {
              [dataLabel]: `Add "${state.inputValue}"`,
              inputValue: state.inputValue,
              newOption: true,
            };

            newOptions.push(item);
          }

          return newOptions;
        }}
        
        // when matching value with dropdown item
        isOptionEqualToValue={(option, value) => {
          if (subDataLabel) {
            return option[subDataLabel] == value[subDataLabel];
          }
          return option[dataLabel] == value[dataLabel];
        }}
        
        // setting text for dropdown item
        getOptionLabel={(option) => {
          if (option.newOption) {
            return option.inputValue;
          }
          return option[dataLabel];
        }}
        
        // dropdown item element
        renderOption={(props, option) => {
          // console.log(props, option);
          return (
            <Box
              {...props}
              key={props.id}
              component="li"
              color="InfoBackground"
              // flexDirection="column"
              // alignContent="start"
              // alignItems="flex-start"
              // onClick={}
              // key={`option_box_${props.key}`}
            >
              <Stack direction="column" alignItems="start">
                <Typography
                  key={`option_box_name_${props.id}`}
                  // color="MenuText"
                >
                  {option[dataLabel]}
                </Typography>
                {subDataLabel ? (
                  <Typography
                    key={`option_box_email_${props.id}`}
                    variant="caption"
                    color="GrayText"
                  >
                    {option[subDataLabel]}
                  </Typography>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            InputLabelProps={{ shrink: true }}
            label={label}
          />
        )}
        PaperComponent={(props) => <Paper elevation={3} {...props} />}
      />
    );
  }
}