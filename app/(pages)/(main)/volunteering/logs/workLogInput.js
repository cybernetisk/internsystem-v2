import {
  Button,
  Fab,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import CustomMultiAutoComplete from "@/app/components/input/CustomMultiAutocomplete";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import locale from "date-fns/locale/en-GB";
import { CalendarToday, PunchClock } from "@mui/icons-material";
import TextFieldWithX from "@/app/components/input/TextFieldWithX";

export default function workLogInput(session, users, workGroups, setRefresh) {
  const [registeredFor, setRegisteredFor] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [description, setDescription] = useState("");
  const [shouldInputHours, setShouldInputHours] = useState(false);
  const [endInputMethodTooltip, setEndInputMethodTooltip] = useState(
    "Change to 'End of work'"
  );

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

    for (let user of registeredFor) {
      fetch("/api/v2/workLogs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          loggedBy: session.data.user.id,
          loggedFor: user.id,
          workedAt: selectedDateTime.toISOString(),
          duration: hours,
          description: description,
          semesterId: session.data.semester.id,
        }),
      });

      fetch("/api/v2/workGroups", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          workGroupId: selectedGroup.id,
        }),
      });
    }
    setRegisteredFor([]);
    setSelectedGroup(null);
    setHours(0);
    setDescription("");
    setRefresh("");

    setRequestResponse("Work registered.");
    setTimeout(() => {
      setRequestResponse("");
    }, 5000);
  };

  const switchEndInputMethod = () => {
    if (!shouldInputHours) {
      setShouldInputHours(true);
      document
        .querySelector(".endDateTime")
        .setAttribute("style", "display: inline");
      document.querySelector(".hours").setAttribute("style", "display: none");
      setEndInputMethodTooltip("Change to 'Hours worked'");
    } else {
      setShouldInputHours(false);
      document
        .querySelector(".endDateTime")
        .setAttribute("style", "display: none");
      document.querySelector(".hours").setAttribute("style", "display: inline");
      setEndInputMethodTooltip("Change to 'End of work'");
    }
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="column" spacing={2}>
        <CustomMultiAutoComplete
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
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <DateTimePicker
            label="Start of work"
            defaultValue={selectedDateTime}
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
            ampm={false}
            disableOpenPicker
            onChange={(e) => setSelectedDateTime(e)}
            />
        </LocalizationProvider>
        <Stack direction="row" alignItems={"stretch"}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={locale}
          >
            <DateTimePicker
              className="endDateTime"
              sx={{ display: "none" }}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
              label="End of work"
              value={endDateTime} // Replacing defaultValue to make it synced with the actual value
              ampm={false}
              disableOpenPicker
              onChange={(e) => {
                if (e < selectedDateTime) return; // Prevent endDateTime from being before startDateTime
                setEndDateTime(e);
                setHours(
                  Math.round(((e - selectedDateTime) / 3600000) * 10) / 10
                ); // Update hours
              }}
            />
          </LocalizationProvider>
          <CustomNumberInput
            className="hours"
            label="Hours worked"
            value={hours}
            setValue={(value) => {
              setHours(value);
            }}
            check={(data) => data.match(/[^0-9.]/) || data.match(/[.]{2,}/g)}
            error={hoursError}
          />
          <Tooltip
            className="endInputMethodTooltip"
            title={endInputMethodTooltip}
          >
            <Fab
              className="endInputMethodChangeButton"
              size="small"
              color="primary"
              style={{
                marginLeft: "10px",
                padding: "10px",
              }}
              onClick={() => {
                switchEndInputMethod();
              }}
            >
              {shouldInputHours ? <PunchClock /> : <CalendarToday />}
            </Fab>
          </Tooltip>
        </Stack>
        <TextFieldWithX
          label="Description"
          name="worklogdescription"
          value={description}
          setValue={setDescription}
          size="small"
          multiline
          InputLabelProps={{ shrink: true }}
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
    registeredForError: registeredFor.length == 0,
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
