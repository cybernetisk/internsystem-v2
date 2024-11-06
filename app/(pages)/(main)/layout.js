
"use client";

import "./../../globals.css";

import { EmojiPeople, Groups, Home } from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Container,
  ThemeProvider,
  Paper,
} from "@mui/material";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NavBar } from "@/app/components/layout/AppBar";
import { cybTheme } from "@/app/components/themeCYB";
import LayoutFooter from "@/app/components/layout/Footer";

const NavItems = [
  { id: "home", path: "", name: "Home", icon: <Home /> },
  { id: "aboutCYB", path: "aboutCYB", name: "About CYB", icon: <Groups /> },
  {
    id: "volunteering",
    path: "volunteering",
    name: "Volunteering",
    icon: <EmojiPeople />,
  },
];

export default async function AppLayout({ children }) {
  
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={cybTheme}>
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
            <NavBar currentPath={pathname} navItems={NavItems} />

            <Container
              maxWidth="lg"
              component={Paper}
              elevation={1}
              square
              sx={{
                minHeight: "100vh",
                p: 2,
                boxShadow: 0
              }}
            >
              <Container sx={{ mb: 3 }}>
                <SessionProvider 
                basePath="/api/v2/auth"
                refetchOnWindowFocus={false}
                >{children}</SessionProvider>
              </Container>
            </Container>
          </Box>
          <LayoutFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
