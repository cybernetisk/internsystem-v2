
"use client"

import { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { cybTheme } from "./../../../components/themeCYB";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function SignInPage() {
  
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState(false)
  
  const session = useSession()
  const router = useRouter()
  
  
  
  
  const handleLogin = async () => {
    
    if (email == "") {
      setError(true)
      setResponse("Please fill in your email")
      return
    }
    
    const response = await signIn("email", { email: email, redirect: false });
    
    if (response.error == null) {
      setError(false)
      setResponse("Email sent");
    }
    else {
      setError(true);
      setResponse(response.error);
    }
    
    console.log(response)
  }
  
  if (session.status == "authenticated") {
    router.push("/pages/main/home")
  }
  
  return (
    <Box>
      <Stack direction="column" spacing={1} padding={4}>
        
        <Typography variant="h6">Log in</Typography>

        <TextField
          required
          variant="filled"
          label="email"
          value={email}
          error={error}
          // helperText={error ? helperText : error}
          onChange={(event) => setEmail(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        
        <Button variant="contained" onClick={() => handleLogin()}>
          Send magic link
        </Button>
        
        <Stack direction="row" justifyContent="flex-end">
          {/* {TextButton("Forgot password", "/home")} */}
          {TextButton("Register", "/pages/auth/register")}
        </Stack>
        
        <Typography variant="caption">
          {response != "" ? response : <Skeleton animation={false} variant="text" sx={{ bgcolor: "inherit" }}/>}
        </Typography>
        
      </Stack>
    </Box>
  );
}

function TextButton(text, href) {
  return (    
    <Link href={href} passHref style={{ textDecoration: "none", cursor: "pointer" }}>
      <Typography variant="caption" color={{ color: cybTheme.palette.primary.main }}>
        {text}
      </Typography>
    </Link>
  )
}
