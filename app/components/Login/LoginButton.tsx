
"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {Person} from "@mui/icons-material";
import {cybTheme} from "../themeCYB";

import {mdiPenguin} from '@mdi/js';
import Icon from "@mdi/react";
import Link from "next/link";
import {authClient} from "@/app/api/utils/auth-client";

export default function LoginButton(props) {

  const { currentPath, iconProps } = props;

  const session = authClient.useSession();

  const avatarProps = {
    ...iconProps,
    p: 0.8,
    bgcolor: cybTheme.palette.primary.main,
  };

  const buttonLink = session.data !== null ? "/profile" : "/auth/signIn";

  const buttonText = () => {
    if (session.data != undefined) {
      let firstName = session.data.user.name.split(" ")[0].replace('-', '‑')
      // Shorten the first name if it is longer than 15 characters
      if (firstName.length > 15) {
        firstName = firstName.slice(0, 12) + "..."
      }
      return firstName
    }
    return "Login"
  }

  return (
    <>
      {/* Mobile layout */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <ListItem key={`link_item_login`} disablePadding>
          <Link href={buttonLink}>

          <ListItemButton key={`link_item_button_login`} sx={{ p: 1 }}>
            <Stack direction="column" alignItems="center" width="100%">

              <Avatar sx={avatarProps}>
                {session.data != undefined ? (
                  <Icon

                    path={mdiPenguin}
                    color={cybTheme.palette.background.default}
                  />
                ) : (
                  <Person />
                )}
              </Avatar>

              <ListItemText
                key={`link_item_text_login`}
                sx={{
                  color:
                    currentPath == `/profile`
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
          </Link>
        </ListItem>
      </Box>

      {/* Computer layout */}
      <Card sx={{ display: { xs: "none", md: "block" } }}>
        <Link href={buttonLink}>


        <CardActionArea>
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

              {session.data != undefined ? (
                    <Avatar alt="Image of user" sx={{ ...avatarProps }}>
                      <Icon
                        path={mdiPenguin}
                        color={cybTheme.palette.background.default}
                      />
                </Avatar>
              ) : (


                  <Avatar sx={{...avatarProps}}>
                      <Person
                      />
                  </Avatar>
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
          </Link>
      </Card>
    </>
  );
}
