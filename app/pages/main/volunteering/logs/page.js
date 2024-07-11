
"use client"

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Component, useEffect, useState } from "react";
import authWrapper from "@/app/middleware/authWrapper";
import Link from "next/link";
import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import CustomTable from "@/app/components/table";
import prisma from "@/prisma/prismaClient";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import locale from "date-fns/locale/en-GB";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";

const WORK_TABLE_HEADERS = [
  { id: "workedAt", name: "log date" },
  { id: "duration", name: "duration" },
  { id: "vouchers", name: "vouchers" },
  { id: "description", name: "description" },
  { id: "loggedBy", name: "logged by" },
  { id: "loggedFor", name: "logged for" },
];

const VOUCHER_TABLE_HEADERS = [
  { id: "workedAt", name: "log date" },
  { id: "duration", name: "duration" },
  { id: "vouchers", name: "vouchers" },
  { id: "description", name: "description" },
  { id: "loggedBy", name: "logged by" },
  { id: "loggedFor", name: "logged for" },
];

function LogsPage() {
  
  const [users, setUsers] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mode, setMode] = useState(true);
  const [vouchersEarned, setVouchersEarned] = useState(0)
  const [vouchersUsed, setVouchersUsed] = useState(0);
  // const [vouchers, setVouchers] = useState(0)
  
  const session = useSession();
  
  useEffect(() => {
    
    prismaRequest({
      model: "user",
      method: "find",
      callback: (data) => {
        if (data.data.length != 0) {
          setUsers(
            data.data.map((e) => {
              return { ...e, name: `${e.firstName} ${e.lastName}`}
            })
          )
        } 
      }
    });
    
    prismaRequest({
      model: "workGroup",
      method: "find",
      callback: (data) => setWorkGroups(data.data),
    });
    
    prismaRequest({
      model: "workLog",
      method: "find",
      request: {
        include: {
          LoggedByUser: true,
          LoggedForUser: true,
        },
      },
      callback: (data) => {
        if (data.length == 0) return;

        const newLogs = data.data.map((e) => {
          const p1 = e.LoggedByUser;
          const p2 = e.LoggedForUser;
          return {
            ...e,
            loggedBy: `${p1.firstName} ${p1.lastName}`,
            loggedFor: `${p2.firstName} ${p2.lastName}`,
            vouchers: e.duration * 0.5,
            workedAt: format(
              parseISO(e.workedAt),
              "dd MMM yyyy, 'kl.'kk:mm"
            ),
          };
        });

        const newVouchers = data.data
          .filter((e) => {
            const person = e.LoggedForUser;
            const personId = person.id;
            return personId == session.data.user.id;
          })
          .reduce((total, e) => {
            return (total += e.duration * 0.5);
          }, 0.0);

        setLogs(newLogs);
        setVouchersEarned(parseFloat(newVouchers));
      },
    });
    
    prismaRequest({
      model: "voucherLog",
      method: "find",
      request: {
        include: {
          User: true
        }
      },
      callback: (data) => {
        if (data.length == 0) return;
        
        const newVouchers = data.data
          .filter((e) => {
            const person = e.User;
            const personId = person.id;
            return personId == session.data.user.id;
          })
          .reduce((total, e) => {
            return (total += e.amount);
          }, 0.0);
          
        setVouchersUsed(parseFloat(newVouchers));
      }
    });
    
  }, [])
  
  const layout = InputForm(
    session.data.user,
    users,
    workGroups,
    vouchersEarned,
    vouchersUsed,
    mode
  );
  
  if (session.status != "authenticated") {
    return;
  }
  
  return (
    <Box>
      <Container disableGutters sx={{ my: 2 }}>
        <Typography variant="h4">Logs</Typography>
      </Container>

      <Grid container>
        <Grid item container md={4} xs={12} spacing={0} alignContent="start">
          <Grid item width="100%" p={1}>
            <Card
              sx={{
                padding: 3,
                backgroundColor: cybTheme.palette.background.default,
              }}
            >
              <Stack direction="row" spacing={1} pb={4}>
                <Button
                  variant={mode ? "contained" : "outlined"}
                  onClick={() => setMode(true)}
                >
                  Register work
                </Button>
                <Button
                  variant={!mode ? "contained" : "outlined"}
                  onClick={() => setMode(false)}
                >
                  Use voucher
                </Button>
              </Stack>

              {layout}
            </Card>
          </Grid>
        </Grid>

        <Grid item md={8} xs={12} p={1}>
          <Typography variant="h6">
            {mode ? "Work logs" : "Voucher logs"}
          </Typography>
          {mode ? (
            <CustomTable headers={WORK_TABLE_HEADERS} data={logs} />
          ) : (
            <CustomTable headers={VOUCHER_TABLE_HEADERS} data={logs} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
  
}

function InputForm(user, users, workGroups, vouchersEarned, vouchersUsed, mode) {
  
  const [registeredFor, setRegisteredFor] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [description, setDescription] = useState("");
  
  const [numVouchers, setNumVouchers] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("")
  
  const handleWorkClick = () => {
    prismaRequest({
      model: "workLog",
      method: "create",
      request: {
        data: {
          loggedBy: user.id,
          loggedFor: registeredFor.id,
          workedAt: selectedDateTime.toISOString(),
          duration: hours,
          description: description,
        }
      },
    });
  };
  
  const handleVoucherClick = () => {
    prismaRequest({
      model: "VoucherLog",
      method: "create",
      request: {
        data: {
          loggedFor: user.id,
          amount: numVouchers,
          description: descriptionVoucher,
        },
      },
    });
  };
  
  return mode
    ? WorkInput({
        users,
        workGroups,
        registeredBy: user,
        selectedDateTime,
        hours,
        description,
        setRegisteredFor,
        setSelectedGroup,
        setSelectedDateTime,
        setHours,
        setDescription,
        handleWorkClick,
      })
    : VoucherInput({
        vouchersEarned,
        vouchersUsed,
        numVouchers,
        descriptionVoucher,
        setNumVouchers,
        setDescriptionVoucher,
        handleVoucherClick,
      });
  
}

function WorkInput(props) {
  
  return (
    <Stack spacing={2}>
      <CustomAutoComplete
        label={"registered by"}
        data={props.users}
        dataLabel={"name"}
        defaultValue={props.registeredBy.name}
      />
      <CustomAutoComplete
        label={"registered for"}
        data={props.users}
        dataLabel={"name"}
        callback={props.setRegisteredFor}
      />
      <CustomAutoComplete
        label={"work group"}
        data={props.workGroups}
        dataLabel={"name"}
        callback={props.setSelectedGroup}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
        <DateTimePicker
          defaultValue={props.selectedDateTime}
          ampm={false}
          disableOpenPicker
          label="Start time"
          onChange={(e) => props.setSelectedDateTime(e)}
        />
      </LocalizationProvider>
      <CustomNumberInput
        label={"# of hours"}
        value={props.hours}
        setValue={props.setHours}
        check={(data) => data.match(/[^0-9.]/) || data.match(/[.]{2,}/g)}
      />
      <TextField
        label="Description"
        size="small"
        multiline
        InputLabelProps={{ shrink: true }}
        value={props.description}
        onChange={(e) => props.setDescription(e.target.value)}
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
          <Typography variant="body2" pt={2}>Value:</Typography>
        </Grid>

        <Grid item container xs={6} direction="column" alignContent="flex-start" alignItems="flex-end">
          <Typography variant="body2">{props.vouchersEarned.toFixed(1)}</Typography>
          <Typography variant="body2">{props.vouchersUsed.toFixed(1)}</Typography>
          <Typography variant="body2">{diff}</Typography>
          <Typography variant="body2" pt={2}>{diff * 25}</Typography>
          <Typography variant="caption">25kr / voucher</Typography>
        </Grid>
        {/* <Grid item container md={4} xs={12} direction="column" alignContent="flex-start" justifyContent="flex-end">
        </Grid> */}
      </Grid>
      <CustomNumberInput
        label={"# of vouchers"}
        value={props.numVouchers}
        setValue={props.setNumVouchers}
        check={(data) => data.match(/[^0-9]/) || parseFloat(data) > diff}
      />
      <TextField
        label="Description"
        size="small"
        multiline
        InputLabelProps={{ shrink: true }}
        value={props.descriptionVoucher}
        onChange={(e) => props.setDescriptionVoucher(e.target.value)}
      />
      <Button variant="outlined" onClick={props.handleVoucherClick}>
        Use
      </Button>
    </Stack>
  );
}

class CustomAutoComplete extends Component {
  
  render() {
    const { label, data, dataLabel, callback, defaultValue } = this.props
    
    return (
      <Autocomplete
        disabled={defaultValue != undefined}
        defaultValue={defaultValue != undefined ? defaultValue : null}
        size="small"
        fullWidth
        disablePortal
        options={data.map((e) => e[dataLabel])}
        onChange={(e, v) => {
          callback(data.filter((e) => e[dataLabel] == v)[0]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{ shrink: true }}
            label={label}
          />
        )}
      />
    );
  }
}

class CustomNumberInput extends Component {
  render() {
    const { label, value, setValue, check } = this.props
    
    return (
      <TextField
        label={label}
        size="small"
        InputLabelProps={{ shrink: true }}
        value={value}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          const value = check(e.target.value) ? 0 : e.target.value;
          const float = parseFloat(value);
          const rounded = Math.round(float * 100);
          setValue(rounded / 100);
        }}
        onChange={(e) => {
          const value = e.target.value;
          if (value != "") {
            if (check(value)) return;
          }
          setValue(value);
        }}
      />
    );
  }
}

export default authWrapper(LogsPage)