
"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import authWrapper from "@/app/middleware/authWrapper";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { useEffect, useState } from "react";
import locale from "date-fns/locale/en-GB";
import CafeShiftScheduler from "@/app/components/calendar/CafeShiftScheduler";
import { Circle } from "@mui/icons-material";


function CafePage() {
  
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  
  const [shiftManager, setShiftManager] = useState(null);
  const [shiftWorker1, setShiftWorker1] = useState(null);
  const [shiftWorker2, setShiftWorker2] = useState(null);
  
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [refresh, setRefresh] = useState(false);
  
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
  
  useEffect(() => {
    prismaRequest({
      model: "shiftCafe",
      method: "find",
      request: {
        include: {
          UserForShiftManager: true,
          UserForShiftWorker1: true,
          UserForShiftWorker2: true,
        }
      },
      callback: (data) => {
        if (data.data.length == 0) return;
        
        const newShifts = data.data.map((e) => {
          return {
            ...e,
            isReal: true,
            startAt: new Date(Date.parse(e.startAt)),
            shiftManager: e.UserForShiftManager,
            shiftWorker1: e.UserForShiftWorker1,
            shiftWorker2: e.UserForShiftWorker2,
          }
        })
        
        // console.log(newShifts);
        setShifts(newShifts);
      }
    })
  }, [refresh]);
  
  const manageShift = async () => {
    
    console.log(shiftManager, shiftWorker1, shiftWorker2)
    
    const response = await fetch("/api/data/updateORCreateShift", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedShiftId: selectedShift?.id,
        selectedDay: selectedDay,
        shiftManagerId: shiftManager ? shiftManager.id : null,
        shiftWorker1Id: shiftWorker1 ? shiftWorker1.id : null,
        shiftWorker2Id: shiftWorker2 ? shiftWorker2.id : null,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setRefresh(!refresh);
    }
    
    
  }
  
  return (
    <Box>
      <PageHeader text="Café shifts" variant="h4" />

      <Grid
        container
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
      >
        <Grid item xs>
          {CafeShiftScheduler({
            shifts,
            setSelectedShift,
            setSelectedDay,
            setShiftManager,
            setShiftWorker1,
            setShiftWorker2,
          })}
        </Grid>

        <Grid item xs={4} height="100%">
          <Stack direction="column" spacing={1}>
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
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={locale}
                    >
                      <DateTimePicker
                        label="Start time"
                        defaultValue={selectedDay}
                        value={selectedDay}
                        ampm={false}
                        disableOpenPicker
                      />
                    </LocalizationProvider>
                    <Button variant="outlined" onClick={manageShift}>
                      Save
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" alignItems="center">
                  <Circle sx={{ height: 15 }} color="success" />
                  <Typography>= Shift is filled</Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Circle sx={{ height: 15 }} color="warning" />
                  <Typography>= Shift has people</Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Circle sx={{ height: 15 }} color="error" />
                  <Typography>= Shift is empty</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default authWrapper(CafePage)