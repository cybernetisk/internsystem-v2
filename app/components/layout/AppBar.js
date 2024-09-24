
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
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Component } from "react";
import { cybTheme } from "./../themeCYB";
import cybLogo from "./../../icon.png";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "../Login/LoginButton";

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
          <Grid
            container
            direction="row"
            alignContent="flex-end"
            justifyContent="space-between"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            {navItems.map((item, i) => (
              <Grid item xs key={`nav${i}`}>
                {NavElementSmallScreen(item, i, iconProps, currentPath)}
              </Grid>
            ))}

            <Grid item xs>
              <SessionProvider>
                <LoginButton currentPath={currentPath} iconProps={iconProps} />
              </SessionProvider>
            </Grid>
          </Grid>

          {/* Computer layout */}
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Grid item>
              <Link href={`/pages/main/home`}>
                <Avatar
                  sx={{
                    height: 45,
                    width: 45,
                  }}
                >
                  <Image src={cybLogo} alt="cyb logo" fill />
                </Avatar>
              </Link>
            </Grid>

            <Grid item container md xs justifyContent="flex-end" pr={2}>
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                {navItems.map((item, i) =>
                  NavElementLargeScreen(item, i, currentPath)
                )}
              </Box>
            </Grid>

            <Grid item>
              <SessionProvider>
                <LoginButton />
              </SessionProvider>
            </Grid>
          </Grid>
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
        href={`/pages/main/${item.path}`}
        style={{ textDecoration: "none" }}
      >
        <ListItem key={`link_nav${index}_item`} disablePadding>
          <ListItemButton key={`link_nav${index}_itembutton`}>
            <ListItemText
              key={`link_nav${index}_itemtext`}
              sx={{
                color:
                  currentPath == `/pages/main/${item.path}`
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
        href={`/pages/main/${item.path}`}
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
                    currentPath == `/pages/main/${item.path}`
                      ? cybTheme.palette.primary.main
                      : cybTheme.palette.text.primary,
                }}
                primary={
                  <Typography key={`link_snav${index}_typography`} variant="caption">
                    {item.name == "About CYB" ? "About" : item.name}
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