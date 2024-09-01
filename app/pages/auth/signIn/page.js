
"use client"

import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { cybTheme } from "./../../../components/themeCYB";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { normalizeEmail } from "./../../../components/Login/authUtil";


export default function SignInPage() {
  
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState(false)
  
  const session = useSession()
  const router = useRouter()
   
  if (session.status == "authenticated") {
    router.push("/pages/main/home");
    return;
  }
  
  const handleLogin = async () => {
    
    if (email == "") {
      setError(true)
      setResponse("Please fill in your email")
      return
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    const response = await signIn("email", {
      email: normalizedEmail,
      redirect: false,
    });
    
    if (response.error == null) {
      setError(false)
      setResponse(`Email sent to ${normalizedEmail}`);
    }
    else {
      setError(true);
      setResponse(response.error);
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
          <Typography variant="h6">Log in</Typography>
        </Grid>

        <Grid item>
          <TextField
            required
            fullWidth
            variant="filled"
            label="email"
            value={email}
            error={error}
            onChange={(event) => setEmail(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item>
          <Button fullWidth variant="contained" onClick={() => handleLogin()}>
            Send magic link
          </Button>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Link
            href="/pages/auth/register"
            passHref
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Typography
              variant="caption"
              color={cybTheme.palette.primary.main}
            >
              Register new user
            </Typography>
          </Link>
        </Grid>

        <Grid item container>
          <Typography variant="subtitle1" >
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
