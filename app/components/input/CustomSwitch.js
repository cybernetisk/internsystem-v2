
import { Switch } from "@mui/material";
import styled from "styled-components";

export const CustomSwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(5px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(25px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'primary.main',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 32,
    height: 32,
  },
}));

