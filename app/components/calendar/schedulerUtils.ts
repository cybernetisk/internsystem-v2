
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  getWeek,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSunday,
  isWeekend,
  nextSunday,
  previousMonday,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";


export function getFocusedWeekdays(
  focusedDay: Date,
  data: Array<
    Array<{
      value: Date;
      isWeekend: boolean;
      weekIndex: number;
      shifts: Array<{ shiftPosition: number; title: string; startAt: Date }>;
    }>
  >
) {
  const focusedWeek = data.filter((week) =>
    week.some((day) => isSameDay(focusedDay, day.value))
  )[0];

  return focusedWeek.filter((day) => !day.isWeekend);
}

export function getFilteredCalendarData(
  focusedDay: Date,
  mode: string,
  calendarData: Array<
    Array<{
      value: Date;
      isWeekend: boolean;
      weekIndex: number;
      shifts: Array<{ shiftPosition: number; title: string; startAt: Date }>;
    }>
  >
) {
  const modeOperations = {
    month: isSameMonth,
    week: isSameWeek
  };
  
  return calendarData.filter((row) =>
    row.some((day) => modeOperations[mode](focusedDay, day.value) && !day.isWeekend)
  );
}

export function generateCalendarData(
  focusedDay: Date,
  mode: string,
  shifts: Array<{
    isReal: boolean;
    shiftPosition: number;
    startAt: Date;
  }>
) {
  const modeOperations = {
    month: {
      start: startOfMonth,
      end: endOfMonth,
      same: isSameMonth,
    },
    week: {
      start: startOfWeek,
      end: endOfWeek,
      same: isSameWeek,
    },
  };

  const start = modeOperations[mode].start(focusedDay);
  const end = modeOperations[mode].end(focusedDay);

  // calculate the number of days to display from the previous month
  const startOffset = modeOperations[mode].same(start, previousMonday(start))
    ? 0
    : differenceInCalendarDays(start, previousMonday(start));

  // calculate the number of days to display from the next month
  const endOffset = isSunday(end)
    ? 0
    : differenceInCalendarDays(nextSunday(end), end);

  //
  let currentDay: Date = subDays(start, startOffset);
  let lastDayInCalendar: Date = addDays(end, endOffset);

  let calendarDays = [];

  // Generate relevant weeks
  while (currentDay <= lastDayInCalendar) {
    let week = [];

    for (let i = 0; i < 7; i++) {
      let dayShifts = shifts.filter((e) => isSameDay(currentDay, e.startAt));
      let filledPositions = dayShifts.map((e) => e.shiftPosition);

      // Ensure that each shift position (0, 1, 2) is filled, adding placeholders if necessary
      for (let position = 0; position < 3; position++) {
        if (!filledPositions.includes(position)) {
          dayShifts.push({
            isReal: false,
            shiftPosition: position,
            startAt: new Date(new Date(currentDay).setHours(10 + position * 2)),
          });
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

    calendarDays.push(week);
  }

  return calendarDays;
}

export function getInitials(name: string) {
    let nameParts = name.trim().split(' ');
    let firstName = nameParts[0];
    
    let initials = nameParts.slice(1).map(part => {
        // Handle names with dashes
        return part.split('-').map(subPart => subPart[0].toUpperCase()).join('');
    }).join('');
    
    return `${firstName} ${initials}`;
}