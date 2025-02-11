import { Box, Divider, Typography } from "@mui/material";

export default function TraditionsPage() {
  
  return (
    <Box>
      <Typography variant="h4">songs</Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <iframe src="/sanghefte.pdf" width="100%" height="600px"></iframe>
    </Box>
  );
}