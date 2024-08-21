
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
import { nb } from "date-fns/locale";
import { cybTheme } from "./themeCYB";

const DayLabels = [
  { 
    header: true, 
    label: "Monday",
    abbr: "Mon",
  },
  { 
    header: true, 
    label: "Tuesday",
    abbr: "Tue",
  },
  { 
    header: true, 
    label: "Wednesday",
    abbr: "Wed",
  },
  { 
    header: true, 
    label: "Thursday",
    abbr: "Thu",
  },
  { 
    header: true, 
    label: "Friday",
    abbr: "Fri",
  },
  { 
    header: true, 
    label: "Saturday",
    abbr: "Sat",
    weekend: true,
  },
  { 
    header: true, 
    label: "Sunday",
    abbr: "Sun",
    weekend: true,
  },
]

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

    const weekDays = DayLabels.filter((day) => !day.weekend);

    const header = (
      <Grid container item direction="row">
        {weekDays.map((elem) => {
          return (
            <Grid item xs={12 / weekDays.length}>
              <Card square>
                <Box sx={{ p: 1 }} height={elem.header ? "" : "14vh"}>
                  <Typography variant="body1" color="GrayText">
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
                        onClick={() =>
                          this.setState({ focusedDay: elem.value })
                        }
                      >
                        <Box sx={{ p: 1 }} height={elem.header ? "" : "14vh"}>
                          <Typography
                            color={
                              isToday(elem.value)
                                ? cybTheme.palette.primary.main
                                : !isSameMonth(elem.value, focusedDay)
                                ? "GrayText"
                                : ""
                            }
                          >
                            {/* {elem.label} */}
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
                  <Typography
                    variant="body1"
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
    for (let i = 8; i < 18; i += 2) {
      const hours = focusedWeekdays.map((elem) => {
        const tempDayHourStart = addHours(elem.value, i);
        const tempDayHourEnd = addHours(elem.value, i + 2);

        const relatedEvents = events
          .filter((event) => isSameHour(event.start, tempDayHourStart))
          .map((event) => (
            <Stack>
              <Typography variant="caption">{event.shift_manager}</Typography>
              <Typography variant="caption">{event.worker_1}</Typography>
              <Typography variant="caption">{event.worker_2}</Typography>
            </Stack>
          ));

        return (
          <Grid item xs={12 / 5}>
            <Card
              square
              sx={{
                backgroundColor: relatedEvents.length > 0 ? "green" : "",
              }}
            >
              <CardActionArea
                disabled={elem.header}
                onClick={() => this.setState({ focusedDay: elem.value })}
              >
                <Box sx={{ p: 1 }} height={elem.header ? "" : "14vh"}>
                  <Typography
                    variant="body1"
                    color={
                      isToday(elem.value) || relatedEvents.length > 0
                        ? ""
                        : "GrayText"
                    }
                  >
                    {format(tempDayHourStart, "HH:mm")} -{" "}
                    {format(tempDayHourEnd, "HH:mm")}
                  </Typography>

                  <Stack>{relatedEvents}</Stack>
                </Box>
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
    const {
      today,
      focusedDay,
      mode,
    } = this.state;

    if (today == null) {
      return <></>;
    }

    const monthView = this.createMonthView();
    const weekView = this.createWeekView();

    return (
      <Box>
        <Card elevation={3}>
          <CardContent>
            <Stack direction="column" spacing={2}>
              {/* Calendar Controls */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => this.handleViewChange(mode, -1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => this.handleViewChange(mode, 1)}
                  >
                    Next
                  </Button>
                  <Typography variant="body1">
                    {format(focusedDay, "MMMM yyyy", { locale: nb })}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant={mode == "month" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => this.handleModeChange("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={mode == "week" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => this.handleModeChange("week")}
                  >
                    Week
                  </Button>
                </Stack>
              </Stack>

              {/* Calendar view */}
              <Grid container direction="column" rowGap={1}>
                {mode == "month" ? monthView : weekView}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Box>
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