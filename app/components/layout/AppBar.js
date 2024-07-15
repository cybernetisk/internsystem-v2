
"use client"

import {
  AppBar as MuiAppBar,
  styled,
  Toolbar,
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Grid,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Component } from "react";
import { cybTheme } from "./../themeCYB";
import cybLogo from "./../../icon.png";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "../Login/LoginButton";
import { useRouter } from "next/navigation";

export class NavBar extends Component {
  render() {
    const { currentPath, navItems } = this.props;

    // const router = useRouter();
    
    return (
      <AppBar position="absolute">
        <Toolbar sx={{  }}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Avatar sx={{
                height: 45,
                width: 45,
                
              }}>
                <Image src={cybLogo} alt="cyb logo" fill />
              </Avatar>
            </Grid>
            
            
            <Grid item container md xs justifyContent="flex-end" pr={2}>
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex",  } }}>
                {navItems.map((item) => NavItemElement(item, currentPath))}
              </Box>

              <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none",  } }}>
                {navItems.map((item) => NavIconElement(item, currentPath))}
              </Box>
            </Grid>
            
            
            <Grid item>
              <Box sx={{
                
                // marginLeft: "auto"
              }}>
                <SessionProvider>
                  <LoginButton />
                </SessionProvider>
              </Box>
            </Grid>
          </Grid>

        </Toolbar>
      </AppBar>
    );
  }
}

export const NavBarOffset = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  backgroundColor: cybTheme.palette.background.default,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function NavItemElement(item, currentPath) {

  if (item) {
    return (
      <Link
        key={`link_${item.id}`}
        href={`/pages/main/${item.path}`}
        // passHref
        style={{ textDecoration: "none" }}
      >
        <ListItem key={`link_item_${item.id}`} disablePadding>
          <ListItemButton key={`link_item_button_${item.id}`}>
            <ListItemText
              key={`link_item_text_${item.id}`}
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
    <ListItem>
      <ListItemText primary={"undefined"} />
    </ListItem>
  );
}

function NavIconElement(item, currentPath, router) {
  
  // const router = useRouter()
  
  if (item) {
    return (
      <Link
        key={`link_${item.id}`}
        href={`/pages/main/${item.path}`}
        // passHref
        style={{ textDecoration: "none" }}
      >
        <IconButton size="large">
          <Avatar sx={{ width: 30, height: 30 }}>
            {item.icon}
          </Avatar>
        </IconButton>
      </Link>
    );
  }
  
}
