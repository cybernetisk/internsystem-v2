
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
} from "@/app/components/sanity/PageBuilder";
import { useEffect, useState } from "react";
import { cybTheme } from "@/app/components/themeCYB";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";

const BUTTON_CONTENT_1 = [
  // { title: "Economy", path: "volunteering/economy" },
  // { title: "Café shifts", path: "/volunteering/cafe" },
  { title: "Vouchers", path: "/volunteering/logs" },
  { title: "Membership", path: "/volunteering/membership" },
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
  const [semester, setSemester] = useState(null);
  const [pages, setPages] = useState(null);
  const [numVolunteers, setNumVolunteers] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [vouchersEarned, setVouchersEarned] = useState(0);
  const [vouchersUsed, setVouchersUsed] = useState(0);

  
  useEffect(() => {
    sanityFetch(setPages);
  }, []);
  
  
  useEffect(() => {
    
    fetch("/api/v2/semester")
    .then(res => res.json())
    .then(data => {
      setSemester(data.semester)
    });
    
    fetch("/api/v2/semesterVolunteerInfo")
    .then(res => res.json())
    .then(data => {
      setPaidMemberships(data.membershipsPaid)
      setNumVolunteers(data.numberVolunteers)
      setVolunteerHours(data.volunteerHours)
      setVouchersEarned(data.vouchersEarned)
      setVouchersUsed(data.vouchersUsed)

    })
    
  }, [])
  
  // Semester-based data
  return (
    <Box>
      <PageHeader text="Volunteering" variant="h4" />

      <Grid container direction="row" spacing={4}>
        <Grid item md={2.5} xs={12}>
          {createNavigation(semester, paidMemberships, vouchersEarned, vouchersUsed, numVolunteers, volunteerHours)}
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

function createNavigation(semester, paidMemberships, vouchersEarned, vouchersUsed, numVolunteers, volunteerHours) {
  
  const buttonGroup1 = createButtons(BUTTON_CONTENT_1);  
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item md={2} xs>
        <Card elevation={3}>
          <CardContent>
            <PageHeader text="Resources" variant="body1" gutter={false} />
            {buttonGroup1}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs alignContent="start">
        <Card elevation={3}>
          <CardContent>
            {semester ? (
                <PageHeader
                  text={semester.semester + " " + semester.year}
                  variant="body1"
                  gutter={false}
                />
            ) : (
              <PageHeaderSkeleton variant={"body1"} gutter={false} />
            )}

            <Stack spacing={4} direction="column">
              <Box>
                <Typography variant="body1">Memberships paid</Typography>
                <Typography variant="body1">{paidMemberships}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Number volunteers</Typography>
                <Typography variant="body1">{numVolunteers}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Total volunteer hours</Typography>
                <Typography variant="body1">{volunteerHours.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Total vouchers used</Typography>
                <Typography variant="body1">
                  {Number(vouchersUsed).toFixed(1)} /{" "}
                  {vouchersEarned.toLocaleString()}
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