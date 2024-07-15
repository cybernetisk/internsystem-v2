
"use client"

import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { randomBytes } from "crypto";
import Link from "next/link";
import { useState } from "react";

export default function registerPage() {
  
  const [firstName, setFirstName] = useState("Eric");
  const [lastName, setLastName] = useState("Svebakk");
  const [email, setEmail] = useState("ericatsvebakk@gmail.com")
  const [response, setResponse] = useState("")
  
  const handleRegister = async () => {
    
    const debug = false
    
    try {
      let existingUser;
      let newUser;
      let activateToken;
      
      await prismaRequest({
        model: "user",
        method: "find",
        request: {
          where: {
            email: email,
          },
        },
        callback: (data) => existingUser = data.data.length > 0 ? data.data[0] : null
      });
      
      if (debug) console.log("User exists?", !!existingUser, existingUser);
      
      // Check if user exists
      if (!!existingUser) {
        setResponse("Email already exists in database");
        return
      }
      
      await prismaRequest({
        model: "user",
        method: "create",
        request: {
          data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
          },
        },
        callback: (data) => newUser = data.data != undefined ? data.data : null
      });
      
      if (debug) console.log("User created?", !!newUser, newUser);
      
      // Check if user is created
      if (!newUser) {
        setResponse("Unable to create user");
        return;
      }
      
      await prismaRequest({
        model: "activateToken",
        method: "create",
        request: {
          data: {
            token: `${randomBytes(32).toString("hex")}`,
            userId: newUser.id,
          },
        },
        callback: (data) => activateToken = data.data != undefined ? data.data : null
      })
      
      if (debug) console.log("Activate token created?", !!activateToken, activateToken);

      // Check if user is created
      if (!activateToken) {
        setResponse("Unable to create activate token");
        return;
      }

      fetch("/api/sendVerification/", {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: newUser,
          activateToken: activateToken,
        }),
      })
      .then((data) => {
        if (debug) console.log(data);
        setResponse("User created! Please verify your Email");
      });
      
      
    } catch (error) {
      setResponse(`${error}`);
      console.error(error)
    }
    
  }
  
  return (
    <Box>
      <Grid
        container
        spacing={2}
        direction="column"
        padding={4}
        width={{ xs: "100vw", md: "30vw" }}
      >
        <Grid item>
          <Typography variant="h6">Register new user</Typography>
        </Grid>

        {CheckedTextField("First name", firstName, setFirstName)}
        {CheckedTextField("Last name", lastName, setLastName)}
        {CheckedTextField("Email", email, setEmail)}

        <Grid item>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleRegister()}
          >
            Register
          </Button>
        </Grid>

        <Grid item container direction="row" justifyContent="flex-end">
          <Link
            href="/pages/auth/signIn"
            passHref
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Typography
              variant="subtitle1"
              color={{ color: cybTheme.palette.primary.main }}
            >
              Log in
            </Typography>
          </Link>
        </Grid>

        <Grid item>
          <Typography variant="caption">
            {response != "" ? (
              response
            ) : (
              <Skeleton
                animation={false}
                variant="text"
                sx={{ bgcolor: "inherit" }}
              />
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
  
}

const CheckedTextField = (title, textValue, textCallback) => {
  
  return (
    <Grid item>
      <TextField
        fullWidth
        required
        variant="filled"
        label={title}
        value={textValue}
        onChange={(event) => textCallback(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  );
  
}