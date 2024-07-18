
"use client"

import { Box, Card, CardActionArea, Container, Divider, Grid, Typography } from "@mui/material";
import { Component, useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import { cybTheme } from "@/app/components/themeCYB";
import PageBuilder from "@/app/components/sanity/PageBuilder";

async function sanityFetch(setContent) {
  const groups = `*[_type == "workGroup"]|order(orderRank) {
    title,
    header,
    content,
    images
  }`;

  const document = await sanityClient.fetch(groups);
  
  setContent(PageBuilder(document));
}

export default function groupPage() {
  
  const [groups, setGroups] = useState([])
  const [content, setContent] = useState([])
  const [images, setImages] = useState([]);
  const [header, setHeader] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  useEffect(() => {
    sanityFetch(setGroups);
  }, []);
  
  const buttons = groups.map((e, i) => {
    return (
      <CustomGridItem
        key={`group_button_component_${i}`}
        childKey={`group_button_component_${i}`}
        label={e.title}
        selectedGroup={selectedGroup}
        onClick={() => {
          setSelectedGroup(e.title);
          setHeader(e.header);
          setContent(e.content);
          setImages(e.images);
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

      <Grid container>
        <Grid
          item
          container
          md={1.5}
          xs={12}
          alignContent="stretch"
          alignSelf="flex-start"
          sx={{ flexDirection: { xs: "row", md: "column" } }}
        >
          {buttons}
        </Grid>

        <Grid item md={6.5} xs={12} p={1} px={2}>
          {header}
          {content}
        </Grid>

        <Grid item md={4} xs={12} p={1} px={2}>
          <Container disableGutters>{images}</Container>
        </Grid>
      </Grid>
    </Box>
  );
}


class CustomGridItem extends Component {
  render() {
    const { childKey, label, path, selectedGroup, onClick } = this.props;

    const isSelected = selectedGroup == label ? cybTheme.palette.primary.main : ""
    
    return (
      <Grid key={`${childKey}_grid`} item xs p={1}>
        <Card key={`${childKey}_card`}>
          <CardActionArea
            key={`${childKey}_cardActionArea`}
            sx={{ padding: 2 }}
            onClick={() => onClick()}
          >
            {label}
            <Divider
              key={`${childKey}_divider`}
              variant="fullWidth"
              sx={{ backgroundColor: isSelected }}
            />
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}