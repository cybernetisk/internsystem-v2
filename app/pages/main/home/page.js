
"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { Box, Divider, Grid, Skeleton, Typography } from "@mui/material";

async function sanityFetch(hook) {
  const query = `*[_type == "page" && title == "Home"] {
    header,
    content,
    images
  }`;

  const pages = await sanityClient.fetch(query);
  
  hook(PageBuilder(pages)[0]);
}

export default function HomePage(params) {

  const [page, setPage] = useState(null);
  
  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  return (
    <Box>
      <Typography variant="h4">Home</Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          {page != null ? (
            [page.header, page.content]
          ) : (
            <Box>
              <Skeleton variant="rectangular" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Box>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
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
