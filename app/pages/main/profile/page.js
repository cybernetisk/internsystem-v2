
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
import prismaRequest from "@/app/middleware/prisma/prismaRequest"
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import CustomTable from "@/app/components/CustomTable";
import { signOut, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns";
import { getInitials } from "@/app/components/calendar/schedulerUtils";

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
  const userRoles = session.data.user.roles.map((e) => e.name);
  const recruiter = session.data.user.recruitedByUser;
  const usersRecruited = session.data.user.recruitedUsers?.length;
  
  useEffect(() => {
    if (!recruiter) {
      prismaRequest({
        model: "user",
        method: "find",
        callback: (data) => setUsers(data.data),
      });
    }
    prismaRequest({
      model: "user",
      method: "find",
      request: {
        where: {
          recruitedById: session.data.user.id,
        },
        include: {
          LoggedForUser: {
            include: {
              LoggedForUser: true,
              LoggedByUser: true,
            },
          },
        },
      },
      callback: (data) => {
        let newLogs = [];
        console.log(data.data);

        data.data.forEach((e) => {
          e.LoggedForUser.forEach((f) => {
            const p1 = f.LoggedByUser;
            const p2 = f.LoggedForUser;
            const p1name = p1 ? `${p1.firstName} ${p1.lastName}` : "";
            const p2name = p2 ? `${p2.firstName} ${p2.lastName}` : "";
            ;
            newLogs.push({
              ...f,
              loggedBy: getInitials(p1name),
              loggedFor: getInitials(p2name),
              workedAt_num: parseISO(f.workedAt).getTime(),
              workedAt: format(
                parseISO(f.workedAt),
                "dd.MM HH:mm"
              ).toLowerCase(),
            });
          });
        });

        // console.log(newLogs);
        setRecruitHours(newLogs.reduce((sum, next) => sum += next.duration, 0))
        setRecruitLogs(newLogs);
      },
    });
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
    
    prismaRequest({
      model: "user",
      method: "update",
      request: {
        where: {
          email: session.data.user.email
        },
        data: {
          firstName: firstName,
          lastName: lastName,
        }
      }
    })
    
  }
  
  const handleConfirmSelection = async () => {
    await prismaRequest({
      model: "user",
      method: "update",
      request: {
        where: {
          email: session.data.user.email,
        },
        data: {
          recruitedById: selectedRecruiter.id,
        },
      },
    });
    window.location.reload()
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
  const userRoles = session.data.user.roles.map((e) => e.name)
  if (!userRoles.includes("admin")) return
  return (
    <Button {...buttonProps} onClick={() => router.push("admin")}>
      Admin Tools
    </Button>
  );
}

const BoardRedirectButton = (session, router, buttonProps) => {
  const userRoles = session.data.user.roles.map((e) => e.name);
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