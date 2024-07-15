
"use client"

import { Component, useEffect, useState } from "react";
import { Box, Card, CardActionArea, Container, Divider, Grid, List, ListItem, Stack, Typography } from "@mui/material";
import { sanityClient } from "@/sanity/client";
import { imageBuilder } from "@/sanity/client";
import Image from "mui-image";
import { cybTheme } from "@/app/components/themeCYB";

async function sanityFetch(setContent) {
  const groups = `*[_type == "workGroup"]|order(orderRank) {
    title,
    content,
    images
  }`;

  const document = await sanityClient.fetch(groups);
  
  setContent(sanityHandler(document))
}

export default function groupPage() {
  
  const [groups, setGroups] = useState([])
  const [content, setContent] = useState([])
  const [images, setImages] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  useEffect(() => {
    sanityFetch(setGroups);
  }, []);
  
  const buttons = groups.map((e) => {
    return (
      <CustomGridItem
        key={e.title}
        label={e.title}
        selectedGroup={selectedGroup}
        onClick={() => {
          setContent(e.content);
          setImages(e.images)
          setSelectedGroup(e.title)
        }}
      />
    );
  });
  
  return (
    <Box>
      <Container disableGutters sx={{ my: 2 }}>
        <Typography variant="h4">Work groups</Typography>
      </Container>

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
    const { label, path, selectedGroup, onClick } = this.props;

    const isSelected = selectedGroup == label ? cybTheme.palette.primary.main : ""
    
    return (
      <Grid item xs p={1}>
        <Card>
          <CardActionArea sx={{ padding: 2 }} onClick={() => onClick()}>
            <Typography variant="body2" sx={{ color: isSelected }}>
              {label}
            </Typography>
            <Divider variant="fullWidth" sx={{ backgroundColor: isSelected }} />
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}

function sanityHandler(data) {
  
  return data.map((e) => {
    
    let images = []
    let tempList = []
    let content = [
      <Typography key={"title_" + e.title} variant="h4" gutterBottom>
        {e.title}
      </Typography>
    ];
    
    if (e.images != undefined) {
      for (const item of e.images.images) {
        let newImage = 
        <Image
          key={"sanity_image_" + item.alt}
          alt={item.alt}
          src={imageBuilder.image(item).url()}
          duration={0}
        />
        images = [images, newImage]
      }
    }
    
    // Check if there is elements to create
    if (e.content != undefined) {
      
      for (const item of e.content) {
        // Fill list if there is a list item
        if (item.level != undefined) {
          tempList = [...tempList, item];
          continue;
        }

        // add populated list when a non-list element is met
        if (tempList.length != 0) {
          let listContent = (
            <List
              key={e.title + "list" + content.length}
              sx={{ listStyleType: "disc", p:0, pl: 4, pb: 2 }}
            >
              {tempList.map((g, i) => {
                return (
                  <ListItem
                    key={e.title + "_ListItem" + i}
                    sx={{ display: "list-item", paddingY: 0 }}
                  >
                    <Typography
                      key={e.title + "_Typography" + i}
                      variant="body2"
                      py={0}
                    >
                      {g.children[0].text}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          );
          content = [...content, listContent];
          tempList = [];
        }

        let temp = (
          <Typography variant="body2" gutterBottom pb={1}>
            {item.children[0].text}
          </Typography>
        );

        content = [...content, temp];
      }
    }
    else {
      content = [
        ...content, 
        <Typography>
          Work in progress
        </Typography>
      ];
    }
    
    return { title: e.title, content: content, images: images }
  })
}