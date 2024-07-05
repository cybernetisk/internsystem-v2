
import { imageBuilder } from "@/sanity/client";
import { Box, Stack, Typography } from "@mui/material";

export default function PageBuilder(pageContent) {
  let contentSpacing = 2;

  let headerSize = "h4";

  return (
    <Stack spacing={4}>
      {pageContent.pageBuilder.map((e, i) => {
        switch (e._type) {
          case "textblock":
            return (
              <Stack
                key={"pagebuilder_stack_" + i}
                direction="column"
                spacing={contentSpacing}
              >
                <Typography
                  key={"pagebuilder_theader" + i}
                  variant={headerSize}
                >
                  {e.heading}
                </Typography>
                <Typography key={"pagebuilder_tbody2" + i} variant="body2">
                  {e.body}
                </Typography>
              </Stack>
            );
          case "gallery":
          
            const images = e.images.map((f, i) => {
              return (
                <Box
                  component="img"
                  key={"sanity_image_" + i}
                  alt={f.alt}
                  src={imageBuilder.image(f).url()}
                />
              );
            })
          
            return (
              <Stack
                key={"pagebuilder_stack_" + i}
                direction="column"
                spacing={contentSpacing}
              >
                {images}
              </Stack>
            );
          default:
            return <></>;
        }
      })}
    </Stack>
  );
}

