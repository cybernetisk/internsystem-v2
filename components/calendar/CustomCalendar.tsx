import React from 'react';
import { Scheduler } from '@aldabil/react-scheduler';

function Calendar() {
  return (
    <Scheduler
      view="month"
      events={[
        {
          event_id: 1,
          title: "Event 1",
          start: new Date("2021-05-02T09:30:00"),
          end: new Date("2021-05-02T10:30:00"),
        },
        {
          event_id: 2,
          title: "Event 2",
          start: new Date("2021-05-04T10:00:00"),
          end: new Date("2021-05-04T11:00:00"),
        },
      ]}
    />
  );
}

export default Calendar;
