
"use client"

import { prismaRequest } from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { randomBytes, randomUUID } from "crypto";
// import { randomUUID } from "crypto";
import { useEffect, useState } from "react";

const prisma = new PrismaClient()

export default function registerPage() {
  
  const [firstName, setFirstName] = useState("Eric");
  const [lastName, setLastName] = useState("Svebakk");
  const [email, setEmail] = useState("ericatsvebakk@gmail.com")
  const [response, setResponse] = useState("")
  
  const handleRegister = async () => {
    
    try {
      
      const existingUser = await prismaRequest({
        model: "user",
        method: "find",
        request: {
          where: {
            email: email,
          },
        },
      });
      
      console.log("User exists?", !!existingUser, existingUser);
      
      // Check if user exists
      if (!!existingUser) {
        setResponse("Email already exists in database");
        return
      }
      
      const newUser = await prismaRequest({
        model: "user",
        method: "create",
        request: {
          data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
          },
        },
      });
      
      console.log("User created?", !!newUser, newUser);
      
      // Check if user is created
      if (!newUser) {
        setResponse("Unable to create user");
        return;
      }
      
      const activateToken = await prismaRequest({
        model: "activateToken",
        method: "create",
        request: {
          data: {
            token: `${randomBytes(32).toString("hex")}`,
            userId: newUser.id,
          },
        }
      })
      
      console.log("Activate token created?", !!activateToken, activateToken);

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
        console.log(data);
        setResponse("User created! Please verify your Email");
      });
      
      
    } catch (error) {
      setResponse(`${error}`);
      console.error(error)
    }
    
  }
  
  return (
    <Box>
      <Stack direction="column" spacing={1} padding={4}>
        <Typography variant="h6">Register new user</Typography>

        {CheckedTextField("First name", firstName, setFirstName)}
        {CheckedTextField("Last name", lastName, setLastName)}
        {CheckedTextField("Email", email, setEmail)}

        {/* <TextField
          variant="filled"
          label="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          InputLabelProps={{ shrink: true }}
        /> */}

        {/* <TextField
          variant="filled"
          label="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          variant="filled"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          InputLabelProps={{ shrink: true }}
        /> */}

        <Button variant="contained" onClick={() => handleRegister()}>
          Register
        </Button>

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
      </Stack>
    </Box>
  );
  
}

const CheckedTextField = (title, textValue, textCallback) => {
  
  return (
    <TextField
      required
      variant="filled"
      label={title}
      value={textValue}
      onChange={(event) => textCallback(event.target.value)}
      InputLabelProps={{ shrink: true }}
    />
  );
  
}