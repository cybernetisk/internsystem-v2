
"use client"

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/app/components/sanity/PageBuilder";

export default function UnauthorizedPage() {
  
  return (
    <Box>
      <PageHeader text={"Unauthorized"} variant={"h4"}/>
      <Typography>Please login to view the requested page.</Typography>
    </Box>
  );
}