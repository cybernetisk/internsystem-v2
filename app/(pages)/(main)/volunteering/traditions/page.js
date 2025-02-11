import { Box, Divider, Typography } from "@mui/material";

export default function TraditionsPage() {
  
  return (
    <Box>
      <Typography variant="h4">Traditions</Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      {/* <Typography>links</Typography> */}
      <a href="traditions/song">sanghefte</a>
      <p></p>
      <a href="https://docs.google.com/spreadsheets/d/1U6t-q4Zi3yXnckOgN0bAnT4fbL4DnyWJIeIK1cQUOV0/edit?gid=1389238706#gid=1389238706">p2p</a>
    </Box>
  );
}