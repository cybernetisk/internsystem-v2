
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

    const today = new Date();

    this.state = {
      today: today,
      focusedDay: today,
      mode: "month",
      ...generateMonthData(today),
    };
  }

  handleViewChange = (mode, direction) => {
    const { focusedDay } = this.state;

    console.log(mode, direction);

    if (mode == "month") {
      if (direction == 1) {
        this.setState({ ...generateMonthData(addMonths(focusedDay, 1)) });
      } else if (direction == -1) {
        this.setState({ ...generateMonthData(subMonths(focusedDay, 1)) });
      }
    } else if (mode == "week") {
      if (direction == 1) {
        this.setState({ ...generateMonthData(addWeeks(focusedDay, 1)) });
      } else if (direction == -1) {
        this.setState({ ...generateMonthData(subWeeks(focusedDay, 1)) });
      }
    }
  };

  handleModeChange = (mode) => {
    this.setState({
      mode: mode,
    });
  };

  createMonthView = () => {
    const { focusedDay, today, monthInWeeks } = this.state;
    const { events } = this.props;

    const focusedWeek = monthInWeeks.filter((week) =>
      week.reduce(
        (sum, next) => sum || isSameDay(focusedDay, next.value),
        false
      )
    )[0];

    const focusedWeekdays = focusedWeek.filter((row) => !row.isWeekend);

    const header = (
      <Grid container item direction="row">
        {focusedWeekdays.map((elem) => {
          return (
            <Grid item xs={12 / focusedWeekdays.length}>
              <Card square>
                <Box sx={{ p: 1 }}>
                  <Typography variant="body1" color="GrayText" display={{ xs: "block", md: "none" }}>
                    {format(elem.value, "EE")}
                    {elem.label}
                  </Typography>
                  <Typography variant="body1" color="GrayText" display={{ xs: "none", md: "block" }}>
                    {format(elem.value, "EEEE")}
                    {elem.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );

    const body = monthInWeeks
      .filter((row) =>
        row.reduce(
          (sum, nextElem) =>
            sum ||
            (isSameMonth(focusedDay, nextElem.value) && !nextElem.isWeekend),
          false
        )
      )
      .map((row) => {
        return (
          <Grid container item direction="row">
            {row
              .filter((elem) => !elem.isWeekend)
              .map((elem) => {
                return (
                  <Grid item xs={12 / 5}>
                    <Card square>
                      <CardActionArea
                        disabled={elem.header}
                        onClick={() => {                          
                          this.handleModeChange("week")
                          this.setState({ ...generateMonthData(elem.value) })
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
                            {events
                              .filter((event) =>
                                isSameDay(event.start, elem.value)
                              )
                              .map((event) => (
                                <Typography variant="caption">
                                  {event.title}
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

  createWeekView = () => {
    const { focusedDay, monthInWeeks, today } = this.state;
    const { events, setShiftManager, setShiftWorker1, setShiftWorker2 } =
      this.props;

    const focusedWeek = monthInWeeks.filter((week) =>
      week.reduce(
        (sum, next) => sum || isSameDay(focusedDay, next.value),
        false
      )
    )[0];

    const focusedWeekdays = focusedWeek.filter((row) => !row.isWeekend);

    const header = (
      <Grid container item direction="row">
        {focusedWeekdays.map((elem) => {
          return (
            <Grid item xs={12 / focusedWeekdays.length}>
              <Card square>
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="body1"
                    display={{ xs: "block", md: "none" }}
                    color={
                      isToday(elem.value)
                        ? cybTheme.palette.primary.main
                        : "GrayText"
                    }
                  >
                    {format(elem.value, "EE do")}
                  </Typography>
                  <Typography
                    variant="body1"
                    display={{ xs: "none", md: "block" }}
                    color={
                      isToday(elem.value)
                        ? cybTheme.palette.primary.main
                        : "GrayText"
                    }
                  >
                    {format(elem.value, "EEEE do")}
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

        const event = events
          .filter((event) => isSameHour(event.start, tempDayHourStart))
          
        const shiftEvent = event
          .map((event) => (
            <Stack>
              <Typography variant="caption" color="GrayText">{event.shift_manager.firstName}</Typography>
              <Typography variant="caption" color="GrayText">{event.worker_1.firstName}</Typography>
              <Typography variant="caption" color="GrayText">{event.worker_2.firstName}</Typography>
            </Stack>
          ))[0];
          
        // isWithinInterval()

        return (
          <Grid item xs={12 / 5}>
            <Card square>
              <CardActionArea
                disabled={elem.header}
                onClick={() => {
                  console.log(event[0])
                  setShiftManager(event[0].shift_manager);
                  setShiftWorker1(event[0].worker_1);
                  setShiftWorker2(event[0].worker_2);
                }}
              >
                <Stack
                  direction="column"
                  sx={{ p: 1 }}
                  height={elem.header ? "" : "16vh"}
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body2"
                    color={
                      isToday(elem.value) // || relatedEvents.length > 0
                        ? ""
                        : "GrayText"
                    }
                  >
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
    const { today, focusedDay, mode } = this.state;

    if (today == null) {
      return <></>;
    }

    const monthView = this.createMonthView();
    const weekView = this.createWeekView();

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
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                xs={5}
              >
                <Grid item xs>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => this.handleViewChange(mode, -1)}
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
                    onClick={() => this.handleViewChange(mode, 1)}
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
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => {
                      this.setState({ ...generateMonthData(today) });
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
                    onClick={() => this.handleModeChange("month")}
                  >
                    Month
                  </Button>
                </Grid>
                <Grid item xs md={3}>
                  <Button
                    variant={mode == "week" ? "contained" : "outlined"}
                    size="small"
                    fullWidth
                    onClick={() => this.handleModeChange("week")}
                  >
                    Week
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Calendar view */}
            <Grid container direction="column" rowGap={1}>
              {mode == "month" ? monthView : weekView}
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    );
  }
}

function generateMonthData(day) {
  
  const monthStart = startOfMonth(day);
  const monthEnd = endOfMonth(day);

  let monthStartOffset = 0;
  let monthEndOffset = 0;

  // calculate the number of days to display from the previous month
  if (!isSameMonth(monthStart, previousMonday(monthStart))) {
    monthStartOffset = differenceInCalendarDays(
      monthStart,
      previousMonday(monthStart)
    );
  }
  
  // calculate the number of days to display from the next month
  if (!isSunday(monthEnd)) {
    monthEndOffset = differenceInCalendarDays(
      nextSunday(monthEnd),
      monthEnd,
    );
  }
  
  let indexDay = subDays(monthStart, monthStartOffset);
  let indexDayEnd = addDays(monthEnd, monthEndOffset);
  let monthInWeeks = []

  // Generate relevant weeks
  while (indexDay <= indexDayEnd) {
    
    let tempWeek = [];
    
    for (let i = 0; i < 7; i++) {
      tempWeek.push({
        value: indexDay,
        isWeekend: isWeekend(indexDay),
        weekIndex: getWeek(indexDay),
      });
      
      indexDay = addDays(indexDay, 1);
    } 
    
    monthInWeeks.push(tempWeek)
  }

  return {
    focusedDay: day,
    monthInWeeks: monthInWeeks,
  };
}