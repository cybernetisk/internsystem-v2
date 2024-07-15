
"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
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
  };
  
  return (
    <Card sx={{ display: "flex", flexDirection: "row",  }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Stack
            spacing={2}
            direction="row"
            alignContent="center"
            alignItems="center"
          >
            {/* <Typography sx={{ flexGrow: 0 }}>
              {session.data != undefined ? "Logged in" : "Login"}
            </Typography> */}
            <Typography variant="body1" width="3em">
              {session.data != undefined ? "Profile" : "Login"}
            </Typography>

            {session.status == "authenticated" ? (
              <Avatar alt="Image of user" sx={{ ...avatarProps, bgcolor: cybTheme.palette.primary.main, p:1 }}>
                <Icon path={mdiPenguin} color={cybTheme.palette.background.main}/>
                {/* <icon component={mdiPenguin}/> */}
              </Avatar>
            ) : (
              <Avatar sx={{ ...avatarProps, bgcolor: cybTheme.palette.primary.main }}>
                <Person sx={{ color: cybTheme.palette.background.main }} />
              </Avatar>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
