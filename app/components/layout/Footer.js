
import { Container, Stack, Typography } from "@mui/material";
import { cybTheme } from "../themeCYB";
import { Component } from "react";
import Link from "next/link";

export default class LayoutFooter extends Component {
  render() {
    const { socialMedia } = this.props;
    
    return (
      <Container
        disableGutters
        maxWidth="xl"
        sx={{
          height: 200,
          padding: 0,
          margin: 0,
          backgroundColor: cybTheme.palette.background.paper,
        }}
      >
        <Stack
          direction="row"
          sx={{
            margin: 0,
            padding: 0,
            height: "100%",
          }}
          alignItems="center"
          justifyContent="center"
          spacing={8}
        >
          <Stack direction="column">
            {socialMedia.map((e) => {
              return (
                <Typography
                  color={cybTheme.palette.text.secondary}
                  key={"footer_link_typography_" + e.name}
                >
                  {e.name}:
                </Typography>
              );
            })}
          </Stack>
          <Stack direction="column">
            {socialMedia.map((e) => {
              return (
                <Link href={e.link} key={"footer_link_" + e.name}>
                  <Typography
                    color={cybTheme.palette.text.secondary}
                    key={"footer_link_typography_" + e.name}
                  >
                    {e.value}
                  </Typography>
                </Link>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    );
  }
}
