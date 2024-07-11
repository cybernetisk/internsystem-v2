
"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { Person } from "@mui/icons-material";
import { cybTheme } from "../themeCYB";
import { useRouter } from "next/navigation";
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
  
  // console.log("AvatarMenu: session", session);
  
  // 
  // useEffect(() => {
  //   if (session.status == "authenticated") {
  //     setFirstName(session.data.user.firstName);
  //   }
  // }, [session]);

  return (
    <Card sx={{ display: "flex", flexDirection: "row" }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Stack
            spacing={2}
            direction="row"
            alignContent="center"
            alignItems="center"
          >
            <Typography>{session.data != undefined ? session.data.user.firstName : "Login"}</Typography>

            {false ? (
              <Avatar alt="Image of user" src={""} />
            ) : (
              <Avatar sx={{ bgcolor: cybTheme.palette.primary.main }}>
                <Person sx={{ color: cybTheme.palette.background.main }} />
              </Avatar>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
