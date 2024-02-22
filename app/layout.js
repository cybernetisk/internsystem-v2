"use client";

import "./globals.css";
import { ChevronRight, Menu } from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  List,
  Container,
  Breadcrumbs,
  Collapse,
  Card,
} from "@mui/material";

import { DrawerHeader, Drawer, AppBar } from "./components/Drawer/Drawer";
import { DrawerItemElement, DrawerItems } from "./components/Drawer/DrawerItems";
import { Suspense, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";
import { cybTheme } from "./components/themeCYB";

import UserAvatarMenu from "./components/Login/UserAvatarMenu";
// import Loading from "./pages/volunteering/groups/loading";
import WebsiteBreadcrumbs from "./components/Breadcrumbs";


export default function RootLayout({ children }) {
  
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const pathname = usePathname();
  const breadcrumbs = WebsiteBreadcrumbs("", pathname);

  // Creates state for collapsible menu-items
  useEffect(() => {
    let tempDict = {};
    for (const item of DrawerItems) {
      tempDict[item.id] = `${pathname}`.includes(`${item.path}`);
    }

    setCollapsed(tempDict);
  }, [pathname]);

  /**
   * Open/closes sidemenu
   */
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  /**
   * Opens selected menu and collapses rest
   * @param {*} id ID of menu-item
   */
  const collapseHandler = (id) => {
    let temp = {};
    Object.keys(collapsed).forEach((v) => {
      temp[v] = v == id ? !collapsed[v] : false;
    });

    setCollapsed(temp);
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={cybTheme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            
            <AppBar position="fixed" open={drawerOpen}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => toggleDrawer()}
                  sx={{
                    marginRight: 5,
                    ...(drawerOpen && { display: "none" }),
                  }}
                >
                  <Menu />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  Internsystem V2
                </Typography>
                
                <SessionProvider>
                  <UserAvatarMenu />
                </SessionProvider>
              </Toolbar>
            </AppBar>

            <Drawer
              variant="permanent"
              open={drawerOpen}
              style={{ display: "flex", backgroundColor: "purple" }}
            >
              <DrawerHeader>
                <IconButton onClick={() => toggleDrawer()}>
                  <ChevronRight />
                </IconButton>
              </DrawerHeader>

              <List
                style={{
                  flexGrow: "1",
                  backgroundColor: cybTheme.palette.background.default,
                }}
              >
                {DrawerItems.map((item) => (
                  <div key={`drawer_item_container_${item.id}`}>
                    <DrawerItemElement
                      elem={item}
                      pathname={pathname}
                      drawerOpen={drawerOpen}
                      setCollapsed={collapseHandler}
                    />
                    {item.children ? (
                      <Collapse
                        key={`drawer_item_container_collapse_${item.id}`}
                        in={collapsed[item.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Card
                          key={`drawer_item_container_card_${item.id}`}
                          elevation={0}
                          // elevation={3}
                          sx={{
                            backgroundColor: cybTheme.palette.background.paper,
                          }}
                        >
                          {item.children.map((ec) => (
                            <DrawerItemElement
                              key={`drawer_item_element_${ec.id}`}
                              elem={ec}
                              pathname={pathname}
                              drawerOpen={drawerOpen}
                              setCollapsed={collapseHandler}
                            />
                          ))}
                        </Card>
                      </Collapse>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </List>

            </Drawer>

            <Container
              maxWidth="md"
              sx={{
                p: 0,
                backgroundColor: cybTheme.palette.background.default,
                height: "100%",
              }}
            >
              <DrawerHeader />

              <Container sx={{ p: 2, height: "100%" }}>
                <Breadcrumbs separator="›">{breadcrumbs}</Breadcrumbs>

                {/* generates header for static pages */}
                {/* <Typography variant="h3" component="h2" sx={{ py: 2 }}>
                  {`${pathname}`
                    .split("/")
                    .map((e) => Capitalize(e))
                    [`${pathname}`.split("/").length - 1].match(/[A-Z][a-z]+/g)
                    .join(" ")}
                </Typography> */}

                {/* <Suspense fallback={<Loading />}> */}
                  <SessionProvider>{children}</SessionProvider>
                {/* </Suspense> */}
                
              </Container>
            </Container>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
