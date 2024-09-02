
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
  format,
  isToday,
  subWeeks,
  addWeeks,
  isSameMonth,
  isSameDay,
  addHours,
} from "date-fns";
import {
  generateCalendarData,
  getFilteredCalendarData,
  getFocusedWeekdays,
  getInitials,
} from "./schedulerUtils";
import React, { useState, useMemo } from "react";
import { enGB, nb } from "date-fns/locale";
import { cybTheme } from "../themeCYB";

const NUM_DAYS = 5;

export default function CafeShiftScheduler(props) {
  
  const {
    shifts,
    selectedShift,
    setSelectedShift,
    setSelectedDay,
    setShiftManager,
    setShiftWorker1,
    setShiftWorker2,
    setComment,
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

  const getDayColor = (day, check, inactiveColor="GrayText") => {
    if (isToday(day)) return cybTheme.palette.primary.main;
    if (!check(day, focusedDay)) return inactiveColor;
    return "";
  };
  
  const getShiftColor = (shift) => {
    let shiftReady = 0;
    shiftReady += shift.shiftManager ? 1 : 0;
    shiftReady += shift.shiftWorker1 ? 1 : 0;
    shiftReady += shift.shiftWorker2 ? 1 : 0;
    switch (shiftReady) {
      case 0:
        return cybTheme.palette.error.main;
      case 1:
        return cybTheme.palette.warning.main;
      case 2:
        return cybTheme.palette.warning.main;
      case 3:
        return cybTheme.palette.success.main;
    }
  }
  
  const renderHeader = () => (
    <Grid container item direction="row">
      {focusedWeekdays.map((day, i) => (
        <Grid item xs={12 / focusedWeekdays.length} key={`header_${i}`}>
          <Card square key={`header_${i}_card`}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              sx={{ p: 1 }}
              key={`header_${i}_stack`}
            >
              <Typography
                variant="body1"
                color={getDayColor(day.value, isToday, "")}
                key={`header_${i}_typography`}
              >
                {format(day.value, "EE")}
              </Typography>

              {mode === "week" ? (
                <Typography
                  color={getDayColor(day.value, isToday)}
                  key={`header_${i}_typography_two`}
                >
                  {format(day.value, " do")}
                </Typography>
              ) : (
                <React.Fragment key={`header_${i}_typography_two`}/>
              )}
            </Stack>
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
            <Grid item xs key={`week${i}_day${j}_grid`}>
              <Card
                square
                key={`week${i}_day${j}_card`}
                elevation={isSameDay(focusedDay, day.value) ? 6 : 1}
              >
                <CardActionArea
                  onClick={() => {
                    setFocusedDay(day.value);
                    setMode("week");
                  }}
                  key={`week${i}_day${j}_caa`}
                >
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    sx={{ p: 1 }}
                    key={`week${i}_day${j}_stack`}
                  >
                    <Typography
                      variant="body2"
                      color={getDayColor(day.value, isSameMonth)}
                      key={`week${i}_day${j}_typography`}
                    >
                      {format(day.value, "dd", { locale: nb })}
                    </Typography>

                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="start"
                      key={`week${i}_day${j}_stack2`}
                    >
                      {day.shifts.map((shift, l) => (
                        <Box
                          key={`week${i}_day${j}_shift${l}_box`}
                        >
                          <Typography
                            variant="caption"
                            color={getShiftColor(shift)}
                            textAlign="center"
                            display={{ xs: "block", md: "none" }}
                            key={`week${i}_day${j}_shift${l}_typography_small`}
                          >
                            {format(shift.startAt, "HH", { locale: nb })}
                            {" - "}
                            {format(addHours(shift.startAt, 2), "HH", {
                              locale: nb,
                            })}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={getShiftColor(shift)}
                            textAlign="center"
                            display={{ xs: "none", md: "block" }}
                            key={`week${i}_day${j}_shift${l}_typography_big`}
                          >
                            {format(shift.startAt, "HH:mm", { locale: nb })}
                            {" - "}
                            {format(addHours(shift.startAt, 2), "HH:mm", {
                              locale: nb,
                            })}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
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
              xs={12 / NUM_DAYS}
              direction="column"
              rowGap={1}
              key={`week${i}_day${j}_grid`}
            >
              {day.shifts.map((shift, l) => {
                
                const curShifts = [
                  shift.shiftManager,
                  shift.shiftWorker1,
                  shift.shiftWorker2
                ]
                
                return (
                  <Grid item key={`week${i}_day${j}_shift${l}_grid`}>
                    <Card
                      square
                      sx={{ overflow: "hidden", lineClamp: 1 }}
                      key={`week${i}_day${j}_shift${l}_card`}
                      elevation={selectedShift === shift ? 6 : 1}
                    >
                      <CardActionArea
                        key={`week${i}_day${j}_shift${l}_caa`}
                        onClick={() => {
                          // console.log(selectedShift, shift);

                          setSelectedDay(shift.startAt);

                          if (shift.isReal) {
                            setSelectedShift(shift);
                            setShiftManager(shift.shiftManager);
                            setShiftWorker1(shift.shiftWorker1);
                            setShiftWorker2(shift.shiftWorker2);
                            setComment(shift.comment ? shift.comment : "");
                          } else {
                            setSelectedShift(shift);
                            setShiftManager(null);
                            setShiftWorker1(null);
                            setShiftWorker2(null);
                            setComment("");
                          }
                        }}
                      >
                        <Stack
                          sx={{ p: 1 }}
                          justifyContent="space-between"
                          key={`week${i}_day${j}_shift${l}_box`}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={isToday(shift.startAt) ? "bold" : ""}
                            key={`week${i}_day${j}_shift_${l}_typography`}
                          >
                            {format(shift.startAt, "HH:mm", { locale: nb })}
                          </Typography>
                          <Stack key={`week${i}_day${j}_shift${l}_stack`}>
                            {curShifts.map((s, k) => (
                              <Box sx={{ width: "100%", display: "flex" }}>                                
                                <Typography
                                  variant="caption"
                                  noWrap
                                  sx={{
                                    flexGrow: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  color={
                                    s
                                      ? getShiftColor(shift)
                                      : cybTheme.palette.error.main
                                  }
                                  key={`week${i}_day${j}_shift${l}_pos${k}`}
                                >
                                  {s ? getInitials(s.firstName) : "X"}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
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
            // justifyContent="space-between"
            rowGap={{ xs: 1, md: 0 }}
            columnGap={{ xs: 0, md: 1 }}
            // spacing={2}
            // columnGap={1}
          >
            <Grid item container direction="row" alignItems="center" xs={5} md>
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
              md={4}
            >
              <Grid item xs>
                <Button
                  variant={mode === "month" ? "contained" : "outlined"}
                  size="small"
                  fullWidth
                  onClick={() => setMode("month")}
                >
                  Month
                </Button>
              </Grid>
              <Grid item xs>
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
            
            <Grid item xs md={2}>
              {/* <Grid item xs md={3}>
              </Grid> */}
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => setFocusedDay(new Date())}
              >
                Today
              </Button>
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

// export default CafeShiftScheduler;
