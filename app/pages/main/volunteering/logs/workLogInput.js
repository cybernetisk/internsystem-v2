
import { Box, Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import locale from "date-fns/locale/en-GB";
import { set } from "sanity";

export default function workLogInput(
  session,
  users,
  workGroups,
  setRefresh
) {
  const [registeredFor, setRegisteredFor] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [description, setDescription] = useState("");

  const [registeredForError, setRegisteredForError] = useState(false);
  const [selectedGroupError, setSelectedGroupError] = useState(false);
  const [selectedDateTimeError, setSelectedDateTimeError] = useState(false);
  const [hoursError, setHoursError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [requestResponse, setRequestResponse] = useState("");

  const handleClick = async () => {
    const isInvalid = validateWorkLogRequest(
      registeredFor,
      selectedGroup,
      selectedDateTime,
      hours,
      description,
      setRegisteredForError,
      setSelectedGroupError,
      setSelectedDateTimeError,
      setHoursError,
      setDescriptionError
    );

    if (isInvalid) return;

    const response = await prismaRequest({
      model: "workLog",
      method: "create",
      request: {
        data: {
          loggedBy: session.data.user.id,
          loggedFor: registeredFor.id,
          workedAt: selectedDateTime.toISOString(),
          duration: hours,
          description: description,
          semesterId: session.data.semester.id,
        },
      },
      callback: (data) => {
        setRegisteredFor(null);
        setSelectedGroup(null);
        setHours(0);
        setDescription("");
        setRefresh(data);
      },
    });

    if (!response.ok) {
      setRequestResponse("Failed to register work. Please try again.");
      return;
    }

    prismaRequest({
      model: "userToWorkGroup",
      method: "create",
      request: {
        data: {
          userId: registeredFor.id,
          workGroupId: selectedGroup.id,
        },
      },
    });
    
    setRegisteredFor(null);
    setRequestResponse("Work registered.");
    setTimeout(() => {
      setRequestResponse("");
    }, 5000);
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack  direction="column" spacing={2}>
        <CustomAutoComplete
          label="Registered for"
          dataLabel="name"
          subDataLabel="email"
          data={users}
          value={registeredFor}
          callback={setRegisteredFor}
          error={registeredForError}
        />
        <CustomAutoComplete
          label="Work group"
          dataLabel="name"
          data={workGroups}
          value={selectedGroup}
          callback={setSelectedGroup}
          error={selectedGroupError}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
          <DateTimePicker
            label="Start of work"
            defaultValue={selectedDateTime}
            ampm={false}
            disableOpenPicker
            onChange={(e) => setSelectedDateTime(e)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
          <DateTimePicker
            label="End of work"
            value={endDateTime} // Replacing defaultValue to make it synced with the actual value
            ampm={false}
            disableOpenPicker
            onChange={(e) => {
              if (e < selectedDateTime) return; // Prevent endDateTime from being before startDateTime
              setEndDateTime(e);
              setHours(Math.round(((e - selectedDateTime) / 3600000) * 10) / 10) // Update hours
            }}
          />
        </LocalizationProvider>
        <CustomNumberInput
          label="Hours worked"
          value={hours}
          setValue={(value) => {
            setHours(value);
            setEndDateTime(new Date(selectedDateTime.getTime() + value * 3600000)); // Update endDateTime
          }}
          check={(data) => data.match(/[^0-9.]/) || data.match(/[.]{2,}/g)}
          error={hoursError}
        />
        <TextField
          label="Description"
          size="small"
          multiline
          InputLabelProps={{ shrink: true }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={descriptionError}
        />
        <Button variant="outlined" onClick={handleClick}>
          Register work
        </Button>
      </Stack>
      <Typography variant="subtitle1">
        {requestResponse != "" ? (
          requestResponse
        ) : (
          <Skeleton
            animation={false}
            variant="text"
            sx={{ bgcolor: "inherit" }}
          />
        )}
      </Typography>
    </Stack>
  );
}

function validateWorkLogRequest(
  registeredFor,
  selectedGroup,
  selectedDateTime,
  hours,
  description,
  setRegisteredForError,
  setSelectedGroupError,
  setSelectedDateTimeError,
  setHoursError,
  setDescriptionError
) {
  
  // Define an object to store the errors
  const errors = {
    registeredForError: registeredFor == null,
    selectedGroupError: selectedGroup == null,
    selectedDateTimeError: false, // TODO: add semester validation
    hoursError: Number.isNaN(hours) || hours <= 0 || hours > 24,
    descriptionError: description.length == 0,
  };

  // Update the error states using the setters
  setRegisteredForError(errors.registeredForError);
  setSelectedGroupError(errors.selectedGroupError);
  setSelectedDateTimeError(errors.selectedDateTimeError);
  setHoursError(errors.hoursError);
  setDescriptionError(errors.descriptionError);

  // Return true if any error exists
  return Object.values(errors).some((error) => error);
}
