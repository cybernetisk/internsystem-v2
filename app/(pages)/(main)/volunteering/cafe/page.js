
"use client"

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CafeShiftScheduler from "../../../../components/calendar/CafeShiftScheduler";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import authWrapper from "@/app/middleware/authWrapper";
import { useEffect, useState } from "react";
import locale from "date-fns/locale/en-GB";
import { Circle } from "@mui/icons-material";
import { addWeeks } from "date-fns";


function CafePage() {
  
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  
  const [shiftManager, setShiftManager] = useState(null);
  const [shiftWorker1, setShiftWorker1] = useState(null);
  const [shiftWorker2, setShiftWorker2] = useState(null);
  
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [comment, setComment] = useState("");
  const [refresh, setRefresh] = useState(false);
  
  const [repeat, setRepeat] = useState(false);
  const [numberRepeats, setNumberRepeats] = useState(0);
  
  useEffect(() => {
    fetch("/api/v2/users")
    .then(res => res.json())
    .then(data => {setUsers(data.users)})
  }, [])
  
  useEffect(() => {
    fetch("/api/v2/shifts")
    .then(res => res.json())
    .then(data => {
      const newShifts = data.shifts.map((e) => {
        return {
          ...e,
          isReal: true,
          startAt: new Date(Date.parse(e.startAt)),
          shiftManager: e.UserForShiftManager,
          shiftWorker1: e.UserForShiftWorker1,
          shiftWorker2: e.UserForShiftWorker2,
        }
      })
      
      setShifts(newShifts);

    })
  }, [refresh]);
  
  const manageShift = async () => {
    
    const sendRequest = async (date, id) => {
      const response = await fetch("/api/v1/data/updateORCreateShift", {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedDay: date,
          comment: comment,
          shiftManagerId: shiftManager ? shiftManager.id : null,
          shiftWorker1Id: shiftWorker1 ? shiftWorker1.id : null,
          shiftWorker2Id: shiftWorker2 ? shiftWorker2.id : null,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setSelectedShift(data.data);
        setRefresh(!refresh);
      }
    }
    
    // console.log(selectedShift)
    
    // console.log(shiftManager, shiftWorker1, shiftWorker2, selectedShift?.id);
    
    if (repeat && numberRepeats > 0) {
      for (let i = 1; i <= numberRepeats; i++) {
        sendRequest(addWeeks(selectedDay, i), null);
      }
    }
    sendRequest(selectedDay, selectedShift?.id ? selectedShift.id : null);
  }
  
  const manageShiftClear = async () => {
    const response = await fetch("/api/v1/data/updateORCreateShift", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedDay: selectedDay,
        shiftManagerId: null,
        shiftWorker1Id: null,
        shiftWorker2Id: null,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      setSelectedShift(data.data);
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
            selectedShift,
            setSelectedShift,
            setSelectedDay,
            setShiftManager,
            setShiftWorker1,
            setShiftWorker2,
            setComment,
          })}
        </Grid>

        <Grid item xs={4} height="100%">
          <Stack direction="column" spacing={2}>
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
                      label="Volunteer"
                      dataLabel="firstName"
                      subDataLabel="email"
                      data={users}
                      value={shiftWorker1}
                      callback={setShiftWorker1}
                      error={false}
                    />
                    <CustomAutoComplete
                      label="Volunteer"
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
                        disabled
                        disableOpenPicker
                      />
                    </LocalizationProvider>
                    <TextField
                      multiline
                      rows={2}
                      InputLabelProps={{ shrink: true }}
                      label="Comment"
                      size="small"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                    />
                    
                    <Button variant="outlined" onClick={manageShift}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={manageShiftClear}>
                      Clear
                    </Button>
                    <Stack direction="row" alignItems="center">
                      <Typography>Repeat shift</Typography>
                      <Checkbox
                        checked={repeat}
                        onChange={(event) => setRepeat(event.target.checked)}
                      />
                    </Stack>

                    {repeat ? (
                      <CustomNumberInput
                        label="# of weeks"
                        value={numberRepeats}
                        setValue={setNumberRepeats}
                        check={(data) => data.match(/[^0-9]/)}
                        // error={props.hoursError}
                      />
                    ) : (
                      <></>
                    )}
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