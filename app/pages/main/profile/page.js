
"use client"

import authWrapper from "@/app/middleware/authWrapper"
import { prismaRequest } from "@/app/middleware/prisma/prismaRequest"
import { Avatar, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function ProfilePage() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const session = useSession();
  const router = useRouter()
  
  const userRoles = session.data.user.roles.map((e) => e.name);
  
  // queries database for user data
  useEffect(() => {
    if (session.data != undefined) {
      setFirstName(session.data.user.firstName)
      setLastName(session.data.user.lastName)
      setEmail(session.data.user.email)
    }
  }, [session])
  
  return (
    <Stack direction="column" spacing={8}>
      <Typography variant="h4">Profile</Typography>

      <Stack direction="row" justifyContent="space-between">
        <Stack
          direction="column"
          spacing={2}
          // maxWidth={250}
          // sx={{ border: "1px solid red" }}
        >
          {CheckedTextField("First name", firstName, setFirstName)}
          {CheckedTextField("Last name", lastName, setLastName)}
          {CheckedTextField("Email", email, setEmail)}
          <Button variant="outlined">Update</Button>
        </Stack>

        <Stack direction="column" spacing={1}
          // sx={{ border: "1px solid red" }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Roles:</Typography>
              
              {userRoles.map((e) => <Typography key={e} variant="body1">{e}</Typography>)}
              
              <Typography variant="body1">
                {userRoles.length == 0 ? "none": ""}
              </Typography>
            </CardContent>
            
          </Card>
          
          
          
          {AdminRedirectButton(session, router)}
        </Stack>
      </Stack>

      <Button onClick={() => signOut()} variant="outlined">
        sign out
      </Button>
    </Stack>
  );
}

const AdminRedirectButton = (session, router) => {
  
  const userRoles = session.data.user.roles.map((e) => e.name)
  
  if (!userRoles.includes("admin")) return
  
  return (
    <Button variant="outlined" onClick={() => router.push("admin")}>
      Admin settings
    </Button>
  );
}

const CheckedTextField = (title, textValue, textCallback) => {
  
  return (
    <TextField
      variant="outlined"
      label={title}
      value={textValue}
      onChange={(event) => textCallback(event.target.value)}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default authWrapper(ProfilePage)