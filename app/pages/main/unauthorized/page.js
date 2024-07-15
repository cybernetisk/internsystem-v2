import { Box, Divider, Typography } from "@mui/material";

export default function UnauthorizedPage() {
  
  return (
    <Box>
      <Typography variant="h4">Unauthorized</Typography>
      <Divider sx={{ mb: 4 }}></Divider>
      
      <Typography>Please login to view the requested page.</Typography>
    </Box>
  );
}