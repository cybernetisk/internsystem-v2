
import { Container, Grid, Stack, SvgIcon, Typography } from "@mui/material";
import { Facebook, GitHub, Instagram, Public } from "@mui/icons-material";
import { cybTheme } from "../themeCYB";
import { Component } from "react";
import Link from "next/link";


const VOLUNTEER_LINK = "https://nettskjema.no/a/378483#/page/1";
const ESCAPE_ADDRESS = "https://maps.app.goo.gl/CEbazdheBwxbBRmL9";

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
];

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
        disableGutters
        maxWidth="xxl"
        sx={{
          padding: 4,
          margin: 0,
          backgroundColor: cybTheme.palette.background.default,
        }}
      >
        <Grid
          container
          margin={0}
          padding={0}
          height="100%"
          // direction={{ xs: "column-reverse", md: "row" }}
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
      // sx={{ border: "1px solid red" }}
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
                  color={cybTheme.palette.text.primary}
                  sx={{
                    textDecoration: "underline",
                    "&:hover": { color: cybTheme.palette.primary.main },
                  }}
                  key={`socialmedia_item_typography_${i}`}
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
      rowSpacing={5}
    >
      <Grid item container direction="column">
        <Typography>
          Interested?
        </Typography>
        <Link href={VOLUNTEER_LINK} passHref target="_blank">
          <Typography
            color={cybTheme.palette.text.primary}
            sx={{
              textDecoration: "underline",
              "&:hover": { color: cybTheme.palette.primary.main },
            }}
          >
            Become a volunteer!
          </Typography>
        </Link>
      </Grid>

      <Grid
        item
        container
        direction="column"
      >
        <Typography color={cybTheme.palette.text.primary}>
          Address
        </Typography>
        <Link href={ESCAPE_ADDRESS} passHref target="_blank">
          <Typography
            color={cybTheme.palette.text.primary}
            sx={{
              textDecoration: "underline",
              "&:hover": { color: cybTheme.palette.primary.main },
            }}
          >
            Gaustadalléen 23b, 0373 Oslo, Norge
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
}