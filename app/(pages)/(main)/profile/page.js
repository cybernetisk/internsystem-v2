
"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "@/app/components/sanity/PageBuilder"
import authWrapper from "@/app/middleware/authWrapper"
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const RECRUIT_TABLE_HEADERS = [
  { id: "workedAt", name: "work date", sortBy: "workedAt_num", flex: 2 },
  { id: "duration", name: "duration", flex: 1 },
  { id: "loggedBy", name: "log by", flex: 2 },
  { id: "loggedFor", name: "log for", flex: 2 },
];

function ProfilePage() {
  
  const session = useSession();
  const router = useRouter()
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [users, setUsers] = useState([]);
  const [recruitLogs, setRecruitLogs] = useState([]);
  const [recruitHours, setRecruitHours] = useState([]);
  
  const [selectedRecruiter, setSelectedRecruiter] = useState(
    session.data.user.RecruitedByUser
  );
  
  const email = session.data.user.email;
  const userRoles = session.data.user.roles;
  const recruiter = session.data.user.recruitedByUser;
  const usersRecruited = session.data.user.recruitedUsers?.length;
  
  useEffect(() => {
    if (!recruiter) {
      fetch("/api/v2/users")
      .then(res => res.json())
      .then(data => setUsers(data.users))
    }

    fetch(`/api/v2/users/${session.data.user.id}/recruitInfo`)
    .then(res => res.json())
    .then(data => {
      setRecruitHours(data.recruitHours)
    })
  }, []);
  
  // queries database for user data
  useEffect(() => {
    if (session.data != undefined) {
      setFirstName(session.data.user.firstName)
      setLastName(session.data.user.lastName)
      setSelectedRecruiter(recruiter);
    }
  }, [session])
  
  const handleUpdateData = () => {

    fetch(`/api/v2/users/${session.data.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    }).then(() => window.location.reload());

  }
  
  const handleConfirmSelection = () => {
    fetch(`/api/v2/users/${session.data.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recruitedById: selectedRecruiter.id,
      }),
    }).then(() => window.location.reload());

    
  }
  
    
  const buttonProps = {
    fullWidth: true,
    variant: "outlined",
  };
  
  return (
    <Box>
      <PageHeader text={"Profile"} variant={"h4"} />

      <Grid
        container
        direction="row"
        spacing={2}
        justifyContent="space-between"
      >
        <Grid
          item
          container
          direction={{ xs: "row", md: "column" }}
          xs={12}
          md={4}
          spacing={2}
        >
          <Grid item xs={12} md={5}>
            {section1({
              firstName,
              lastName,
              email,
              setFirstName,
              setLastName,
              handleUpdateData,
              buttonProps,
            })}
          </Grid>

          <Grid item xs={12} md={3}>
            {section2({
              userRoles,
              session,
              router,
              buttonProps,
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          {section3({
            recruitLogs,
            recruiter,
            users,
            usersRecruited,
            selectedRecruiter,
            setSelectedRecruiter,
            handleConfirmSelection,
            recruitedById: session.data.user.recruitedById,
            recruitHours,
          })}
        </Grid>
      </Grid>
    </Box>
  );
}

function section1(props) {  
  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent>
        <Grid container direction="column" spacing={2}>
          
          <Grid item md={4}>
            <Stack spacing={2}>
              <Typography variant="body1">User details</Typography>
              {CheckedTextField( "First name", props.firstName, props.setFirstName)}
              {CheckedTextField("Last name", props.lastName, props.setLastName)}
              {CheckedTextField("Email", props.email, () => {}, true)}
              <Button {...props.buttonProps} onClick={props.handleUpdateData}>
                Update
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
}

function section2(props) {
  return (
    <Grid container direction="column" rowGap={2} height="100%">
      <Grid item md>
        <Card elevation={3} sx={{ height: "100%" }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Roles:
                </Typography>

                {props.userRoles.map((e) => (
                  <Typography key={e} variant="body1">
                    {e}
                  </Typography>
                ))}

                <Typography variant="body1">
                  {props.userRoles.length == 0 ? "none" : ""}
                </Typography>
              </Box>
              {BoardRedirectButton(
                props.session,
                props.router,
                props.buttonProps
              )}
              {AdminRedirectButton(
                props.session,
                props.router,
                props.buttonProps
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item>
        <Button {...props.buttonProps} onClick={() => signOut()}>
          sign out
        </Button>
      </Grid>
    </Grid>
  );
}

function section3(props) {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card elevation={3}>
          <CardContent>
            <Stack direction="column" spacing={2}>
              <CustomAutoComplete
                label="Who recruited you?"
                dataLabel="firstName"
                subDataLabel="email"
                data={props.users}
                value={props.selectedRecruiter}
                callback={props.setSelectedRecruiter}
              />
              <Button
                variant="outlined"
                onClick={() => props.handleConfirmSelection()}
              >
                Confirm choice
              </Button>

              {props.usersRecruited && props.usersRecruited != 0 ? (
                <Typography>Your recruits: {props.usersRecruited}</Typography>
              ) : (
                <></>
              )}

              {props.usersRecruited && props.usersRecruited != 0 ? (
                <Typography>Recruit hours: {props.recruitHours}</Typography>
              ) : (
                <></>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

const AdminRedirectButton = (session, router, buttonProps) => {
  const userRoles = session.data.user.roles;
  if (!userRoles.includes("admin")) return
  return (
    <Button {...buttonProps} onClick={() => router.push("admin")}>
      Admin Tools
    </Button>
  );
}

const BoardRedirectButton = (session, router, buttonProps) => {
  const userRoles = session.data.user.roles;;
  if (!userRoles.includes("board")) return;
  return (
    <Button {...buttonProps} onClick={() => router.push("board")}>
      Board Tools
    </Button>
  );
};


const CheckedTextField = (title, textValue, textCallback, disabled=false) => {
  return (
    <TextField
      fullWidth
      disabled={disabled}
      variant="outlined"
      size="small"
      label={title}
      value={textValue}
      onChange={(event) => textCallback(event.target.value)}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default authWrapper(ProfilePage, "", "home")