
"use client"

import {
  Box,
  Card,
  CardActionArea,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Component, useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import { cybTheme } from "@/app/components/themeCYB";
import { PageBuilder, PageHeader } from "@/app/components/sanity/PageBuilder";

async function sanityFetch(setPages) {
  const groups = `*[_type == "workGroup"]|order(orderRank) {
    title,
    header,
    pageContent,
  }`;

  const pageContent = await sanityClient.fetch(groups);
  let pages;
  
  if (pageContent.length) {
    pages = pageContent.map((e) => PageBuilder(e))
  }
  
  setPages(pages);
}

export default function groupPage() {
  
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [overviewLabel, setOverviewLabel] = useState(null);
  const [overviewContent, setOverviewContent] = useState([])
  
  useEffect(() => {
    sanityFetch(setPages);
  }, []);
  
  const buttons = pages.map((e, i) => {
    return (
      <CustomGridItem
        key={`group_button_component_${i}`}
        childKey={`group_button_component_${i}`}
        item={e}
        selectedGroup={selectedPage}
        onClick={() => {
          setSelectedPage(e);
          setOverviewLabel(e.header);
          setOverviewContent(e.content);
        }}
      />
    );
  });
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Work groups
      </Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <Grid container direction="row" spacing={2}>
        <Grid
          item
          container
          md={2.5}
          xs={12}
          spacing={1}
          alignSelf="flex-start"
          sx={{ flexDirection: { xs: "row", md: "column" } }}
        >
          {buttons}
        </Grid>

        <Grid item md xs={12}>
          <PageHeader text={overviewLabel} divider={false} />
          {overviewContent}
        </Grid>
      </Grid>
    </Box>
  );
}


class CustomGridItem extends Component {
  render() {
    const { childKey, item, selectedGroup, onClick } = this.props;

    // const isSelected = selectedGroup == item ? cybTheme.palette.primary.main : ""
    
    return (
      <Grid key={`${childKey}_grid`} item md xs={4}>
        <Card key={`${childKey}_card`}>
          <CardActionArea
            key={`${childKey}_cardActionArea`}
            sx={{ padding: 2 }}
            onClick={() => onClick()}
          >
            <Typography
              variant="body2"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {item.title}
            </Typography>
            <Divider
              key={`${childKey}_divider`}
              variant="fullWidth"
              // sx={{ backgroundColor: isSelected, mb: 2 }}
            />
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}