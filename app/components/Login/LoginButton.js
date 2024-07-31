
"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
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
// import { useEffect, useState } from "react";

export default function LoginButton() {
  
  // const [firstName, setFirstName] = useState("");
  
  const router = useRouter();
  const session = useSession();
  
  const handleClick = (event) => {
    if (session.status == "authenticated") {
      router.push("/pages/main/profile");
    } else {
      signIn();
    }
  };

  const avatarProps = {
    height: 45,
    width: 45,
    bgcolor: cybTheme.palette.primary.main,
  };
  
  
  
  return (
    <>
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
                width="3em"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {session.data != undefined ? "Profile" : "Login"}
              </Typography>

              {session.status == "authenticated" ? (
                <Avatar alt="Image of user" sx={{ ...avatarProps, p: 1 }}>
                  <Icon
                    path={mdiPenguin}
                    color={cybTheme.palette.background.main}
                  />
                </Avatar>
              ) : (
                <Avatar sx={{ ...avatarProps }}>
                  <Person sx={{ color: cybTheme.palette.background.main }} />
                </Avatar>
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      <Box sx={{ display: { xs: "block", md: "none" }, py:1 }}>
        <IconButton onClick={handleClick}>
          {session.status == "authenticated" ? (
            <Avatar alt="Image of user" sx={{ ...avatarProps, p: 1 }}>
              <Icon path={mdiPenguin} color={cybTheme.palette.background.main} />
            </Avatar>
          ) : (
            <Avatar sx={{ ...avatarProps }}>
              <Person sx={{ color: cybTheme.palette.background.main }} />
            </Avatar>
          )}
        </IconButton>
      </Box>
    </>
  );
}
