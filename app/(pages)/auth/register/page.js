
"use client"

import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { normalizeEmail } from "@/app/components/Login/authUtil";
import Link from "next/link";
import { useState } from "react";

export default function registerPage() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState("")
  
  const debug = true;
  
  const handleRegister = async () => {

    if (!email.includes("@")) {
      setResponse("Email is invalid")
      return
    }
    
    const responseCUE = await checkUserExists(email, debug)
    
    if (!responseCUE.ok) {
      setResponse(responseCUE.error);
      return;
    }
      
    const responseCU = await createUser(firstName, lastName, email, debug);

    if (!responseCU.ok) {
      setResponse(responseCU.error)
      return;
    }
    
    const responseSVM = await sendVerificiationMail(
      responseCU.data.newUser,
      responseCU.data.activateToken,
      debug
    );
    
    if (!responseSVM.ok) {
      setResponse(responseSVM.error);
      return;
    } else {
      setResponse(`User created. Email sent to ${responseSVM.email}`);
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
            href="/auth/signIn"
            passHref
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Typography
              variant="caption"
              color={cybTheme.palette.primary.main}
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

// 
async function checkUserExists(email, debug) {
  
  const normalizedEmail = normalizeEmail(email);
  
  const response = await prismaRequest({
    model: "user",
    method: "find",
    request: {
      where: {
        email: normalizedEmail,
      },
    },
    debug: debug,
  });
  
  if (!response.ok) {
    return { ok: false, error: "Unable to connect to database" };
  } else if (response.data.length > 0) {
    return { ok: false, error: `${normalizedEmail} already exists in database` };
  }
  
  return {
    ok: true
  };
}

// 
async function createUser(firstName, lastName, email, debug) {
  
  const normalizedEmail = normalizeEmail(email);
  
  const response = await fetch("/api/createUser/", {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: normalizedEmail,
    }),
  });
  
  if (debug) console.log("createUser response:", response);
  
  if (!response.ok) {
    return { ok: false, error: response.error };
  }

  const data = await response.json();
  
  if (debug) console.log("createUser:", data);
  
  return { ok: true, ...data };
}

// 
async function sendVerificiationMail(newUser, activateToken, debug) {
  
  const response = await fetch("/api/sendVerification/", {
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
  
  if (debug) console.log("sendVerificiationMail response:", response);
  
  if (!response.ok) {
    return { ok: false, error: response.statusText };
  }
  
  const data = await response.json();
  
  if (debug) console.log("sendVerificiationMail:", data);
  
  return { ok: true, ...data };
}