
"use client"

import {
  AppBar,
  styled,
  Toolbar,
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Grid2,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Component, useState } from "react";
import { cybTheme } from "./../themeCYB";
import cybLogo from "./../../icon.png";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "../Login/LoginButton";
import { CafeOpen } from "./CafeOpen";

export class NavBar extends Component {
  render() {
    const { currentPath, navItems } = this.props;
    
    const iconProps = {
      mt: 0.5
    };

    return (
      <AppBar sx={{ position: { xs: "relative", md: "relative" } }}>
        <Toolbar>
          {/* Mobile layout */}
          <Grid2
            container
            direction="column"
            size="grow"
            sx={{
              display: {md: "none" },
              alignContent: "center",
              justifyContent: "space-between"
            }}
          >
            <Grid2
              container
              direction="row"
              // size="grow"
              sx={{
                width: "100%",
                display: { md: "none" },
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              {navItems.map((item, i) => (
                <Grid2 size="grow" key={`nav${i}`}>
                  {NavElementSmallScreen(item, i, iconProps, currentPath)}
                </Grid2>
              ))}
              <Grid2 size="grow">
                <SessionProvider basePath="/api/v2/auth">
                  <LoginButton currentPath={currentPath} iconProps={iconProps} />
                </SessionProvider>
              </Grid2>
            </Grid2>
            <Grid2 container size="grow" sx={{alignItems: "center", justifyContent: "center"}}>
              <SessionProvider basePath="/api/v2/auth">
                <CafeOpen/>
              </SessionProvider>
            </Grid2>
          </Grid2>

          {/* Computer layout */}
          <Grid2
            container
            direction="row"
            size="grow"
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Grid2>
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
            </Grid2>
            
            <Grid2 pl={5} container sx={{
              alignItems: "center"
            }}>
              <SessionProvider basePath="/api/v2/auth">
                <CafeOpen/>
              </SessionProvider>
            </Grid2>
            
            <Grid2 container size="grow" sx={{justifyContent:"flex-end"}} pr={2}>
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                {navItems.map((item, i) =>
                  NavElementLargeScreen(item, i, currentPath)
                )}
              </Box>
            </Grid2>

            <Grid2 size={{sx:{ flexShrink: 1 }}}>
              <SessionProvider basePath="/api/v2/auth">
                <LoginButton />
              </SessionProvider>
            </Grid2>
          </Grid2>
        </Toolbar>
      </AppBar>
    );
  }
}

function NavElementLargeScreen(item, index, currentPath) {

  if (item) {
    return (
      <Link
        key={`link_nav${index}`}
        href={`/${item.path}`}
        style={{ textDecoration: "none" }}
      >
        <ListItem key={`link_nav${index}_item`} disablePadding>
          <ListItemButton key={`link_nav${index}_itembutton`}>
            <ListItemText
              key={`link_nav${index}_itemtext`}
              sx={{
                color:
                  currentPath === `/${item.path}`
                    ? cybTheme.palette.primary.main
                    : cybTheme.palette.text.primary,
              }}
              primary={item.name}
            />
          </ListItemButton>
        </ListItem>
      </Link>
    );
  }

  return (
    <ListItem key={`link_nav${index}_item`}>
      <ListItemText key={`link_nav${index}_itemtext`} primary={"undefined"} />
    </ListItem>
  );
}

function NavElementSmallScreen(item, index, iconProps, currentPath) {
  
  if (item) {
    return (
      <Link
        key={`link_snav${index}`}
        href={`/${item.path}`}
        style={{ textDecoration: "none" }}
        sx={{ width: "100%" }}
      >
        <ListItem key={`link_snav${index}_item`} disablePadding>
          <ListItemButton key={`link_snav${index}_item_button`} sx={{ p: 1 }}>
            <Stack
              key={`link_snav${index}_stack`}
              direction="column"
              alignItems="center"
              width="100%"
            >
              <Avatar
                key={`link_snav${index}_avatar`}
                sx={iconProps}
              >
                {item.icon}
              </Avatar>
              <ListItemText
                key={`link_snav${index}_itemtext`}
                sx={{
                  color:
                    currentPath === `/${item.path}`
                      ? cybTheme.palette.primary.main
                      : cybTheme.palette.text.primary,
                    textAlign: "center"
                }}

                primary={
                  <Typography key={`link_snav${index}_typography`} variant="caption">
                    {item.name === "About CYB" ? "About" : item.name}
                  </Typography>
                }
              />
            </Stack>
          </ListItemButton>
        </ListItem>
      </Link>
    );
  }

  return (
    <ListItem key={`link_snav_${index}`}>
      <ListItemText key={`link_snav${index}_itemtext`} primary={"undefined"} />
    </ListItem>
  );
}

export const NavBarOffset = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // backgroundColor: cybTheme.palette.background.default,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));