
import { Container, Grid, Stack, Typography } from "@mui/material";
import { cybTheme } from "../themeCYB";
import { Component } from "react";
import Link from "next/link";

export default class LayoutFooter extends Component {
  render() {
    const { socialMedia, volunteerLink } = this.props;
    
    const gridChildProps = (direction) => {
      return {
        direction: direction,
        padding: 2,
        md: 6,
        xs: 12,
        spacing: 2,
        alignItems: "center",
        justifyContent: "center",
      }
    }
    
    return (
      <Container
        disableGutters
        maxWidth="xl"
        sx={{
          padding: 4,
          margin: 0,
          backgroundColor: cybTheme.palette.background.paper,
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
          {handleSocialMediaSection(socialMedia, gridChildProps)}
          {handleAddressSection(volunteerLink, gridChildProps)}
        </Grid>
      </Container>
    );
  }
}

function handleSocialMediaSection(socialMedia, gridChildProps) {
  
  return (
    <Grid item container {...gridChildProps("row")}>
      <Grid item md={3} xs={5}>
        {socialMedia.map((e) => {
          return (
            <Typography
              color={cybTheme.palette.text.primary}
              key={"footer_link_typography_" + e.name}
            >
              {e.name}:
            </Typography>
          );
        })}
      </Grid>

      <Grid item md={5} xs={6}>
        {socialMedia.map((e) => {
          return (
            <Link href={e.link} key={"footer_link_" + e.name} target="_blank">
              <Typography
                color={cybTheme.palette.text.primary}
                sx={{
                  // textDecoration: "underline",
                  "&:hover": { color: cybTheme.palette.primary.main },
                }}
                key={"footer_link_typography_" + e.name}
              >
                {e.value}
              </Typography>
            </Link>
          );
        })}
      </Grid>
    </Grid>
  );
}


function handleAddressSection(volunteerLink, gridChildProps) {
  
  return (
    <Grid item container {...gridChildProps("column")}>
      <Grid item>
        <Link href={volunteerLink} passHref target="_blank">
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
        direction="row"
        spacing={1}
        justifyContent="center"
        justifyItems="start"
      >
        <Grid item>
          <Typography color={cybTheme.palette.text.primary}>
            Address:
          </Typography>
        </Grid>
        <Grid item>
          <Typography color={cybTheme.palette.text.primary}>
            Gaustadalléen 23b, 0373 Oslo, Norge
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}