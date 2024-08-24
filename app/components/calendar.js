
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
  addDays,
  addHours,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  endOfMonth,
  format,
  getWeek,
  isSameDay,
  isSameHour,
  isSameMonth,
  isSunday,
  isToday,
  isWeekend,
  nextSunday,
  previousMonday,
  startOfMonth,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Component } from "react";
import { enGB, nb } from "date-fns/locale";
import { cybTheme } from "./themeCYB";

export default class CustomCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "month",
      focusedDay: new Date(),
    };
  }

  updateStateFocusedDay = (mode, direction) => {
    const { focusedDay } = this.state;

    const modeOperations = {
      month: direction === 1 ? addMonths : subMonths,
      week: direction === 1 ? addWeeks : subWeeks,
    };

    if (modeOperations[mode]) {
      this.setState({
        focusedDay: modeOperations[mode](focusedDay, 1),
      });
    }
  };

  updateStateMode = (mode) => {
    if (this.state.mode !== mode) {
      this.setState({ mode });
    }
  };
  
  getFocusedWeekdays = (data, focusedDay) => {
    const focusedWeek = data.filter((week) =>
      week.some((day) => isSameDay(focusedDay, day.value))
    )[0];
    
    return focusedWeek.filter((day) => !day.isWeekend);
  };

  generateMonthData = () => {
    const { focusedDay } = this.state;
    const { shifts } = this.props;

    const monthStart = startOfMonth(focusedDay);
    const monthEnd = endOfMonth(focusedDay);

    // calculate the number of days to display from the previous month
    const monthStartOffset = isSameMonth(monthStart, previousMonday(monthStart))
      ? 0
      : differenceInCalendarDays(monthStart, previousMonday(monthStart));

    // calculate the number of days to display from the next month
    const monthEndOffset = isSunday(monthEnd)
      ? 0
      : differenceInCalendarDays(nextSunday(monthEnd), monthEnd);

    let currentDay = subDays(monthStart, monthStartOffset);
    let lastDayInCalendar = addDays(monthEnd, monthEndOffset);
    let monthInWeeks = [];

    // Generate relevant weeks
    while (currentDay <= lastDayInCalendar) {
      let week = [];

      for (let i = 0; i < 7; i++) {
        let dayShifts = shifts.filter((e) => isSameDay(currentDay, e.startAt));
        let filledPositions = dayShifts.map((e) => e.shiftPosition);

        // Ensure that each shift position (0, 1, 2) is filled, adding placeholders if necessary
        for (let position = 0; position < 3; position++) {
          if (!filledPositions.includes(position)) {
            dayShifts.push({ shiftPosition: position, title: "-" });
          }
        }

        // Sort the shifts by shiftPosition to ensure the earliest slots come first
        dayShifts.sort((a, b) => a.shiftPosition - b.shiftPosition);

        week.push({
          value: currentDay,
          isWeekend: isWeekend(currentDay),
          weekIndex: getWeek(currentDay),
          shifts: dayShifts,
        });

        currentDay = addDays(currentDay, 1);
      }

      monthInWeeks.push(week);
    }

    return monthInWeeks;
  };
  
  generateWeekData = () => {
    
  };

  generateView = () => {
    const { mode } = this.state;

    const data = this.generateMonthData();

    if (mode == "month") {
      return this.generateMonthView(data);
    } else {
      return this.generateWeekView(data);
    }
  };

  generateMonthView = (data) => {
    const { focusedDay } = this.state;

    const focusedWeekdays = this.getFocusedWeekdays(data, focusedDay);

    const header = (
      <Grid container item direction="row">
        {focusedWeekdays.map((elem) => {
          return (
            <Grid item xs={12 / focusedWeekdays.length}>
              <Card square>
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="body1"
                    color="GrayText"
                    display={{ xs: "block", md: "block" }}
                  >
                    {format(elem.value, "EE")}
                    {elem.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );

    const body = data
      .filter((row) =>
        row.reduce(
          (sum, nextElem) =>
            sum ||
            (isSameMonth(focusedDay, nextElem.value) && !nextElem.isWeekend),
          false
        )
      )
      .map((week) => {
        return (
          <Grid container item direction="row">
            {week
              .filter((elem) => !elem.isWeekend)
              .map((elem) => {
                return (
                  <Grid item xs={12 / 5}>
                    <Card square>
                      <CardActionArea
                        disabled={elem.header}
                        onClick={() => {
                          this.updateStateMode("week");
                        }}
                      >
                        <Box sx={{ p: 1 }} height={elem.header ? "" : "14vh"}>
                          <Typography
                            variant="body2"
                            fontWeight={isToday(elem.value) ? "bold" : ""}
                            color={
                              isToday(elem.value)
                                ? cybTheme.palette.primary.main
                                : !isSameMonth(elem.value, focusedDay)
                                ? "GrayText"
                                : ""
                            }
                          >
                            {format(elem.value, "dd", { locale: nb })}
                          </Typography>
                          <Stack>
                            {elem.shifts.map((shift) => (
                              <Typography
                                variant="caption"
                                color={
                                  isToday(elem.value)
                                    ? cybTheme.palette.primary.main
                                    : !isSameMonth(elem.value, focusedDay)
                                    ? "GrayText"
                                    : ""
                                }
                              >
                                {shift.title}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        );
      });

    return [header, ...body];
  };

  generateWeekView = (data) => {
    const { focusedDay } = this.state;
    const {
      shifts,
      setSelectedDay,
      setSelectedShift,
      setShiftManager,
      setShiftWorker1,
      setShiftWorker2,
    } = this.props;

    const focusedWeekdays = this.getFocusedWeekdays(data, focusedDay);

    const header = (
      <Grid container item direction="row">
        {focusedWeekdays.map((elem) => {
          return (
            <Grid item xs={12 / focusedWeekdays.length}>
              <Card square>
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="body1"
                    display={{ xs: "block", md: "block" }}
                    color={
                      isToday(elem.value)
                        ? cybTheme.palette.primary.main
                        : "GrayText"
                    }
                  >
                    {format(elem.value, "EE do")}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );

    let body = [];
    for (let i = 10; i < 16; i += 2) {
      const hours = focusedWeekdays.map((elem) => {
        const tempDayHourStart = addHours(elem.value, i);
        const tempDayHourEnd = addHours(elem.value, i + 2);

        const event = shifts.filter((event) =>
          isSameHour(event.startAt, tempDayHourStart)
        );

        const shiftEvent = event.map((event) => (
          <Stack>
            <Typography variant="caption">
              {event.shiftManager ? event.shiftManager.firstName : "-"}
            </Typography>
            <Typography variant="caption">
              {event.shiftWorker1 ? event.shiftWorker1.firstName : "-"}
            </Typography>
            <Typography variant="caption">
              {event.shiftWorker2 ? event.shiftWorker2.firstName : "-"}
            </Typography>
          </Stack>
        ))[0];

        return (
          <Grid item xs={12 / 5}>
            <Card square>
              <CardActionArea
                disabled={elem.header}
                onClick={() => {
                  setSelectedDay(tempDayHourStart);

                  if (event.length == 0) {
                    setSelectedShift(null);
                  } else {
                    setSelectedShift(event[0]);
                    setShiftManager(event[0].shiftManager);
                    setShiftWorker1(event[0].shiftWorker1);
                    setShiftWorker2(event[0].shiftWorker2);
                  }
                }}
              >
                <Stack
                  direction="column"
                  sx={{ p: 1 }}
                  height={elem.header ? "" : "16vh"}
                  justifyContent="space-between"
                >
                  <Typography variant="body2" color="GrayText">
                    {format(tempDayHourStart, "HH:mm")} -{" "}
                    {format(tempDayHourEnd, "HH:mm")}
                  </Typography>

                  <Stack>{shiftEvent}</Stack>
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        );
      });

      const result = (
        <Grid container item direction="row">
          {hours}
        </Grid>
      );

      body.push(result);
    }

    return [header, ...body];
  };

  render() {
    const { today, focusedDay, mode, currentShifts } = this.state;

    const view = this.generateView();

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
                    onClick={() => this.updateStateFocusedDay(mode, -1)}
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
                    onClick={() => this.updateStateFocusedDay(mode, 1)}
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
                    onClick={() => {
                      this.setState({ focusedDay: today });
                    }}
                  >
                    Today
                  </Button>
                </Grid>
                <Grid item xs md={3}>
                  <Button
                    variant={mode == "month" ? "contained" : "outlined"}
                    size="small"
                    fullWidth
                    onClick={() => this.updateStateMode("month")}
                  >
                    Month
                  </Button>
                </Grid>
                <Grid item xs md={3}>
                  <Button
                    variant={mode == "week" ? "contained" : "outlined"}
                    size="small"
                    fullWidth
                    onClick={() => this.updateStateMode("week")}
                  >
                    Week
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Calendar view */}
            <Grid container direction="column" rowGap={1}>
              {view}
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    );
  }
}