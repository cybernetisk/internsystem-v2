
"use client";

import { useEffect, useState } from "react";
import { Autocomplete, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import CustomTable from "@/app/components/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { prismaRequest } from "@/app/components/prisma/prismaRequest";
import { format, parseISO } from "date-fns"
import handleWorkGroups from "./handleWorkGroups";

const TABLE_HEADERS_USERS = [
  { id: "firstName", name: "First name" },
  { id: "lastName", name: "Last name" },
  { id: "email", name: "Email" },
  { id: "createdAt", name: "member since" },
  { id: "active", name: "active" },
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



export default function AdminPage(params) {

  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [refresh, setRefresh] = useState(false)
  
  const session = useSession()
  const router = useRouter()
  
  if (session.status == "unauthenticated") {
    router.push("home");
  }
  
  useEffect(() => {
    handlePrisma("user", "find", {}, setUsers);
    handlePrisma("workGroup", "find", {include: { VolunteerToWorkGroup: true }},  (data) => setGroups(data.map((e) => { return { ...e, userCount: e.VolunteerToWorkGroup.length }; })));
  }, [refresh])
  
  
  return (
    <Stack
      spacing={4}
      direction="column"
      alignContent="center"
      sx={{ height: "100%" }}
    >
      <Typography variant="h4">Admin panel</Typography>

      <CustomTable headers={TABLE_HEADERS_USERS} data={users} />
      <CustomTable headers={TABLE_HEADERS_GROUPS} data={groups} />

      <Paper sx={{ padding: "0px" }}>
        <Grid container direction="row" columnGap={0}>
          <Grid
            item
            xs={4}
            // sx={{ border: "1px solid red" }}
           padding={3}>
            {handleWorkGroups(groups, refresh, setRefresh)}
          </Grid>

          <Grid item xs={4}
          // sx={{ border: "1px solid red" }}
          padding={3}>
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

          <Grid item xs={4}
          // sx={{ border: "1px solid red" }}
          padding={3}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6">Work Logs</Typography>
              {/* <Autocomplete
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
              /> */}
              {/* <Button variant="outlined">Add/Remove</Button> */}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}

async function handlePrisma(model, method, request, callback) {
  
  console.log("query", model, method, request)
  
  let data = await prismaRequest({
    model: model,
    method: method,
    request: request
  })
  
  console.log(data)
  
  callback(data)
}