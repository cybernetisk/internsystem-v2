
"use client";

import { Component, useEffect, useState } from "react";
import { Box, Card, CardActionArea, CardContent, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { useRouter } from "next/navigation";
import authWrapper from "@/app/middleware/authWrapper";
import { useSession } from "next-auth/react";
import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import Link from "next/link";

const BUTTON_CONTENT_1 = [
  { title: "Stock overview", path: "finance" },
  { title: "Logs", path: "logs" },
];

const BUTTON_CONTENT_2 = [
  {
    title: "Become volunteer",
    path: "https://nettskjema.no/a/378483#/page/1",
    external: true,
  },
  { title: "Volunteer groups", path: "groups" },
  { title: "Traditions", path: "traditions", wip: true },
];


function VolunteeringPage(params) {

  const [paidMemberships, setPaidMemberships] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [voucherLogs, setVoucherLogs] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [semester, setSemester] = useState(null);
  const [page, setPage] = useState(null);
  
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    
    prismaRequest({
      model: "user",
      method: "find",
      request: {
        include: {
          sessions: true
        },
      },
      callback: (data) => setUsersOnline(data.data.filter((e) => e.sessions.length != 0)),
    });
    
    prismaRequest({
      model: "semester",
      method: "find",
      request: {
        where: {
          id: 23
        },
        orderBy: {
          id: "desc"
        }
      },
      callback: (data) => {
        if (data.length == 0) return;
        setSemester(data.data[0])
      }
    });
    
    prismaRequest({
      model: "workLog",
      method: "find",
      callback: (data) => setWorkLogs(data.data)
    });
    
    prismaRequest({
      model: "voucherLog",
      method: "find",
      callback: (data) => setVoucherLogs(data.data),
    });
    
  }, [])
  
  // Semester-based data
  useEffect(() => {
    if (semester == null) return;
    console.log(semester)
    
    prismaRequest({
      model: "userMembership",
      method: "find",
      request: {
        where: {
          semester_id: semester.id,
        },
      },
      callback: (data) => setPaidMemberships(data.data),
    });
    
  }, [semester])
  
  const buttons1 = createButtons(BUTTON_CONTENT_1, router);
  const buttons2 = createButtons(BUTTON_CONTENT_2, router);
  
  const currentSemester = semester != undefined ? semester.semester + " " + semester.year : ""
  const totalWorkHours = workLogs.length != 0 ? workLogs.reduce((tot, cur) => tot += cur.duration,0) : 0;
  const totalVouchersUsed = voucherLogs.length != 0 ? voucherLogs.reduce((tot, cur) => tot += cur.amount,0) : 0;
  
  return (
    <Box>
      <Typography variant="h4">Volunteering</Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <Grid container>
        <Grid item container md={2.5} xs={12} spacing={0} alignContent="start">
          <Grid item width="100%" p={1}>
            <Card sx={{ padding: 3 }}>
              <Box>
                <Typography variant="body1">Tools</Typography>
                <Divider variant="fullWidth" sx={{ marginBottom: 1 }}></Divider>
                {buttons1}
              </Box>
              <Box p={3}></Box>

              <Box>
                <Typography variant="body1">New?</Typography>
                <Divider variant="fullWidth" sx={{ marginBottom: 1 }}></Divider>
                {buttons2}
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Grid
          item
          // container
          md={4.5}
          xs={12}
          // spacing={0}
          p={1}
          alignContent="start"
        >
          <Card sx={{ height: "100vh" }}>
            <CardContent>
              <Typography variant="h6">Overview: {currentSemester}</Typography>
              <Divider />

              <Stack direction="row">
                <Stack padding={2} spacing={4} direction="column">
                  <Box>
                    <Typography variant="body2">Memberships paid:</Typography>
                    <Typography variant="body2">
                      {paidMemberships.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Total volunteer hours:
                    </Typography>
                    <Typography variant="body2">{totalWorkHours}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Total vouchers used:
                    </Typography>
                    <Typography variant="body2">
                      {totalVouchersUsed.toFixed(1)} / {totalWorkHours * 0.5}
                    </Typography>
                  </Box>
                </Stack>
                <Stack padding={2} spacing={8} direction="column"></Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={5} xs={12} p={1}>
          <Card sx={{ height: "100vh" }}>
            <CardContent>
              <Typography variant="h6">something is coming here</Typography>
              <Divider sx={{ mb: 2 }}/>
              <Typography>Have a nice day :)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function createButtons(content, router) {
  
  return content.map((e) => {
    return (
      <Link
        key={"link_" + e.title}
        href={e.external ? e.path : "/pages/main/volunteering/" + e.path}
        onClick={() => {
          console.log(e.path);
          // router.push("/pages/main/" + e.path);
        }}
      >
        <Typography
          key={"link_typography" + e.title}
          variant="body1"
          gutterBottom
          sx={{
            "&:hover": { color: cybTheme.palette.primary.main },
          }}
        >
          {e.title}
        </Typography>
      </Link>
    );
  });
}

// class CustomGridItem extends Component {
  
//   render() {
    
//     const { item, router } = this.props
//     const { title, path, external, wip } = item  
    
//     return (
//       <Grid item width="100%" p={1}>
//         <Card>
//           <CardActionArea
//             sx={{ padding: 3 }}
//             onClick={() => external ? router.push(path) : router.push(`volunteering/${path}`)}
//           >
//             <Typography variant="body2">{title}</Typography>
//             <Divider variant="fullWidth" />
//             <Typography
//               variant="caption"
//               color={cybTheme.palette.primary.main}
//             >
//               {wip != undefined ? "W.I.P" : ""}
//             </Typography>
//             <Typography variant="caption">
//               {external != undefined ? "external url" : ""}
//             </Typography>
//           </CardActionArea>
//         </Card>
//       </Grid>
//     );
//   }
// }

export default VolunteeringPage