"use client";

import {
  AdminPanelSettings,
  CalendarMonth,
  Domain,
  EmojiPeople,
  Groups,
  Home,
  InsertLink,
  LocalCafe,
  PersonAdd,
  RecentActors,
  TableRows,
} from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Component } from "react";
import { cybTheme } from "../themeCYB";

export const DrawerItems = [
  { id: "home",                 path: "home",                           name: "Home",         icon: <Home/> },
  { id: "volunteering",         path: "volunteering",                   name: "Volunteering", icon: <EmojiPeople/>,
    children: [
      { id: "becomeVolunteer",  path: "volunteering/becomeVolunteer",   name: "Become Volunteer",   icon: <PersonAdd/> },
      { id: "groups",           path: "volunteering/groups",            name: "Groups",             icon: <Groups/> },
      { id: "members",          path: "volunteering/members",           name: "Members",            icon: <RecentActors/> },
      { id: "workLogs",         path: "volunteering/workLogs",          name: "Work Logs",          icon: <TableRows/> },
    ]
   },
  { id: "cybEscape",            path: "cybEscape",                      name: "-CYB / Escape", icon: <Domain/>,
    children: [
      { id: "about CYB",        path: "volunteering/becomeVolunteer",   name: "Become Volunteer",   icon: <PersonAdd/> },
      { id: "about Escape",     path: "volunteering/groups",            name: "Groups",             icon: <Groups/> },
      { id: "Boardmembers",     path: "volunteering/members",           name: "Members",            icon: <RecentActors/> },
   ]
  },
  { id: "cafeBar",              path: "cafeBar",                        name: "-Café / Bar",   icon: <LocalCafe/> },
  { id: "calendar",             path: "calendar",                       name: "-Calendar",     icon: <CalendarMonth/> },
  { id: "other",                path: "other",                          name: "-Other",        icon: <InsertLink/> },
  { id: "admin",                path: "admin",                          name: "Admin",        icon: <AdminPanelSettings/> },
];

export class DrawerItemElement extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { elem, pathname, drawerOpen, setCollapsed } = this.props;

    let isSelected =
      pathname == `/${elem.path}` || `${pathname}`.includes(elem.path);

    let item = (
      <ListItem
        key={`link_item_${elem.id}`}
        sx={{ display: "block" }}
        disablePadding
      >
        <ListItemButton
          key={`link_item_button_${elem.id}`}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            key={`link_item_icon_${elem.id}`}
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 3 : "auto",
              justifyContent: "center",
              color: isSelected ? cybTheme.palette.secondary.main : "",
            }}
          >
            {elem.icon}
          </ListItemIcon>
          <ListItemText
            key={`link_item_text_${elem.id}`}
            sx={{
              opacity: drawerOpen ? 1 : 0,
              color:
                pathname == `/${elem.path}`
                  ? cybTheme.palette.secondary.main
                  : cybTheme.palette.text.primary,
            }}
            // disableTypography
            primary={elem.name}
          />
        </ListItemButton>
      </ListItem>
    );

    return elem.children ? (
      <Card
        key={`link_${elem.id}`}
        style={{
          textDecoration: "none",
          color: isSelected ? cybTheme.palette.secondary.main : "",
          backgroundColor: cybTheme.palette.background.default,
        }}
        elevation={0}
        // elevation={1}
      >
        <CardActionArea
          key={`link_actionWrapper_${elem.id}`}
          onClick={() => setCollapsed(elem.id)}
        >
          {item}
        </CardActionArea>
      </Card>
    ) : (
      <Link
        key={`link_${elem.id}`}
        // passHref
        href={`/pages/${elem.path}`}
        style={{
          textDecoration: "none",
        }}
      >
        {item}
      </Link>
    );
  }
}
