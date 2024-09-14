"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import { getUserInitials } from "@/app/components/textUtil";
import { cybTheme } from "@/app/components/themeCYB";
import authWrapper from "@/app/middleware/authWrapper";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import CustomTable from "@/app/components/CustomTable";
import worklogInput from "./workLogInput";
import voucherLogInput from "./voucherLogInput";

const WORK_TABLE_HEADERS = [
  { id: "workedAt_label", type: "date",     name: "work date",    flex: 2, sortBy: "workedAt_num" },
  { id: "duration",       type: "number",   name: "duration",     flex: 1 },
  { id: "description",    type: "string",   name: "description",  flex: 3 },
  { id: "loggedBy",       type: "string",   name: "log by",       flex: 2 },
  { id: "loggedFor",      type: "string",   name: "log for",      flex: 2 },
];

const VOUCHER_TABLE_HEADERS = [
  { id: "usedAt_label",   type: "date",     name: "usage date",   flex: 2, sortBy: "usedAt_num" },
  { id: "amount",         type: "number",   name: "vouchers",     flex: 2 },
  { id: "description",    type: "string",   name: "description",  flex: 4 },
  { id: "loggedFor",      type: "string",   name: "log for",      flex: 2 },
];

function LogsPage() {
  const [users, setUsers] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [voucherLogs, setVoucherLogs] = useState([]);

  const [mode, setMode] = useState(false);
  const [vouchersEarned, setVouchersEarned] = useState(0);
  const [vouchersUsed, setVouchersUsed] = useState(0);

  const [refresh, setRefresh] = useState(false);

  const session = useSession();
  
  useEffect(() => {
    prismaRequest({
      model: "user",
      method: "find",
      request: {
        where: {
          active: true,
        },
      },
      callback: (data) =>
        setUsers(
          data.data.map((e) => ({
            ...e,
            name: `${e.firstName} ${e.lastName}`
          }))
        ),
    });

    prismaRequest({
      model: "workGroup",
      method: "find",
      callback: (data) => setWorkGroups(data.data),
    });
  }, []);

  useEffect(() => {
    prismaRequest({
      model: "workLog",
      method: "find",
      request: {
        include: {
          LoggedByUser: true,
          LoggedForUser: true,
        },
        where: {
          semesterId: session.data.semester.id,
        },
      },
      callback: (data) => handleWorkLogs(data.data, session, setWorkLogs, setVouchersEarned)
    });
    
    prismaRequest({
      model: "voucherLog",
      method: "find",
      request: {
        include: {
          LoggedForUser: true,
        },
        where: {
          semesterId: session.data.semester.id,
        },
      },
      callback: (data) => handleVoucherLogs(data.data, session, setVoucherLogs, setVouchersUsed)
    });
  }, [refresh]);
  
  const worklogInputLayout = worklogInput(
    session,
    users,
    workGroups,
    setRefresh
  );
  
  const voucherLogInputLayout = voucherLogInput(
    session,
    vouchersEarned,
    vouchersUsed,
    setRefresh
  );
  
  const inputLayout = mode ? worklogInputLayout : voucherLogInputLayout;
  const tableLayout = (
    <CustomTable
      key={mode ? "workLogTable" : "voucherLogTable"}
      headers={mode ? WORK_TABLE_HEADERS : VOUCHER_TABLE_HEADERS}
      data={mode ? workLogs : voucherLogs}
      defaultFilterBy="loggedFor"
    />
  );
  
  return (
    <Box>
      <PageHeader text="Logs" />

      <Grid container spacing={2}>
        <Grid item md={4} xs={12} alignContent="start">
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" spacing={1} pb={4}>
                <Button
                  fullWidth
                  variant={mode ? "contained" : "outlined"}
                  onClick={() => setMode(true)}
                >
                  Register{" "}
                  {useMediaQuery(cybTheme.breakpoints.down("md")) ? "" : "Work"}
                </Button>
                <Button
                  fullWidth
                  variant={!mode ? "contained" : "outlined"}
                  onClick={() => setMode(false)}
                >
                  Use{" "}
                  {useMediaQuery(cybTheme.breakpoints.down("md"))
                    ? ""
                    : "Voucher"}
                </Button>
              </Stack>

              {inputLayout}
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={8} xs={12}>
          {tableLayout}
        </Grid>
      </Grid>
    </Box>
  );
}

function handleWorkLogs(logs, session, setWorkLogs, setVouchersEarned) {
  
  const newWorkLogs = logs.map((log) => ({
    ...log,
    loggedBy: getUserInitials(log.LoggedByUser),
    loggedFor: getUserInitials(log.LoggedForUser),
    workedAt_num: parseISO(log.workedAt).getTime(),
    workedAt_label: format(parseISO(log.workedAt), "dd.MM HH:mm").toLowerCase(),
  }));

  const newVouchersEarned = logs
    .filter((e) => {
      const person = e.LoggedForUser;
      return person && person.id == session.data.user.id;
    })
    .reduce((total, e) => {
      return (total += e.duration * 0.5);
    }, 0.0);

  console.log(newWorkLogs);
    
  setWorkLogs(newWorkLogs);
  setVouchersEarned(newVouchersEarned);
}

function handleVoucherLogs(logs, session, setVoucherLogs, setVouchersUsed) {

  const newVoucherLogs = logs.map((log) => ({
    ...log,
    loggedFor: getUserInitials(log.LoggedForUser),
    usedAt_num: parseISO(log.usedAt).getTime(),
    usedAt_label: format(parseISO(log.usedAt), "dd.MM HH:mm").toLowerCase(),
  }));
  
  const newVouchersUsed = logs
    .filter((e) => {
      const person = e.LoggedForUser;
      const personId = person.id;
      return personId == session.data.user.id;
    })
    .reduce((total, e) => {
      return (total += e.amount);
    }, 0.0);

  setVouchersUsed(parseFloat(newVouchersUsed));
  setVoucherLogs(newVoucherLogs);
}

export default authWrapper(LogsPage);