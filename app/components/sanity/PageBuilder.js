
import {
  Box,
  Container,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { imageBuilder } from "@/sanity/client";


export default function PageBuilder(data) {
  if (data == undefined) return null;
  
  return data.map((e) => {
    let header = null;
    let images = [];
    let content = [];

    // check if there is a page header
    if (e.header != undefined) {
      header = handleHeader(e);
    }
    
    // check if there are page images
    if (e.images != undefined) {
      images = handleImages(e);
    }

    // Check if there is elements to create
    if (e.content != undefined) {
      content = handleContent(e);
    } else {
      content = <Typography>Work in progress</Typography>;
    }

    return {
      header: header,
      content: content,
      images: images
    };
  });
}

function handleHeader(e) {
  return (
    <Typography
      key={"page_builder_title_" + e.header}
      variant="h5"
      gutterBottom
      sx={{ fontWeight: "bold" }}
    >
      {e.header}
    </Typography>
  );
}

function handleImages(e) {
  return e.images.images.map((g) => {
    return (
      <Container key={"page_builder_sanity_image_container_" + g.alt}>
        <img
          key={"page_builder_sanity_image_" + g.alt}
          alt={g.alt}
          src={imageBuilder.image(g).url()}
          width="100%"
        />
      </Container>
    );
  })
}

function handleContent(e) {
  
  let tempList = [];
  let content = [];
  
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
          key={"page_builder_list" + content.length}
          sx={{ listStyleType: "disc", p: 0, pl: 4, pb: 2 }}
        >
          {tempList.map((g, i) => {
            return (
              <ListItem
                key={"page_builder_ListItem" + i}
                sx={{ display: "list-item", paddingY: 0 }}
              >
                <Typography
                  key={"page_builder_Typography" + i}
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

    // handle text marks
    let temp = item.children.map((g, i) => {
      let textProps = {
        display: "inline-block",
      };

      for (const mark of g.marks) {
        switch (mark) {
          case "strong":
            textProps = { ...textProps, fontWeight: "bold" };
            break;
          case "underline":
            textProps = { ...textProps, textDecoration: "underline" };
            break;
          case "strike-through":
            textProps = { ...textProps, textDecoration: "lineThrough" };
            break;
        }
      }

      return (
        <Typography
          key={"page_builder_Typography_child" + i}
          variant="body2"
          gutterBottom
          pb={1}
          {...textProps}
        >
          {g.text}&nbsp;
        </Typography>
      );
    });

    content = [...content, temp];
  }
  
  return content;
}