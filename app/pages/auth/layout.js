
"use client"

import { Box, CssBaseline, Paper, Stack, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { cybTheme } from "@/app/components/themeCYB";

export default function AuthLayout({ children }) {

  
  
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={cybTheme}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              backgroundColor: cybTheme.palette.background.default,
              background: 'url("/olejohan.svg") ',
              backgroundSize: "100% auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top 10vh",
            }}
          >
            <CssBaseline />
              
            <Box>
              <Stack
                height="100%"
                direction="column"
                alignContent="center"
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "100vh" }} 
              >
                <Paper>
                  <SessionProvider> 
                    {children}
                  </SessionProvider>
                </Paper>
              </Stack>
            </Box>
              
          </Box>
        </ThemeProvider>
      </body>
    </html>
  ); 
}