
"use client";

import { Component, useEffect, useState } from "react";
import { Box, Button, Card, CardActionArea, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { useRouter } from "next/navigation";



const BUTTON_CONTENT = [
  { title: "New volunteer", path: "home" },
  { title: "Volunteer events", path: "" },
  { title: "Work groups", path: "groups" },
  { title: "Work logs", path: "" },
  { title: "Traditions", path: "" },
  { title: "Finance", path: "" },
  { title: "Escape wares", path: "" },
  { title: "User overview", path: "" },
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

export default function VolunteeringPage(params) {

  const [page, setPage] = useState(null)
  
  const router = useRouter()
  
  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  const buttons = BUTTON_CONTENT.map((e) => {
    return (
      <CustomGridItem
        key={e.title}
        label={e.title}
        path={e.path}
        onClick={(path) => router.push(`volunteering/${path}`)}
      />
    );
  });
  
  return (
    <Box>
      <Container disableGutters sx={{ my: 2 }}>
        <Typography variant="h4">
          Volunteering
        </Typography>
      </Container>
      
      <Grid container>
        
        <Grid item container xs={4} direction="row" spacing={0} alignContent="start">
          {buttons}
        </Grid>

        <Grid item xs={8} p={1}>
          {page}
        </Grid>
        
      </Grid>
    </Box>
  );
}

class CustomGridItem extends Component {
  
  render() {
    
    const { label, path, onClick } = this.props
    
    return (
      <Grid item width="50%" p={1}>
        <Card>
          <CardActionArea
            sx={{ padding: 3 }}
            onClick={ () => onClick(path) }
            >
            <Typography variant="body2">{label}</Typography>
            <Divider variant="fullWidth"/>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }
}