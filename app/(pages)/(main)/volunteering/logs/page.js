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
import { getUserInitials, getUserName } from "@/app/components/textUtil";
import { cybTheme } from "@/app/components/themeCYB";
import authWrapper from "@/app/middleware/authWrapper";
import CustomTable from "@/app/components/CustomTable";
import worklogInput from "./workLogInput";
import voucherLogInput from "./voucherLogInput";

const WORK_TABLE_HEADERS = [
  { id: "workedAt_label", type: "date", name: "work date", flex: 2, sortBy: "workedAt_num" },
  { id: "duration", type: "number", name: "duration", flex: 1 },
  { id: "description", type: "string", name: "description", flex: 3 },
  { id: "loggedBy", type: "string", name: "log by", flex: 2 },
  { id: "loggedFor", type: "string", name: "log for", flex: 2 },
];

const VOUCHER_TABLE_HEADERS = [
  { id: "usedAt_label", type: "date", name: "usage date", flex: 2, sortBy: "usedAt_num" },
  { id: "amount", type: "number", name: "vouchers", flex: 2 },
  { id: "description", type: "string", name: "description", flex: 4 },
  { id: "loggedFor", type: "string", name: "log for", flex: 2 },
];

function LogsPage() {
  const [users, setUsers] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [voucherLogs, setVoucherLogs] = useState([]);
  const [voucherAmount, setVoucherAmount] = useState(0);

  const [mode, setMode] = useState(false);
  const [vouchersEarned, setVouchersEarned] = useState(0);
  const [vouchersUsed, setVouchersUsed] = useState(0);

  const [refresh, setRefresh] = useState(false);

  const session = useSession();

  useEffect(() => {
    fetch("/api/v2/users")
      .then(res => res.json())
      .then(data => {
        setUsers(
          data.users.map((e) => ({
            ...e,
            name: `${e.firstName} ${e.lastName}`
          }))
        )
      })

    fetch("/api/v2/workGroups")
      .then(res => res.json())
      .then(groups => {
        setWorkGroups(groups.groups)
      })
  }, []);

  useEffect(() => {
    fetch("/api/v2/work")
      .then(res => res.json())
      .then(resData => {
        handleWorkLogs(resData.workLogs, session, setWorkLogs, setVouchersEarned)
      })

    fetch("/api/v2/vouchers")
      .then(res => res.json())
      .then(res => {
        setVoucherAmount(res.voucherAmount)
      })
  }, [refresh])

  const worklogInputLayout = worklogInput(
    session,
    users,
    workGroups,
    setRefresh
  );

  const voucherLogInputLayout = voucherLogInput(
    session,
    voucherAmount,
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

  const registerButtonText = `Register ${useMediaQuery(cybTheme.breakpoints.down("md")) ? "" : "Work"
    }`;

  const useButtonText = `Use ${useMediaQuery(cybTheme.breakpoints.down("md")) ? "" : "Voucher"
    }`;

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
                  {registerButtonText}
                </Button>
                <Button
                  fullWidth
                  variant={!mode ? "contained" : "outlined"}
                  onClick={() => setMode(false)}
                >
                  {useButtonText}
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
    loggedBy: getUserName(log.LoggedByUser),
    loggedFor: getUserName(log.LoggedForUser),
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

  setWorkLogs(newWorkLogs);
  setVouchersEarned(newVouchersEarned);
}

export default authWrapper(LogsPage);