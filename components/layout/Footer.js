
"use client"

import { Card, Container, Grid, Paper, Stack, SvgIcon, Typography } from "@mui/material";
import { Facebook, Forum, GitHub, Instagram, Public } from "@mui/icons-material";
import { cybTheme } from "@/components/themeCYB";
import { Component } from "react";
import Link from "next/link";


const VOLUNTEER_LINK = "https://nettskjema.no/a/378483#/page/1";
const ESCAPE_ADDRESS = "https://maps.app.goo.gl/CEbazdheBwxbBRmL9";
const SUGGESTION_LINK = "https://github.com/cybernetisk/internsystem-v2/issues";

const SOCIAL_MEDIA = [
  {
    name: "Instagram",
    value: "@cybernetisk",
    link: "https://www.instagram.com/cybernetisk/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    value: "Cybernetisk Selskab",
    link: "https://www.facebook.com/cybernetisk",
    icon: Facebook,
  },
  {
    name: "Github",
    value: "cybernetisk",
    link: "https://github.com/cybernetisk",
    icon: GitHub,
  },
  {
    name: "wiki",
    value: "CYB Wiki",
    link: "https://wiki.cyb.no",
    icon: Public,
  },
  {
    name: "Slack",
    value: "CYB Slack",
    link: "https://join.slack.com/t/cybernetisk/shared_invite/zt-2nm279jef-qOAGCMPDiUn5RK19NKA3_g",
    icon: Forum,
  },
];

const USEFUL_LINKS = [
  {
    name: "Become a volunteer",
    link: "https://nettskjema.no/a/378483#/page/1",
  },
  {
    name: "Rent Escape",
    link: "/pages/main/aboutEscape/rentingEscape",
  },
  {
    name: "Submit issue",
    link: "https://github.com/cybernetisk/internsystem-v2/issues",
  },
]

export default class LayoutFooter extends Component {
  render() {
    
    const gridChildProps = (direction) => {
      return {
        direction: direction,
        padding: 2,
        md: 6,
        xs: 12,
        spacing: 0,
        alignItems: "center",
        justifyContent: "center",
      }
    }
    
    return (
      <Container
        component={Paper}
        elevation={3}
        square
        disableGutters
        maxWidth="xxl"
        sx={{
          padding: 4,
          py: 6,
          margin: 0,
        }}
      >
          <Grid
            container
            margin={0}
            padding={0}
            height="100%"
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            {handleSocialMediaSection(gridChildProps)}
            {handleAddressSection(gridChildProps)}
          </Grid>
      </Container>
    );
  }
}

function handleSocialMediaSection(gridChildProps) {
  
  return (
    <Grid
      item
      container
      direction="column"
      alignContent="center"
      md
      xs={12}
      spacing={2}
      pb={{ md: 0, xs: 6 }}
    >
      {SOCIAL_MEDIA.map((e, i) => {
        return (
          <Grid item key={`socialmedia_item_grid_item_${i}`}>
            <Stack
              direction="row"
              spacing={1}
              key={`socialmedia_item_stack_${i}`}
            >
              <SvgIcon component={e.icon} key={`socialmedia_item_icon_${i}`} />

              <Link
                href={e.link}
                target="_blank"
                key={`socialmedia_item_link_${i}`}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    "&:hover": { color: cybTheme.palette.primary.main },
                  }}
                  key={`socialmedia_item_typography_${i}`}
                  variant="body2"
                >
                  {e.value}
                </Typography>
              </Link>
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
}


function handleAddressSection(gridChildProps) {
  
  return (
    <Grid
      item
      container
      direction="row"
      alignItems="start"
      justifyContent="center"
      md
      xs={12}
      rowSpacing={3}
    >
      <Grid item container direction="column">
        <Typography 
        >Address</Typography>
        <Link href={ESCAPE_ADDRESS} passHref target="_blank">
          <Typography
            sx={{
              textDecoration: "underline",
              "&:hover": { color: cybTheme.palette.primary.main },
            }}
            variant="body2"
          >
            Gaustadalléen 23b, 0373 Oslo, Norge
          </Typography>
        </Link>
      </Grid>

      <Grid item container direction="column">
        <Typography>Useful links</Typography>
        {USEFUL_LINKS.map((e, i) => {
          return (
            <Link
              href={e.link}
              passHref
              target="_blank"
              key={`useful_links_${i}_link`}
            >
              <Typography
                key={`useful_links_${i}_typography`}
                sx={{
                  textDecoration: "underline",
                  "&:hover": { color: cybTheme.palette.primary.main },
                }}
                variant="body2"
                gutterBottom
              >
                {e.name}
              </Typography>
            </Link>
          );
        })}
      </Grid>
    </Grid>
  );
}