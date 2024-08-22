
"use client"

import CustomCalendar from "@/app/components/calendar";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import authWrapper from "@/app/middleware/authWrapper";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Card, CardContent, Grid, Stack } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const SHIFTS = [
  { name: "opening shift", startTime: "", endTime: "", managerStartTime: "", managerEndTime: "" },
  { name: "middle shift", startTime: "", endTime: "", managerStartTime: "", managerEndTime: "" },
  { name: "closing shift", startTime: "", endTime: "", managerStartTime: "", managerEndTime: "" },
]

function VolunteeringPage() {
  
  const [users, setUsers] = useState([]);
  const [shiftManager, setShiftManager] = useState(null);
  const [shiftWorker1, setShiftWorker1] = useState(null);
  const [shiftWorker2, setShiftWorker2] = useState(null);
  
  const [shift, setShift] = useState(null);
  const [day, setDay] = useState(null);
  
  useEffect(() => {
    
    prismaRequest({
      model: "user",
      method: "find",
      callback: (data) => {
        if (data.data.length == 0) return;
        setUsers(data.data);
      }
    })
    
  }, [])
  
  const events = [
    {
      event_id: 0,
      title: "early shift",
      date_label: format(new Date(new Date(new Date().setMinutes(0)).setHours(10)), "dd/MM"),
      start: new Date(new Date(new Date().setMinutes(0)).setHours(10)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(11)),
      shift_manager: { firstName: "Alice" },
      worker_1: { firstName: "Alice's friend" },
      worker_2: { firstName: "Alice's other friend" },
    },
    {
      event_id: 1,
      title: "middle shift",
      date_label: format(new Date(new Date(new Date().setMinutes(15)).setHours(12)), "dd/MM"),
      start: new Date(new Date(new Date().setMinutes(15)).setHours(12)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(13)),
      shift_manager: { firstName: "Bob" },
      worker_1: { firstName: "Bob's friend" },
      worker_2: { firstName: "Bob's other friend" },
    },
    {
      event_id: 3,
      title: "closing shift",
      date_label: format(new Date(new Date(new Date().setMinutes(15)).setHours(14)), "dd/MM"),
      start: new Date(new Date(new Date().setMinutes(15)).setHours(14)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(14)),
      shift_manager: { firstName: "Charlie" },
      worker_1: { firstName: "Charlie's friend" },
      worker_2: { firstName: "Charlie's other friend" },
    },
    {
      event_id: 4,
      title: "middle shift",
      date_label: format(new Date(Date.parse("19 Aug 2024 12:15")), "dd/MM"),
      start: new Date(Date.parse("19 Aug 2024 12:15")),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(13)),
      shift_manager: { firstName: "Charlie" },
      worker_1: { firstName: "Alice" },
      worker_2: { firstName: "Bob" },
    },
  ];
  
  return (
    <Box>
      <PageHeader text="Café" variant="h4" />

      <Grid
        container
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
      >
        <Grid item xs>
          <CustomCalendar
            events={events}
            setShiftManager={setShiftManager}
            setShiftWorker1={setShiftWorker1}
            setShiftWorker2={setShiftWorker2}
          />
        </Grid>

        <Grid item xs={4} height="100%">
          <Card elevation={3}>
            <CardContent>
              <PageHeader variant="h6" text="Manage shift" />

              <Stack direction="column" spacing={6}>
                <Stack spacing={2}>
                  <CustomAutoComplete
                    label="Shift manager"
                    dataLabel="firstName"
                    subDataLabel="email"
                    data={users}
                    value={shiftManager}
                    callback={setShiftManager}
                    error={false}
                  />
                  <CustomAutoComplete
                    label="volunteer"
                    dataLabel="firstName"
                    subDataLabel="email"
                    data={users}
                    value={shiftWorker1}
                    callback={setShiftWorker1}
                    error={false}
                  />
                  <CustomAutoComplete
                    label="volunteer"
                    dataLabel="firstName"
                    subDataLabel="email"
                    data={users}
                    value={shiftWorker2}
                    callback={setShiftWorker2}
                    error={false}
                  />
                </Stack>
                <Stack spacing={2}>
                  <CustomAutoComplete
                    label="Select day"
                    dataLabel="date_label"
                    data={events}
                    value={day}
                    callback={setDay}
                    error={false}
                    />
                  <CustomAutoComplete
                    label="Select shift"
                    dataLabel="name"
                    data={SHIFTS}
                    value={shift}
                    callback={setShift}
                    error={false}
                  />
                </Stack>
                <Button variant="outlined">Save</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default authWrapper(VolunteeringPage)