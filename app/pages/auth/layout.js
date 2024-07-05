
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
            <SessionProvider>
              
              <Box>
                <Stack
                  height="100%"
                  direction="column"
                  alignContent="center"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ minHeight: "100vh" }}
                  
                >
                  
                  <Paper sx={{ width: "30vw" }}>
                    
                    {/* <Stack direction="column" spacing={1} padding={4}> */}
                      {children}
                    {/* </Stack> */}
                  </Paper>
                </Stack>
              </Box>
              
            </SessionProvider>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  ); 
}