
"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "@/app/components/sanity/PageBuilder"
import authWrapper from "@/app/middleware/authWrapper"
import prismaRequest from "@/app/middleware/prisma/prismaRequest"
import { signOut, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function ProfilePage() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  
  const session = useSession();
  const router = useRouter()
  
  const userRoles = session.data.user.roles.map((e) => e.name);
  
  // queries database for user data
  useEffect(() => {
    if (session.data != undefined) {
      setFirstName(session.data.user.firstName)
      setLastName(session.data.user.lastName)
      // setEmail(session.data.user.email)
    }
  }, [session])
  
  const handleUpdateData = () => {
    
    prismaRequest({
      model: "user",
      method: "update",
      request: {
        where: {
          email: session.data.user.email
        },
        data: {
          // email: email,
          firstName: firstName,
          lastName: lastName,
        }
      }
    })
    
  }
  
  const buttonProps = {
    fullWidth: true,
    variant: "outlined"
  }
  
  return (
    <Box>
      <PageHeader text={"Profile"} variant={"h4"}/>

      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="space-between"
      >
        <Grid item container xs={12} md={3} direction="column" spacing={2} mb={8}>
          {CheckedTextField("First name", firstName, setFirstName)}
          {CheckedTextField("Last name", lastName, setLastName)}
          {/* {CheckedTextField("Email", email, setEmail)} */}
          <Grid item>
            <Button {...buttonProps} onClick={handleUpdateData}>
              Update
            </Button>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={3} direction="column" spacing={2}>
          <Grid item>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Roles:
                </Typography>

                {userRoles.map((e) => (
                  <Typography key={e} variant="body1">
                    {e}
                  </Typography>
                ))}

                <Typography variant="body1">
                  {userRoles.length == 0 ? "none" : ""}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item>{AdminRedirectButton(session, router, buttonProps)}</Grid>
          <Grid item>
            <Button {...buttonProps} onClick={() => signOut()}>
              sign out
            </Button>
          </Grid>

          {/* <Grid item mt={8}>
            <Button {...buttonProps} color="error" onClick={() => signOut()}>
              Delete account
            </Button>
          </Grid> */}
        </Grid>

      </Grid>
    </Box>
  );
}

const AdminRedirectButton = (session, router, buttonProps) => {
  
  const userRoles = session.data.user.roles.map((e) => e.name)
  
  if (!userRoles.includes("admin")) return
  
  return (
    <Button {...buttonProps} onClick={() => router.push("admin")}>
      Admin settings
    </Button>
  );
}

const CheckedTextField = (title, textValue, textCallback) => {
  
  return (
    <Grid item>      
      <TextField
        fullWidth
        variant="outlined"
        label={title}
        value={textValue}
        onChange={(event) => textCallback(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  );
};

export default authWrapper(ProfilePage, "", "home")