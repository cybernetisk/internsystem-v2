
"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  // Icon,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { Person } from "@mui/icons-material";
import { cybTheme } from "../themeCYB";
import { useRouter } from "next/navigation";

import { mdiPenguin } from '@mdi/js';
import Icon from "@mdi/react";
import Link from "next/link";
// import { useEffect, useState } from "react";

export default function LoginButton(props) {
  
  const { currentPath, iconProps } = props;
  
  // console.log(currentPath)
  
  // const [firstName, setFirstName] = useState("");
  
  const router = useRouter();
  const session = useSession();
  
  const handleClick = (event) => {
    console.log("CLICK")
    if (session.status == "authenticated") {
      router.push("/pages/main/profile");
    } else {
      signIn();
    }
  };

  const avatarProps = {
    ...iconProps,
    p: 0.8,
    bgcolor: cybTheme.palette.primary.main,
  };
  
  const buttonText = () => {
    if (session.data != undefined) {
      return session.data.user.name.split(" ")[0]
    }
    return "Login"
  }
  
  return (
    <>
      {/* Mobile layout */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <ListItem key={`link_item_login`} disablePadding>
          <ListItemButton key={`link_item_button_login`} onClick={handleClick} sx={{ p: 1 }}>
            <Stack direction="column" alignItems="center" width="100%">
              
              <Avatar sx={avatarProps}>
                {session.status == "authenticated" ? (
                  <Icon
                    alt="Image of user"
                    path={mdiPenguin}
                    color={cybTheme.palette.background.main}
                  />
                ) : (
                  <Person color={cybTheme.palette.background.main} />
                )}
              </Avatar>

              <ListItemText
                key={`link_item_text_login`}
                sx={{
                  color:
                    currentPath == `/pages/main/profile`
                      ? cybTheme.palette.primary.main
                      : cybTheme.palette.text.primary,
                }}
                primary={
                  <Typography variant="caption">
                    {buttonText()}
                  </Typography>
                }
              />
            </Stack>
          </ListItemButton>
        </ListItem>
      </Box>

      {/* Computer layout */}
      <Card sx={{ display: { xs: "none", md: "block" } }}>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Stack
              spacing={2}
              direction="row"
              alignContent="center"
              alignItems="center"
            >
              <Typography
                variant="body1"
                // color={cybTheme.palette.text.secondary}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {buttonText()}
              </Typography>

              {session.status == "authenticated" ? (
                <Avatar alt="Image of user" sx={{ ...avatarProps }}>
                  <Icon
                    path={mdiPenguin}
                    color={cybTheme.palette.background.main}
                  />
                </Avatar>
              ) : (
                <Avatar sx={{ ...avatarProps }}>
                  <Person
                      color={cybTheme.palette.background.main}
                    // color= sx={{
                    //   color: cybTheme.palette.background.main
                    //   }}
                  />
                </Avatar>
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
