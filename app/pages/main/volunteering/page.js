
"use client";

import { Component, useEffect, useState } from "react";
import { Box, Card, CardActionArea, CardContent, Container, Divider, Grid, Typography } from "@mui/material";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { useRouter } from "next/navigation";
import authWrapper from "@/app/middleware/authWrapper";
import { useSession } from "next-auth/react";
import { cybTheme } from "@/app/components/themeCYB";



const BUTTON_CONTENT = [
  { title: "Volunteer groups", path: "groups" },
  { title: "Stock overview", path: "finance" },
  { title: "Logs", path: "logs" },
  {
    title: "Become volunteer",
    path: "https://nettskjema.no/a/378483#/page/1",
    external: true,
  },
  { title: "Traditions", path: "", wip: true },
];

const BUTTON_VOLUNTEER = [
  { title: "Escape wares", path: "", wip: true },
  { title: "User overview", path: "", wip: true },
];

async function sanityFetch(setPage) {

  const query = `*[_type == "page" && title == "Volunteering"] {
    pageBuilder[] {
      _type,
      heading,
      _type == "textblock" => {
        body
      },
      _type == "gallery" => {
        images
      }
    }
  }[0]`;
  
  const page = await sanityClient.fetch(query);
  
  if (page?.pageBuilder != undefined) {
    const pageContent = page.pageBuilder ? PageBuilder(page) : <></>;  
    setPage(pageContent);
  }
}

function VolunteeringPage(params) {

  const [page, setPage] = useState(null)
  
  const session = useSession()
  const router = useRouter()
  
  useEffect(() => {
    
  })
  
  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  const buttons = BUTTON_CONTENT.map((e) => {
    return <CustomGridItem key={e.title} item={e} router={router}/>
  });
  
  const buttonsVolunteer = BUTTON_VOLUNTEER.map((e) => {
    return <CustomGridItem key={e.title} item={e} router={router}/>
  });
  
  return (
    <Box>
      <Container disableGutters sx={{ my: 2 }}>
        <Typography variant="h4">Volunteering</Typography>
      </Container>

      <Grid container>
        <Grid item container md={2} xs={12} spacing={0} alignContent="start">
          {buttons}
        </Grid>

        <Grid item container md={2} xs={12} spacing={0} p={0} alignContent="start">
          {/* {session.status == "authenticated" ? buttonsVolunteer : <></>} */}
        </Grid>

        <Grid item md={8} xs={12} p={1}>
          <Card
            elevation={1}
            sx={{
              // border: "1px solid red",
              height: "100vh"
            }}
          >
            <CardContent>
              <Typography variant="h6">Semester overview</Typography>
              <Divider/>
              
            </CardContent>
          </Card>
          {/* {page} */}
        </Grid>
      </Grid>
    </Box>
  );
}

class CustomGridItem extends Component {
  
  render() {
    
    const { item, router } = this.props
    const { title, path, external, wip } = item  
    
    return (
      <Grid item width="100%" p={1}>
        <Card>
          <CardActionArea
            sx={{ padding: 3 }}
            onClick={() => external ? router.push(path) : router.push(`volunteering/${path}`)}
          >
            <Typography variant="body2">{title}</Typography>
            <Divider variant="fullWidth" />
            <Typography
              variant="caption"
              color={cybTheme.palette.primary.main}
            >
              {wip != undefined ? "W.I.P" : ""}
            </Typography>
            <Typography variant="caption">
              {external != undefined ? "external url" : ""}
            </Typography>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}

export default authWrapper(VolunteeringPage)