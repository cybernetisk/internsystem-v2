
"use client"

import { prismaRequest } from "@/app/components/prisma/prismaRequest"
import { Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const session = useSession();
  const router = useRouter()
  
  if (session.status == "unauthenticated") {
    router.push("home")
  }
  
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
        >
          {CheckedTextField("First name", firstName, setFirstName)}
          {CheckedTextField("Last name", lastName, setLastName)}
          {CheckedTextField("Email", email, setEmail)}
          <Button variant="outlined">Update</Button>
        </Stack>

        <Stack direction="column">
          <Button variant="outlined" onClick={() => router.push("admin")}>
            Admin settings
          </Button>
        </Stack>
      </Stack>

      <Button onClick={() => signOut()} variant="outlined">
        sign out
      </Button>
    </Stack>
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