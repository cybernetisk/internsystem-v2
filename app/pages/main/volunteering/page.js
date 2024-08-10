
"use client";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  PageBuilder,
  PageHeader,
  PageHeaderSkeleton,
} from "@/components/sanity/PageBuilder";
import { useEffect, useState } from "react";
import { cybTheme } from "@/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";

const BUTTON_CONTENT_1 = [
  // { title: "Economy", path: "volunteering/economy" },
  { title: "Logs", path: "/pages/main/volunteering/logs" },
  { title: "Membership", path: "/pages/main/volunteering/membership" },
  { title: "Website content", path: "/studio" },
];

async function sanityFetch(setPages) {
  const groups = `*[_type == "workGroup"]|order(orderRank) {
    title,
    header,
    pageContent,
  }`;

  const pageContent = await sanityClient.fetch(groups);
  let pages;

  if (pageContent.length) {
    pages = pageContent.map((e) => PageBuilder(e));
  }

  setPages(pages);
}


function VolunteeringPage(params) {

  const [paidMemberships, setPaidMemberships] = useState([]);
  const [voucherLogs, setVoucherLogs] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [semester, setSemester] = useState(null);
  const [pages, setPages] = useState(null);
  const [numVolunteers, setNumVolunteers] = useState(null);
  
  useEffect(() => {
    sanityFetch(setPages);
  }, []);
  
  
  useEffect(() => {
    
    prismaRequest({
      model: "semester",
      method: "find",
      request: {
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
    
    prismaRequest({
      model: "userToWorkGroup",
      method: "find",
      callback: (data) => {
        if (data.length == 0) return;
        setNumVolunteers(data.data);
      }
    })
    
  }, [])
  
  // Semester-based data
  useEffect(() => {
    if (semester == null) return;
    
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
  
  return (
    <Box>
      <PageHeader text="Volunteering" variant="h4" />

      <Grid container direction="row" spacing={4}>
        <Grid item md={2.5} xs={12}>
          {createNavigation(semester, paidMemberships, workLogs, voucherLogs, numVolunteers)}
        </Grid>

        <Grid item md xs={12}>
          {pages != null ? pages.map((e, i) => {
            return (
              <Box key={`page${i}_box`}>
                <PageHeader
                  key={`page${i}_pageheader`}
                  text={e.header}
                  variant="h5"
                  divider={false}
                  gutter={false}
                />
                {e.content}
                <Divider key={`page${i}_pageheader_divider`} sx={{ mb: 4 }} />
              </Box>
            );
          }) : <></>}
        </Grid>
      </Grid>
      
    </Box>
  );
}

function createNavigation(semester, paidMemberships, workLogs, voucherLogs, numVolunteers) {
  
  const buttonGroup1 = createButtons(BUTTON_CONTENT_1);
  
  const currentSemester = semester != undefined ? semester.semester + " " + semester.year : null
  const membershipsPaid = paidMemberships.length.toLocaleString();
  const totalWorkHours = workLogs.length != 0 ? workLogs.reduce((tot, cur) => tot += cur.duration,0) : 0;
  const TWHString = totalWorkHours.toLocaleString();
  const totalVouchersUsed = voucherLogs.length != 0 ? voucherLogs.reduce((tot, cur) => tot += cur.amount,0) : 0;
  const totalNumVolunteers = numVolunteers ? numVolunteers.length : 0;
  
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item md={2} xs>
        <Card elevation={3}>
          <CardContent>
            <PageHeader text="TOOLS" variant="body1" gutter={false} />
            {buttonGroup1}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs alignContent="start">
        <Card elevation={3}>
          <CardContent>
            {currentSemester ? (
              <>
                <PageHeader
                  text={currentSemester}
                  variant="body1"
                  gutter={false}
                />
              </>
            ) : (
              <PageHeaderSkeleton variant={"body1"} gutter={false} />
            )}

            <Stack spacing={4} direction="column">
              <Box>
                <Typography variant="body1">Memberships paid</Typography>
                <Typography variant="body1">{membershipsPaid}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Number volunteers</Typography>
                <Typography variant="body1">{totalNumVolunteers}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Total volunteer hours</Typography>
                <Typography variant="body1">{TWHString}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Total vouchers used</Typography>
                <Typography variant="body1">
                  {totalVouchersUsed.toFixed(1)} /{" "}
                  {(totalWorkHours * 0.5).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function createButtons(content) {
  
  const gridItems = content.map((e) => {
    return (
      <Grid item width="100%" key={`grid_${e.title}`}>
        <Link
          key={"link_" + e.title}
          href={e.path}
        >
          <Typography
            key={"link_typography" + e.title}
            variant="body1"
            width="100%"
            sx={{
              "&:hover": { color: cybTheme.palette.primary.main },
            }}
          >
            {e.title}
          </Typography>
        </Link>
      </Grid>
    );
  });
  
  return (
    <Grid item container direction="column" spacing={1}>
      {gridItems}
    </Grid>
  )
}


export default VolunteeringPage