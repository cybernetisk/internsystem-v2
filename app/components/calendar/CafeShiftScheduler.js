
"use client"

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  addMonths,
  subMonths,
  isSameMonth,
  format,
  isToday,
  subWeeks,
  addWeeks,
} from "date-fns";
import {
  generateCalendarData,
  getFilteredCalendarData,
  getFocusedWeekdays,
} from "./schedulerUtils";
import React, { useState, useMemo } from "react";
import { enGB, nb } from "date-fns/locale";
import { cybTheme } from "../themeCYB";


const CafeShiftScheduler = (props) => {
  
  const {
    shifts,
    setSelectedShift,
    setSelectedDay,
    setShiftManager,
    setShiftWorker1,
    setShiftWorker2
  } = props
  
  const [focusedDay, setFocusedDay] = useState(new Date());
  const [mode, setMode] = useState("month");

  const calendarData = useMemo(
    () => generateCalendarData(focusedDay, mode, shifts),
    [focusedDay, mode, shifts]
  );
  
  const focusedWeekdays = useMemo(
    () => getFocusedWeekdays(focusedDay, calendarData),
    [focusedDay, calendarData]
  );
  
  const filteredData = useMemo(
    () => getFilteredCalendarData(focusedDay, mode, calendarData),
    [focusedDay, mode, calendarData]
  )
  
  const handleUpdateFocusedDay = (direction) => {
    const modeOperations = {
      month: direction === 1 ? addMonths : subMonths,
      week: direction === 1 ? addWeeks : subWeeks,
    };
    setFocusedDay(modeOperations[mode](focusedDay, 1));
  }

  const getDayColor = (day) => {
    if (isToday(day)) return cybTheme.palette.primary.main;
    if (!isSameMonth(day, focusedDay)) return "GrayText";
    return "";
  };
  
  const renderHeader = () => (
    <Grid container item direction="row">
      {focusedWeekdays.map((day, i) => (
        <Grid item xs={12 / focusedWeekdays.length} key={`header_${i}`}>
          <Card square>
            <Box sx={{ p: 1 }}>
              <Typography variant="body1" color="GrayText">
                {mode == "month"
                  ? format(day.value, "EE")
                  : format(day.value, "EE do")}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMonthBody = () => {

    return filteredData.map((week, i) => (
      <Grid container item direction="row" key={`week_${i}`}>
        {week
          .filter((day) => !day.isWeekend)
          .map((day, j) => (
            <Grid item xs={12 / 5} key={`day_${j}`}>
              <Card square>
                <CardActionArea
                  disabled={day.header}
                  onClick={() => {
                    setFocusedDay(day.value);
                    setMode("week");
                  }}
                >
                  <Box sx={{ p: 1 }} height="14vh">
                    <Typography
                      variant="body2"
                      fontWeight={isToday(day.value) ? "bold" : ""}
                      color={getDayColor(day.value)}
                    >
                      {format(day.value, "dd", { locale: nb })}
                    </Typography>
                    <Stack direction="column" justifyContent="center" alignItems="start">
                      {day.shifts.map((shift, l) => (
                        <Typography
                          key={`shift_${l}`}
                          variant="caption"
                          color={getDayColor(day.value)}
                          textAlign="center"
                        >
                          {shift.title ? shift.title : "-"}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    ));
  };

  const renderWeekBody = () => {
    
    return filteredData.map((week, i) => (
      <Grid container item direction="row" key={`week${i}_grid`}>
        {week
          .filter((day) => !day.isWeekend)
          .map((day, j) => (
            <Grid
              container
              item
              xs={12 / 5}
              direction="column"
              rowGap={1}
              key={`week${i}_day${j}_grid`}
            >
              {day.shifts.map((shift, l) => (
                <Grid item key={`week${i}_day${j}_shift_${l}_grid`}>
                  <Card square key={`week${i}_day${j}_shift_${l}_card`}>
                    <CardActionArea
                      key={`week${i}_day${j}_shift_${l}_caa`}
                      onClick={() => {
                        setSelectedDay(shift.startAt);

                        if (shift.isReal) {
                          setSelectedShift(shift);
                          setShiftManager(shift.shiftManager);
                          setShiftWorker1(shift.shiftWorker1);
                          setShiftWorker2(shift.shiftWorker2);
                        } else {
                          setSelectedShift(null);
                        }
                      }}
                    >
                      <Box
                        sx={{ p: 1 }}
                        height="14vh"
                        key={`week${i}_day${j}_shift_${l}_box`}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isToday(shift.startAt) ? "bold" : ""}
                          color={getDayColor(shift.startAt, focusedDay)}
                          key={`week${i}_day${j}_shift_${l}_typography`}
                        >
                          {format(shift.startAt, "HH:mm", { locale: nb })}
                        </Typography>
                        <Stack key={`week${i}_day${j}_shift_${l}_stack`}>
                          <Typography
                            variant="caption"
                            key={`week${i}_day${j}_shift_${l}_shiftManager`}
                          >
                            {shift.shiftManager ? shift.shiftManager.firstName : "-"}
                          </Typography>
                          <Typography
                            variant="caption"
                            key={`week${i}_day${j}_shift_${l}_shiftWorker1`}
                          >
                            {shift.shiftWorker1 ? shift.shiftWorker1.firstName : "-"}
                          </Typography>
                          <Typography
                            variant="caption"
                            key={`week${i}_day${j}_shift_${l}_shiftWorker2`}
                          >
                            {shift.shiftWorker2 ? shift.shiftWorker2.firstName : "-"}
                          </Typography>
                        </Stack>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
      </Grid>
    ));
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          {/* Calendar Controls */}
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            rowGap={1}
          >
            <Grid item container direction="row" alignItems="center" xs={5}>
              <Grid item xs>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => handleUpdateFocusedDay(-1)}
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs justifyItems="center">
                <Typography variant="body1" textAlign="center">
                  {format(focusedDay, "MMM yyyy", { locale: enGB })}
                </Typography>
              </Grid>
              <Grid item xs>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => handleUpdateFocusedDay(1)}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent={{ xs: "space-between", md: "end" }}
              xs
            >
              <Grid item xs md={3}>
                <Button
                  variant="text"
                  size="small"
                  fullWidth
                  onClick={() => setFocusedDay(new Date())}
                >
                  Today
                </Button>
              </Grid>
              <Grid item xs md={3}>
                <Button
                  variant={mode === "month" ? "contained" : "outlined"}
                  size="small"
                  fullWidth
                  onClick={() => setMode("month")}
                >
                  Month
                </Button>
              </Grid>
              <Grid item xs md={3}>
                <Button
                  variant={mode === "week" ? "contained" : "outlined"}
                  size="small"
                  fullWidth
                  onClick={() => setMode("week")}
                >
                  Week
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Calendar view */}
          <Grid container direction="column" rowGap={1}>
            {renderHeader()}
            {mode === "month" ? renderMonthBody() : renderWeekBody()}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CafeShiftScheduler;
