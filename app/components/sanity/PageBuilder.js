
import {
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { imageBuilder } from "@/sanity/client";


export default function PageBuilder(data) {
  
  if (data == undefined) return null;
  
  const pageData = data.map((e) => {  
    let result = {}
    Object.keys(e).map((key) => {
      switch (key) {
        case "header":
          result = { ...result, [key]: handleHeader(e, "header", "h4") };
          break;
        case "title":
          result = { ...result, [key]: handleHeader(e, "title", "body2") };
          break;
        case "images":
          result = { ...result, [key]: handleImages(e) };
          break;
        case "content":
          result = { ...result, [key]: handleContent(e) };
          break;
      }
    })
    return result
  });
  
  return pageData
}

function handleHeader(e, prop, variant) {
  if (e[prop] == null) return <></>;
  return (
    <Typography
      key={"page_builder_header_" + e[prop]}
      variant={variant}
      gutterBottom
      sx={{ fontWeight: "bold" }}
    >
      {e[prop]}
    </Typography>
  );
}

function handleImages(e) {
  if (e.images == null) return <></>;
  
  const gridItems = e.images.images.map((g, i) => {
    return (
      <Grid item key={`page_builder_sanity_image_container_${i}`}>
        <img
          key={`page_builder_sanity_image_${i}`}
          alt={g.alt}
          src={imageBuilder.image(g).url()}
          width="100%"
        />
      </Grid>
    );
  })
  
  return (
    <Grid container spacing={1}>
      {gridItems}
    </Grid>
  )
}

function handleContent(e) {
  if (e.content == null) {
    return (
      <Typography variant="body2">
        Work in progress.
      </Typography>
    )
  };
  
  let tempList = [];
  let content = [];
  
  for (const item of e.content) {
    
    // Fill list if there is a list item
    if (item.level != undefined) {
      tempList = [...tempList, item];
      continue;
    }

    let variant = "body2";
    switch (item.style) {
      case "h6":
        variant = "h6";
        break;
      case "h5":
        variant = "h5";
        break;
      case "h4":
        variant = "h4";
        break;
      case "h3":
        variant = "h3";
        break;
      case "h2":
        variant = "h2";
        break;
      case "h1":
        variant = "h1";
        break;
    }
    
    // add populated list when a non-list element is met
    if (tempList.length != 0) {
      let listContent = (
        <List
          key={`page_builder_list_${item._key}`}
          sx={{ listStyleType: "disc", p: 0, pl: 4, pb: 2 }}
        >
          {tempList.map((g, i) => {
            return (
              <ListItem
                key={`page_builder_listItem_${item._key}_${i}`}
                sx={{ display: "list-item", paddingY: 0 }}
              >
                <Typography
                  key={`page_builder_Typography_${item._key}_${i}`}
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
      
      if (g.text == "") {
        return (
          <Typography variant="body2" key={`page_builder_linebreak_${item._key}_${i}`}>
            &nbsp;
          </Typography>
        );
      }

      return (
        <Typography
          key={`page_builder_Typography_child_${item._key}_${i}`}
          variant={variant}
          gutterBottom
          pb={1}
          {...textProps}
        >
          {g.text}
        </Typography>
      );
    });

    content = [...content, temp];
  }
  
  return content;
}