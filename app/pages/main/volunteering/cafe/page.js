
"use client"

import CustomCalendar from "@/app/components/calendar";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import authWrapper from "@/app/middleware/authWrapper";
import { Box, Typography } from "@mui/material";

// const { Typography, Box } = require("@mui/material");

function VolunteeringPage(params) {
  
  
  const events = [
    {
      event_id: 0,
      title: "early shift",
      start: new Date(new Date(new Date().setMinutes(0)).setHours(10)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(11)),
      shift_manager: "Alice",
      worker_1: "Alice's friend",
      worker_2: "Alice's other friend",
    },
    {
      event_id: 1,
      title: "middle shift",
      start: new Date(new Date(new Date().setMinutes(15)).setHours(12)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(13)),
      shift_manager: "Bob",
      worker_1: "Bob's friend",
      worker_2: "Bob's other friend",
    },
    {
      event_id: 3,
      title: "closing shift",
      start: new Date(new Date(new Date().setMinutes(15)).setHours(14)),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(14)),
      shift_manager: "Charlie",
      worker_1: "Charlie's friend",
      worker_2: "Charlie's other friend",
    },
    {
      event_id: 4,
      title: "middle shift",
      start: new Date(Date.parse("19 Aug 2024 12:15")),
      end: new Date(new Date(new Date().setMinutes(59)).setHours(13)),
      shift_manager: "bob",
      worker_1: "a",
      worker_2: "b",
    },
  ];
  
  return (
    <Box>
      <PageHeader text="Café" variant="h4" />

      <CustomCalendar events={events}/>
    </Box>
  );
}

// export default authWrapper(VolunteeringPage)
export default VolunteeringPage