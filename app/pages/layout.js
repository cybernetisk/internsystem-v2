"use client";

import "./../globals.css";

import { EmojiPeople, Groups, Home, PersonAdd } from "@mui/icons-material";
import { Box, CssBaseline, Container, Breadcrumbs } from "@mui/material";
import { NavBarOffset, NavBar } from "../components/layout/AppBar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";
import { cybTheme } from "./../components/themeCYB";

import WebsiteBreadcrumbs from "../components/layout/Breadcrumbs";
import LayoutFooter from "../components/layout/Footer";

const NavItems = [
  { id: "home", path: "home", name: "Home", icon: <Home /> },
  { id: "aboutCYB", path: "aboutCYB", name: "About CYB", icon: <PersonAdd /> },
  { id: "aboutEscape", path: "aboutEscape", name: "About Escape", icon: <Groups /> },
  { id: "volunteering", path: "volunteering", name: "Volunteering", icon: <EmojiPeople /> },
  { id: "admin", path: "admin", name: "Admin", icon: <EmojiPeople /> },
];

const SocialMedia = [
  {
    name: "Instagram",
    value: "@cybernetisk",
    link: "https://www.instagram.com/cybernetisk/",
  },
  {
    name: "Facebook",
    value: "Cybernetisk Selskab",
    link: "https://www.facebook.com/cybernetisk",
  },
  {
    name: "wiki",
    value: "CYB",
    link: "https://wiki.cyb.no"
  },
];

export default function RootLayout({ children }) {

  const pathname = usePathname();
  const breadcrumbs = WebsiteBreadcrumbs(pathname, NavItems);

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
            <NavBar currentPath={pathname} navItems={NavItems} />

            <Container
              maxWidth="md"
              sx={{
                backgroundColor: cybTheme.palette.background.paper,
                height: "auto",
              }}
            >
              <NavBarOffset />

              <Container sx={{ p: 2, minHeight: "100vh" }}>
                <Breadcrumbs>{breadcrumbs}</Breadcrumbs>

                <Container sx={{ my: 6, px: 0 }} disableGutters>
                  <SessionProvider>{children}</SessionProvider>
                </Container>
              </Container>
              
            </Container>
          </Box>

          <LayoutFooter socialMedia={SocialMedia}/>
        </ThemeProvider>
      </body>
    </html>
  );
}
