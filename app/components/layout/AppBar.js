
import {
  AppBar as MuiAppBar,
  styled,
  Toolbar,
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Component } from "react";
import { cybTheme } from "./../themeCYB";
import UserAvatarMenu from "../Login/UserAvatarMenu";
import cybLogo from "./../../icon.png";
import Image from "next/image";
import Link from "next/link";

const drawerWidth = 240;

export class NavBar extends Component {
  render() {
    const { currentPath, navItems } = this.props;

    return (
      <AppBar position="fixed">
        <Toolbar>
          <Avatar sx={{ marginRight: 5 }}>
            <Image src={cybLogo} alt="cyb logo" fill />
          </Avatar>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => NavItemElement(item, currentPath))}
          </Box>

          <SessionProvider>
            <UserAvatarMenu />
          </SessionProvider>
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
        href={`/pages/${item.path}`}
        // passHref
        style={{ textDecoration: "none" }}
      >
        <ListItem key={`link_item_${item.id}`} disablePadding>
          <ListItemButton key={`link_item_button_${item.id}`}>
            <ListItemText
              key={`link_item_text_${item.id}`}
              sx={{
                color:
                  currentPath == `/pages/${item.path}`
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
