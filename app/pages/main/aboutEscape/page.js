
"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { Box, Divider, Grid, Skeleton, Typography } from "@mui/material";

async function sanityFetch(setPage) {
  const query = `*[_type == "page" && title == "About Escape"] {
    header,
    content,
    images
  }`;

  const page = await sanityClient.fetch(query);
  
  setPage(PageBuilder(page)[0]);
}

export default function AboutCYBPage() {

  const [page, setPage] = useState(null);

  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  // return page?.pageBuilder ? PageBuilder(page) : <></>;
  return (
    <Box>
      <Typography variant="h4">Escape</Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          {page != null ? (
            page.content
          ) : (
            <Box>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Box>
          )}
        </Grid>
        <Grid item xs={6}>
          {page != null ? (
            page.images
          ) : (
            <Skeleton variant="rectangular" height="50vh" />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}