

import {
  Avatar,
  Box,
  Card,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Person } from "@mui/icons-material";
import { cybTheme } from "../themeCYB";
import AccountSignIn from "./LoginButton";

export default function UserAvatarMenu() {
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const session = useSession();
  const name = session.data ? session.data.user.name : "";
  const image = session.data ? session.data.user.image : "";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        {image ? (
          <Avatar alt={name} src={image} />
        ) : (
          <Avatar sx={{ bgcolor: cybTheme.palette.secondary.main }}>
            <Person sx={{ color: cybTheme.palette.primary.main }} />
          </Avatar>
        )}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Card>
          {session.status == "authenticated" ? (
            <Stack
              direction="row"
              spacing={2}
              sx={{ m: 2, display: "flex" }}
              alignContent="center"
            >
              <Avatar
                alt={name}
                src={image}
                sx={{ m: 2, border: "3px solid black" }}
              />
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                {name}
              </Typography>
            </Stack>
          ) : (
            <></>
          )}

          <AccountSignIn />
        </Card>
      </Popover>
    </Box>
  );
}