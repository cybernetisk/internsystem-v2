
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CustomAutoComplete from "@/components/input/CustomAutocomplete";
import CustomNumberInput from "@/components/input/CustomNumberInput";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import locale from "date-fns/locale/en-GB"; 

export default function LogInput(
  session,
  users,
  workGroups,
  vouchersEarned,
  vouchersUsed,
  mode,
  setRefresh,
) {
  const [registeredFor, setRegisteredFor] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [description, setDescription] = useState("");
  
  const [registeredForError, setRegisteredForError] = useState(false);
  const [selectedGroupError, setSelectedGroupError] = useState(false);
  const [selectedDateTimeError, setSelectedDateTimeError] = useState(false);
  const [hoursError, setHoursError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [numVouchers, setNumVouchers] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("");
  
  const [numVouchersError, setNumVouchersError] = useState(false);
  const [descriptionVoucherError, setDescriptionVoucherError] = useState(false);
  
  const handleWorkClick = async () => {
    
    const isInvalid = validateLogRequest(
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
    
    if (isInvalid) {
      return;
    }
    
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
          semesterId: session.data.semester.id
        },
      },
      callback: (data) => {
        setRegisteredFor(null);
        setSelectedGroup(null);
        setHours(0);
        setDescription("");
        setRefresh(data);
      }
    });
    
    if (!response.ok) return;
    
    prismaRequest({
      model: "userToWorkGroup",
      method: "create",
      request: {
        data: {
          userId: registeredFor.id,
          workGroupId: selectedGroup.id
        }
      }
    })
    
  };

  const handleVoucherClick = () => {
    console.log("handleVoucheClick")
    
    const isInvalid = validateVoucherRequest(
      numVouchers,
      descriptionVoucher,
      vouchersEarned,
      setNumVouchersError,
      setDescriptionVoucherError
    );
    
    if (isInvalid) {
      return;
    }
    
    prismaRequest({
      model: "voucherLog",
      method: "create",
      request: {
        data: {
          loggedFor: session.data.user.id,
          amount: numVouchers,
          description: descriptionVoucher,
          semesterId: session.data.semester.id,
        },
      },
      callback: (data) => {
        setNumVouchers(0);
        setDescriptionVoucher("");
        setRefresh(data);
      },
    });
  };

  return mode
    ? WorkInput({
        users,
        workGroups,
        registeredBy: session.data.user,

        registeredFor,
        selectedGroup,
        selectedDateTime,
        hours,
        description,

        setRegisteredFor,
        setSelectedGroup,
        setSelectedDateTime,
        setHours,
        setDescription,
        handleWorkClick,
        registeredForError,
        selectedGroupError,
        selectedDateTimeError,
        hoursError,
        descriptionError,
      })
    : VoucherInput({
        vouchersEarned,
        vouchersUsed,
        numVouchers,
        descriptionVoucher,
        setNumVouchers,
        setDescriptionVoucher,
        handleVoucherClick,
        numVouchersError,
        descriptionVoucherError,
      });
}

function validateLogRequest(
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
  let registeredForError = registeredFor == null;
  let selectedGroupError = selectedGroup == null;
  let selectedDateTimeError = false;
  let hoursError = hours <= 0 || hours > 24;
  let descriptionError = description.length == 0;

  setRegisteredForError(registeredForError);
  setSelectedGroupError(selectedGroupError);
  setSelectedDateTimeError(selectedDateTimeError); // TODO: add semester validation
  setHoursError(hoursError);
  setDescriptionError(descriptionError);

  return (
    registeredForError ||
    selectedGroupError ||
    selectedDateTimeError ||
    hoursError ||
    descriptionError
  );
}

function validateVoucherRequest(
  numVouchers,
  descriptionVoucher,
  vouchersEarned,
  setNumVouchersError,
  setDescriptionVoucherError,
) {
  let numVouchersError = numVouchers <= 0 || numVouchers > vouchersEarned;
  let descriptionVoucherError = descriptionVoucher.length == 0;
  
  setNumVouchersError(numVouchersError);
  setDescriptionVoucherError(descriptionVoucherError);
  
  return numVouchersError || descriptionVoucherError;
}


function WorkInput(props) {
  
  // console.log(props)
  
  return (
    <Stack spacing={2}>
      <CustomAutoComplete
        label="registered by"
        dataLabel="name"
        data={props.users}
        defaultValue={props.registeredBy}
        error={false}
      />
      <CustomAutoComplete
        label="registered for"
        dataLabel="name"
        subDataLabel="email"
        data={props.users}
        value={props.registeredFor}
        callback={props.setRegisteredFor}
        error={props.registeredForError}
      />
      <CustomAutoComplete
        label="work group"
        dataLabel="name"
        data={props.workGroups}
        value={props.selectedGroup}
        callback={props.setSelectedGroup}
        error={props.selectedGroupError}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
        <DateTimePicker
          label="Start time"
          defaultValue={props.selectedDateTime}
          ampm={false}
          disableOpenPicker
          onChange={(e) => props.setSelectedDateTime(e)}
        />
      </LocalizationProvider>
      <CustomNumberInput
        label="# of hours"
        value={props.hours}
        setValue={props.setHours}
        check={(data) => data.match(/[^0-9.]/) || data.match(/[.]{2,}/g)}
        error={props.hoursError}
      />
      <TextField
        label="Description"
        size="small"
        multiline
        InputLabelProps={{ shrink: true }}
        value={props.description}
        onChange={(e) => props.setDescription(e.target.value)}
        error={props.descriptionError}
      />
      <Button variant="outlined" onClick={props.handleWorkClick}>
        Register
      </Button>
    </Stack>
  );
}

function VoucherInput(props) {
  const diff = props.vouchersEarned - props.vouchersUsed;

  return (
    <Stack direction="column" spacing={2}>
      <Grid container direction="row">
        <Grid item xs={6}>
          <Typography variant="body2">Earned:</Typography>
          <Typography variant="body2">Used:</Typography>
          <Typography variant="body2">Remaining:</Typography>
          <Typography variant="body2" pt={2}>
            Value:
          </Typography>
        </Grid>

        <Grid
          item
          container
          xs={6}
          direction="column"
          alignContent="flex-start"
          alignItems="flex-end"
        >
          <Typography variant="body2">
            {props.vouchersEarned.toFixed(1)}
          </Typography>
          <Typography variant="body2">
            {props.vouchersUsed.toFixed(1)}
          </Typography>
          <Typography variant="body2">{diff}</Typography>
          <Typography variant="body2" pt={2}>
            {diff * 25}
          </Typography>
          <Typography variant="caption">25kr / voucher</Typography>
        </Grid>
        {/* <Grid item container md={4} xs={12} direction="column" alignContent="flex-start" justifyContent="flex-end">
        </Grid> */}
      </Grid>
      <CustomNumberInput
        label={"# of vouchers"}
        value={props.numVouchers}
        setValue={props.setNumVouchers}
        check={(data) => data.match(/[^0-9]/)}
        error={props.numVouchersError}
      />
      <TextField
        label="Description"
        size="small"
        multiline
        InputLabelProps={{ shrink: true }}
        value={props.descriptionVoucher}
        error={props.descriptionVoucherError}
        onChange={(e) => props.setDescriptionVoucher(e.target.value)}
      />
      <Button variant="outlined" onClick={props.handleVoucherClick}>
        Use
      </Button>
    </Stack>
  );
}