"use client";

import "./../../globals.css";

import { Coffee, EmojiPeople, Groups, Home, PersonAdd } from "@mui/icons-material";
import { Box, CssBaseline, Container, Breadcrumbs } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";
import { NavBarOffset, NavBar } from "@/app/components/layout/AppBar";
import { cybTheme } from "@/app/components/themeCYB";
import WebsiteBreadcrumbs from "@/app/components/layout/Breadcrumbs";
import LayoutFooter from "@/app/components/layout/Footer";

const NavItems = [
  { id: "home", path: "home", name: "Home", icon: <Home /> },
  { id: "aboutCYB", path: "aboutCYB", name: "About CYB", icon: <Groups /> },
  { id: "aboutEscape", path: "aboutEscape", name: "About Escape", icon: <Coffee /> },
  { id: "volunteering", path: "volunteering", name: "Volunteering", icon: <EmojiPeople /> },
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
    link: "https://wiki.cyb.no",
  },
  {
    name: "Github",
    value: "cybernetisk",
    link: "https://github.com/cybernetisk",
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
              maxWidth="lg"
              sx={{
                backgroundColor: cybTheme.palette.background.paper,
                height: "auto",
              }}
            >
              <NavBarOffset />

              <Container sx={{ p: 2, minHeight: "100vh" }}>
                <Box sx={{ backgroundColor: "rgba(0,0,0, 0.2)" }}>
                  <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
                </Box>

                <Container sx={{ my: 3, px: 0 }} disableGutters>
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
