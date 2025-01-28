
"use client"

import { Avatar, Box, CssBaseline, Paper, Stack, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { cybTheme } from "@/app/components/themeCYB";
import Link from "next/link";
import cybLogo from "./../../icon.png";
import Image from "next/image";

export default function AuthLayout({ children }) {

  
  
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={cybTheme}>
          <Box sx={{ p:2, px:3 }}>
            <Link href={`/`}>
              <Avatar
                sx={{
                  height: 45,
                  width: 45,
                }}
              >
                <Image src={cybLogo} alt="cyb logo" fill />
              </Avatar>
            </Link>
          </Box>
          <Box
            sx={{
              position: "relative",
              width: "100%",
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
                  <SessionProvider basePath="/api/v2/auth">{children}</SessionProvider>
                </Paper>
              </Stack>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  ); 
}