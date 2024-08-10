import React, { useState } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';
import { View } from '@aldabil/react-scheduler/components/nav/Navigation';

// Depends on the format of the fetched events
interface CalEvent {
  event_id: number;
  title: string;
  start: Date;
  end: Date;
  disabled?: boolean;
  admin_id?: number[] | number;
  color?: string;
}

const processCalToEvent = (cal_events: CalEvent[]): ProcessedEvent[] => {
  const new_events: ProcessedEvent[] = cal_events.map(event => ({
    event_id: event.event_id,
    title: event.title,
    start: event.start,
    end: event.end,
    disabled: event.disabled || false,
    color: event?.color ? event.color : event.event_id % 2 === 0 ? "#D02783" : "#2783D0",
    editable: true,
    deletable: true,
    draggable: false,
  }));

  return new_events;
}

//Dummy events while waiting for implementation
const EVENTS: CalEvent[] = [
  {
    event_id: 1,
    title: "Event 1",
    start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    disabled: true,
    admin_id: [1, 2, 3, 4],
  },
  {
    event_id: 2,
    title: "Event 2",
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    admin_id: 2,
    color: "#50b500",
  }
];

function Calendar() {

  // TODO: Fetch events somehow
  // const calendar_events = fetch_events()
  const PROCESSED_EVENTS = processCalToEvent(EVENTS)
  
  const standardViewType: View = "week"

  const [events, setEvents] = useState(PROCESSED_EVENTS)
  const [viewType, setViewType] = useState(standardViewType)


  return (
    <Scheduler
      view={viewType}
      events={events}
      agenda={false}
      key={viewType} // updates when changes to elements here
      hourFormat='24'
      translations={{
        navigation: {
        month: "Måned",
        week: "Uke",
        day: "Dag",
        today: "I dag",
        agenda: "Agenda"
        },
        form: {
        addTitle: "Legg til hendelse",
        editTitle: "Endre hendelse",
        confirm: "Bekreft",
        delete: "Slett",
        cancel: "Avbryt"
        },
        event: {
        title: "Tittel",
        start: "Start",
        end: "Slutt",
        allDay: "Heldags"
       },
        validation: {
        required: "Påkrevd",
        invalidEmail: "Ugyldig epost",
        onlyNumbers: "Kun tall",
        min: "Minimum {{min}} tegn",
        max: "Maximum {{max}} tegn"
        },
        moreEvents: "Flere...",
        noDataToDisplay: "Ingen data",
        loading: "Laster..."
       }}
      month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6], 
          weekStartOn: 1, // Monday = 1
          startHour: 0, 
          endHour: 24,
          navigation: true,
          disableGoToDay: false
      }}
      week={{ 
        weekDays: [0, 1, 2, 3, 4, 5, 6], 
        weekStartOn: 1, // Monday = 1
        startHour: 0, 
        endHour: 24,
        step: 120,
        navigation: true,
        disableGoToDay: false
        }}
      day={{
        startHour: 0, 
        endHour: 24, 
        step: 60,
        navigation: true
      }}
    />
  );
}

export default Calendar;
