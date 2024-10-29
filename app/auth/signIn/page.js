
"use client"

import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
import { cybTheme } from "../../components/themeCYB";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { normalizeEmail } from "../../components/Login/authUtil";
import SnackbarAlert from "@/app/components/feedback/snackbarAlert";


export default function SignInPage() {
  
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState("")
  
  const session = useSession()
  const router = useRouter()
   
  if (session.status == "authenticated") {
    router.push("/");
    return;
  }
  
  const handleLogin = async () => {
    setLoading(true);
    
    if (email == "") {
      setError(true)
      setSeverity("error")
      setResponse("Please fill in your email")
      setLoading(false);
      setSnackbarOpen(true);
      return
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    const response = await signIn("email", {
      email: normalizedEmail,
      redirect: false,
    });
    
    if (response.error == null) {
      setError(false)
      setSeverity("success")
      setResponse(`Email sent to ${normalizedEmail}`);
      setLoading(false);
      setSnackbarOpen(true);
    } else {
      setError(true);
      setSeverity("error")
      setResponse(response.error);
      setLoading(false);
      setSnackbarOpen(true);
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
            onKeyUp={(e) => {if(e.key==="Enter") handleLogin()}}
          />
        </Grid>

        <Grid item>
          <Button 
            fullWidth
            variant="contained"
            onClick={() => handleLogin()}
            disabled={loading}
          >
            Send magic link
            {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}/>
          )}
          </Button>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Link
            href="/auth/register"
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
        <Grid item>
          <Typography variant="caption">
            {response != "" ? (
              <SnackbarAlert 
              open={snackbarOpen} 
              setOpen={setSnackbarOpen} 
              response={response}
              severity={severity}
              />
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
