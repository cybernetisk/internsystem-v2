
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Autocomplete, Button, Card, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import CustomTable from "@/components/table";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import handleWorkGroups from "./handleWorkGroups";
import useRole from "@/app/middleware/useRole";
import authWrapper from "@/app/middleware/authWrapper";
import handleRoles from "./handleRoles";

const TABLE_HEADERS_USERS = [
  { id: "firstName", name: "First name" },
  { id: "lastName", name: "Last name" },
  { id: "email", name: "Email" },
  { id: "createdAt", name: "member since" },
  // { id: "active", name: "active" },
  {
    id: "delete",
    name: "delete",
    target: "email",
    onClick: (data) => handlePrisma("user", "delete", { where: { email: data } }, (data) => {})
  },
];

const TABLE_HEADERS_GROUPS = [
  { id: "name", name: "name", redirect: true },
  { id: "description", name: "Description" },
  { id: "userCount", name: "# of users" },
];



function AdminPage(params) {

  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [roles, setRoles] = useState([]);
  
  const router = useRouter()
  // const roleAdmin = useRole("admin")
  // const session = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     router.push("home");
  //   }
  // })
  
  useEffect(() => {
    prismaRequest({
      model: "user",
      method: "find",
      request: {},
      callback: (data) => setUsers(data.data),
    })
    
    prismaRequest({
      model: "role",
      method: "find",
      request: {},
      callback: (data) => setRoles(data.data),
      debug: true
    })
    
    prismaRequest({
      model: "workGroup",
      method: "find",
      request: {
        include: { VolunteerToWorkGroup: true },
      },
      callback: (data) =>
        setGroups(
          data.data.map((e) => {
            return {
              ...e,
              userCount: e.VolunteerToWorkGroup.length,
              
            };
          })
        ),
    });
  }, [])
  
  
  
  
  return (
    <Stack
      spacing={4}
      direction="column"
      alignContent="center"
      sx={{ height: "100%" }}
    >
      <Button
        onClick={() => {
          prismaRequest({
            model: "role",
            method: "create",
            request: {
              data: {
                name: "finance",
              },
            },
          });
        }}
      >
        add admin role
      </Button>

      <Typography variant="h4">Admin panel</Typography>

      <CustomTable headers={TABLE_HEADERS_USERS} data={users} />
      <CustomTable headers={TABLE_HEADERS_GROUPS} data={groups} />

      <Paper sx={{ padding: "0px" }}>
        <Grid container direction="row" columnGap={0}>
          <Grid
            item
            xs={4}
            // sx={{ border: "1px solid red" }}
            padding={3}
          >
            {handleWorkGroups(groups, setGroups)}
          </Grid>

          <Grid
            item
            xs={4}
            // sx={{ border: "1px solid red" }}
            padding={3}
          >
            <Stack direction="column" spacing={2}>
              <Typography variant="h6">Volunteers</Typography>
              <Autocomplete
                size="small"
                options={users.map((e) => e.firstName)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="User"
                  />
                )}
              />

              <Autocomplete
                size="small"
                options={users.map((e) => e.firstName)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Work Group"
                  />
                )}
              />
              <Button variant="outlined">Add/Remove</Button>
            </Stack>
          </Grid>

          <Grid
            item
            xs={4}
            padding={3}
            // sx={{ border: "1px solid red" }}
          >
            <Card>
              
            </Card>
            <Stack direction="column" spacing={2}>
              {handleRoles(users, roles, setRoles)}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}

export default authWrapper(AdminPage, "admin", "profile")