
"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import authWrapper from "@/app/middleware/authWrapper";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import Link from "next/link";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import { setTimeout } from "timers";
import { cybTheme } from "@/app/components/themeCYB";
import CustomTable from "@/app/components/CustomTable";
import { format, parseISO } from "date-fns";

const TABLE_HEADERS_LOGS = [
  { id: "workedAt", name: "Date", sortBy: "workedAt_num" },
  { id: "loggedBy", name: "Logged by" },
  { id: "duration", name: "duration" },
  { id: "description", name: "Description" },
];

function AdminPage(params) {
  
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleSettings, setShowRoleSettings] = useState(false);
  const [showLogSettings, setShowLogSettings] = useState(false);

  const [availableRoles, setAvailableRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [roleChangeResponse, setRoleChangeResponse] = useState("");

  useEffect(() => {
    fetch("/api/v2/roles")
    .then(res => res.json())
    .then(roles => {
      setRoles(roles.roles)
    })

    fetch("/api/v2/users")
    .then(res => res.json())
    .then((data) => {
      const users = data.users.map((e) => {
        return {
          ...e,
          name: `${e.firstName} ${e.lastName ? e.lastName : ""}`,
        };
      })
      setUsers(users)
    })
  }, []);
  
  useEffect(() => {
    if (selectedUser && showLogSettings) {    
      fetch(`/api/v2/users/${selectedUser.id}/workLogs`)
      .then(res => res.json())
      .then(data => {
        const newLogs = data.workLogs.map((e) => {
          const user = e.LoggedByUser;
          const name = user ? `${user.firstName} ${user.lastName}` : null;
          return {
            ...e,
            loggedBy: name,
            workedAt_num: parseISO(e.workedAt).getTime(),
            workedAt: format(
              parseISO(e.workedAt),
              "dd MMM 'kl.'HH:mm"
            ).toLowerCase(),
          };
        });
        
        setLogs(newLogs);
      })
    }
    
  }, [selectedUser, showLogSettings])

  function handleChangeUser(user)  {
    setSelectedUser(user);
  
    if (user !== null) {

      fetch(`/api/v2/users/${user.id}/roles`)
      .then(res => res.json())
      .then(data => {
        setAssignedRoles(data.userRoles)
        setAvailableRoles(roles.filter(e => !data.userRoles.includes(e)))
        if (roleChangeResponse !== "") setRoleChangeResponse("");
      })
      
    }
  }  

  return (
    <Box>
      <PageHeader text="Admin panel" variant="h4" />

      <Grid container direction="row" columnGap={2} rowGap={2}>
        {/* select user and settings */}
        <Grid item md={3} xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <CustomAutoComplete
                  label="Select user"
                  value={selectedUser}
                  callback={handleChangeUser}
                  data={users}
                  dataLabel="name"
                  subDataLabel="email"
                />

                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowRoleSettings(true);
                    setShowLogSettings(false);
                  }}
                >
                  Roles
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowLogSettings(true);
                    setShowRoleSettings(false);
                  }}
                >
                  Logs
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* selected settings */}
        <Grid item md xs={12}>
          {showRoleSettings ? (
            <Card elevation={3}>
              <CardContent>
                {roleSettings(
                  selectedUser,
                  availableRoles,
                  assignedRoles,
                  setAvailableRoles,
                  setAssignedRoles,
                  roleChangeResponse,
                  setRoleChangeResponse
                )}
              </CardContent>
            </Card>
          ) : (
            <></>
          )}

          {showLogSettings ? (
            <Card elevation={3}>
              <CardContent>{logSettings(logs)}</CardContent>
            </Card>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}


function roleSettings(
  selectedUser,
  availableRoles,
  assignedRoles,
  setAvailableRoles,
  setAssignedRoles,
  roleChangeResponse,
  setRoleChangeResponse
) {
  
  const handleSave = async () => {
    const response = await fetch("/api/v1/data/setRoles", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: selectedUser,
        roles: assignedRoles,
      }),
    });

    if (response.ok) {
      setRoleChangeResponse("Change successful");
      setTimeout(() => {
        setRoleChangeResponse("");
      }, 5000);
      
    } else {
      setRoleChangeResponse(`Error: ${response.error}`);
    }
    
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="body1">Roles</Typography>

      <Grid container columnGap={1} height="25vh">
        <Grid item xs>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography>Available roles</Typography>
              <Divider sx={{ mb: 2 }} />
              {selectedUser && availableRoles
                ? availableRoles.map((e, i) => {
                    return (
                      <Link
                        key={`availableRoles_link${i}`}
                        href="#"
                        onClick={() => {
                          setAssignedRoles([...assignedRoles, e]);
                          setAvailableRoles(
                            availableRoles.filter((f) => f !== e)
                          );
                        }}
                      >
                        <Typography 
                          key={`available_roles_typography${i}`}
                          sx={{
                            "&:hover": { color: cybTheme.palette.primary.main },
                          }}
                        >
                          {e}
                        </Typography>
                      </Link>
                    );
                  })
                : []}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography>Assigned roles</Typography>
              <Divider sx={{ mb: 2 }} />
              {selectedUser && assignedRoles
                ? assignedRoles.map((e, i) => {
                    return (
                      <Link
                        key={`assignedRoles_link${i}`}
                        href="#"
                        onClick={() => {
                          setAvailableRoles([...availableRoles, e]);
                          setAssignedRoles(
                            assignedRoles.filter((f) => f !== e)
                          );
                        }}
                      >
                        <Typography 
                          key={`available_roles_typography${i}`}
                          sx={{
                            "&:hover": { color: cybTheme.palette.primary.main },
                          }}
                        >
                          {e}
                        </Typography>
                      </Link>
                    );
                  })
                : []}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button variant="outlined" onClick={handleSave}>
        Save
      </Button>
      <Typography variant="caption">
        {roleChangeResponse}
      </Typography>
    </Stack>
  );
}

function logSettings(logs) {
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="body1">Logs</Typography>

      <CustomTable headers={TABLE_HEADERS_LOGS} data={logs} />
    </Stack>
  );
}

export default authWrapper(AdminPage, "admin", "profile")