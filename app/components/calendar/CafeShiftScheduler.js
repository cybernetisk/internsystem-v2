
"use client"

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
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
import { PageBuilderSkeleton } from "../sanity/PageBuilder";

const CARD_HEIGHT = "14vh";
const NUM_DAYS = 5;

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

  const getDayColor = (day, check) => {
    if (isToday(day)) return cybTheme.palette.primary.main;
    if (!check(day, focusedDay)) return "GrayText";
    return "";
  };
  
  const renderHeader = () => (
    <Grid container item direction="row">
      {focusedWeekdays.map((day, i) => (
        <Grid item xs={12 / focusedWeekdays.length} key={`header_${i}`}>
          <Card square>
            <Box sx={{ p: 1 }}>
              <Typography
                variant="body1"
                color={getDayColor(day.value, isToday)}
              >
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
              <Grid item xs={12 / NUM_DAYS} key={`week${i}_day${j}_grid`}>
                <Card square key={`week${i}_day${j}_card`}>
                  <CardActionArea
                    disabled={day.header}
                    onClick={() => {
                      setFocusedDay(day.value);
                      setMode("week");
                    }}
                    key={`week${i}_day${j}_caa`}
                  >
                    <Stack
                      direction="column"
                      sx={{ p: 1 }}
                      height={CARD_HEIGHT}
                      justifyContent="space-between"
                      key={`week${i}_day${j}_stack`}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        key={`week${i}_day${j}_stack`}
                      >
                        <Typography
                          variant="body2"
                          // fontWeight={isToday(day.value) ? "bold" : ""}
                          // color={getDayColor(day.value, isSameMonth)}
                          key={`week${i}_day${j}_typography`}
                        >
                          {format(day.value, "dd", { locale: nb })}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="start"
                        key={`week${i}_day${j}_stack2`}
                      >
                        {day.shifts.map((shift, l) => {
                          let shiftReady = 0;
                          let shiftColour;

                          shiftReady += shift.shiftManager ? 1 : 0;
                          shiftReady += shift.shiftWorker1 ? 1 : 0;
                          shiftReady += shift.shiftWorker2 ? 1 : 0;

                          switch (shiftReady) {
                            case 0:
                              shiftColour = cybTheme.palette.error.main;
                              break;
                            case 1:
                              shiftColour = cybTheme.palette.warning.main;
                              break;
                            case 2:
                              shiftColour = cybTheme.palette.warning.main;
                              break;
                            case 3:
                              shiftColour = cybTheme.palette.success.main;
                              break;
                          }

                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              key={`week${i}_day${j}_shift${l}_stack`}
                            >
                              <Typography
                                variant="caption"
                                color={shiftColour}
                                textAlign="center"
                                key={`week${i}_day${j}_shift${l}_typography`}
                              >
                                {shift.title ? shift.title : "X"}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          )}
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
                    >
                      <CardActionArea
                        key={`week${i}_day${j}_shift${l}_caa`}
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
                        <Stack
                          sx={{ p: 1 }}
                          height={CARD_HEIGHT}
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
                              <Typography
                                variant="caption"
                                color={
                                  s
                                    ? cybTheme.palette.success.main
                                    : cybTheme.palette.error.main
                                }
                                key={`week${i}_day${j}_shift${l}_pos${k}`}
                              >
                                {s ? getInitials(s.firstName) : "X"}
                              </Typography>
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
            {shifts.length !== 0 ? (
              <Box>
                {renderHeader()}
                {mode === "month" ? renderMonthBody() : renderWeekBody()}
              </Box>
            ) : (
              <PageBuilderSkeleton />
            )}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CafeShiftScheduler;
