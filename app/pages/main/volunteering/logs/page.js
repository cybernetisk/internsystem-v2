
"use client"

import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import authWrapper from "@/app/middleware/authWrapper";
import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import CustomTable from "@/app/components/table";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import LogInput from "./logInput";

const WORK_TABLE_HEADERS = [
  { id: "workedAt", name: "log date" },
  { id: "duration", name: "duration" },
  { id: "vouchers", name: "vouchers" },
  { id: "description", name: "description" },
  { id: "loggedBy", name: "logged by" },
  { id: "loggedFor", name: "logged for" },
];

const VOUCHER_TABLE_HEADERS = [
  { id: "usedAt", name: "log date" },
  { id: "amount", name: "vouchers" },
  { id: "description", name: "description" },
  { id: "loggedFor", name: "logged for" },
];

function LogsPage() {
  
  const [users, setUsers] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [voucherLogs, setVoucherLogs] = useState([]);
  
  const [mode, setMode] = useState(true);
  const [vouchersEarned, setVouchersEarned] = useState(0)
  const [vouchersUsed, setVouchersUsed] = useState(0);
  
  
  const [refresh, setRefresh] = useState(false);
  
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
    
  }, [])
  
  useEffect(() => {
    
    prismaRequest({
      model: "voucherLog",
      method: "find",
      request: {
        include: {
          User: true,
        },
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
          
        console.log(data);  
        
        const newLogs = data.data.map((e) => {
          return {
            ...e,
            loggedFor: `${e.User.firstName} ${e.User.lastName}`,
            usedAt: format(
              parseISO(e.usedAt),
              "dd MMM 'kl.'HH:mm"
            ).toLowerCase(),
          };
        })

        setVouchersUsed(parseFloat(newVouchers));
        setVoucherLogs(newLogs)
      },
    });
    
  }, [refresh])
  
  useEffect(() => {
    
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
              "dd MMM 'kl.'HH:mm"
            ).toLowerCase(),
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

        setWorkLogs(newLogs);
        setVouchersEarned(parseFloat(newVouchers));
      },
    });
    
  }, [refresh])
  
  const layout = LogInput(
    session.data.user,
    users,
    workGroups,
    vouchersEarned,
    vouchersUsed,
    mode,
    setRefresh
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
            <CustomTable headers={WORK_TABLE_HEADERS} data={workLogs} />
          ) : (
            <CustomTable headers={VOUCHER_TABLE_HEADERS} data={voucherLogs} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
  
}

export default authWrapper(LogsPage)