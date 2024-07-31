
import {
  Divider,
  Grid,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import { sanityClient, imageBuilder } from "@/sanity/client";
import Link from "next/link";
import { cybTheme } from "../themeCYB";

async function fetchSanityPage(pageTitle, setPage) {
  
  const query = `*[_type == "page" && title == "${pageTitle}"] {
    header,
    pageContent,
  }[0]`;
  
  const pageContent = await sanityClient.fetch(query);
  
  console.log(pageContent);
  
  const page = pageBuilder(pageContent);
  
  // console.log(page)
  
  setPage(page);
}

function pageBuilder(data) {
  
  if (data == undefined) return [];
  
  const noHeader = data.header == undefined;
  const noTitle = data.title == undefined;
  const noPageContent = data.pageContent == undefined;
  
  console.log(data);
  
  const page = {    
    header: noHeader ? null : data.header, //<PageHeader text={data.header} variant={"h4"}/>,
    title: noTitle ? null : data.title, //<PageHeader text={data.title} variant={"body2"}/>,
    content: noPageContent ? null : data.pageContent.map((e, i) => handleContent(e, i)),
  }
  
  return page;
}

function handleContent(e, index) {
  
  let textContent = [];
  let imageContent = [];
  
  if (e.text) {
    textContent = handleText(e, index);
  } else {
    textContent = <Typography variant="body2">Work in progress</Typography>;
  }
  
  if (e.images) {
    imageContent = handleImages(e, index);
  } else {
    imageContent = <React.Fragment key={`page_builder_sanity_fragment${index}`}/>
  }
  
  return (
    <Grid container direction="row" spacing={2} py={2}>
      <Grid item md={7} xs={12}>
        {textContent}
      </Grid>
      <Grid item md={5} xs={12}>
        {imageContent}
      </Grid>
    </Grid>
  );
}

function handleImages(e, index) {
  
  const gridItems = e.images.map((g, i) => {
    return (
      <Grid item key={`page_builder_sanity_container${index}_grid${i}`}>
        <img
          key={`page_builder_sanity_container${index}_image${i}`}
          alt={g.alt}
          src={imageBuilder.image(g).url()}
          width="100%"
        />
      </Grid>
    );
  })
  
  return (
    <Grid
      container
      spacing={1}
      key={`page_builder_sanity_container${index}`}
    >
      {gridItems}
    </Grid>
  );
}

function handleText(e, index) {
  
  let tempList = [];
  let content = [];
  
  for (const item of e.text) {
    
    // Fill list if there is a list item
    if (item.listItem != undefined && item.listItem == "bullet") {
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
      // console.log(index, tempList)
      content = [...content, [handleListContent(tempList, index)]];
      tempList = [];
    }

    // handle text marks
    let temp = item.children.map((e, i) => {
      let textProps = { display: "inline-block" };
      let isLink = false;

      for (const mark of e.marks) {
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
          default:
            console.log(item, i, item.markDefs[i]);
            for (const markDef of item.markDefs) {
              if (markDef._key == mark && markDef._type == "link") {
                
                textProps = { ...textProps, textDecoration: "underline" };
                isLink = markDef.href;
              }
            }
            // if (item.markDefs[i]._key == mark && item.markDefs[i]._type == "link") {
            // }
            break;
        }
      }
      
      return (
        <PageText
          key={`page_builder_Typography_child_${item._key}_${i}`}
          text={e.text}
          variant={variant}
          textProps={textProps}
          href={isLink}
          compKey={`page_builder_Typography_child_${item._key}_${i}`}
        />
      );
    });
    
    content = [...content, temp];
  }
  
  if (tempList.length != 0) {
    content = [...content, [handleListContent(tempList, index)]];
  }
  
  return content;
}

function handleListContent(list, index) {
  console.log(index, list);
  return (
    <List
      key={`page_builder_list_${index}`}
      sx={{ listStyleType: "disc", p: 0, pl: 4, pb: 2 }}
    >
      {list.map((e, i) => {
        return (
          <ListItem
            key={`page_builder_listItem_${index}_${i}`}
            sx={{ display: "list-item", paddingY: 0 }}
          >
            <Typography
              key={`page_builder_Typography_${index}_${i}`}
              variant="body2"
              py={0}
            >
              {e.children[0].text}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}

class PageText extends Component {
  render() {
    const { text, variant, textProps, href, compKey } = this.props;

    if (text == "") {
      return (
        <Typography
          key={`${compKey}_more1`}
          variant={variant}
          width={"100%"}
          gutterBottom
          pb={1}
        >
          &nbsp;
        </Typography>
      );
    }

    if (href) {
      return (
        <Link href={href} passHref key={`${compKey}_more2`}>
          <Typography
            key={`${compKey}_more3`}
            variant={variant}
            gutterBottom
            pb={1}
            sx={{
              textDecoration: "underline",
              "&:hover": { color: cybTheme.palette.primary.main },
            }}
            {...textProps}
          >
            {text}
          </Typography>
        </Link>
      );
    }

    return (
      <Typography
        key={`${compKey}_more4`}
        variant={variant}
        width={"100%"}
        gutterBottom
        pb={1}
        {...textProps}
      >
        {text == "" ? "&nbsp;" : text}
      </Typography>
    );
  }
}

class PageHeader extends Component {
  render() {
    const { text, variant, gutter, divider } = this.props;

    const headerGutter = (gutter == undefined) ? true : gutter;
    const headerDivider = divider == undefined ? true : gutter;
    const headerVariant = variant ? variant : "h4";
    
    if (!text) return <></>
    
    return (
      <>
        <Typography
          key={`page_builder_header_${variant}`}
          variant={headerVariant}
          gutterBottom={headerGutter}
          sx={{ fontWeight: "bold" }}
        >
          {text}
        </Typography>
        
        {headerDivider ? <Divider sx={ headerGutter ? { mb: 4 } : { mb: 2 } }></Divider> : <></>}
      </>
    );
  }
}

class PageHeaderSkeleton extends Component {
  render() {
    const { variant, gutter, divider } = this.props;
    
    let typoVariant = variant ? variant : "h4"
    const headerDivider = divider == undefined ? true : gutter;
    const headerGutter = gutter == undefined ? true : gutter;
    
    return (
      <>
        <Typography variant={typoVariant} gutterBottom>
          <Skeleton />
        </Typography>
        {/* <Divider sx={{ mb: 4 }}></Divider> */}
        {headerDivider ? <Divider sx={ headerGutter ? { mb: 4 } : { mb: 2 } }></Divider> : <></>}
        {/* {headerGutter ? <Divider sx={ headerGutter ? { mb: 4 } : { mb: 2 } }></Divider> : <></>} */}
      </>
    );
  }
}

class PageBuilderSkeleton extends Component {
  render() {
    
    let numText = 10
    let skeletonText = [];
    
    for (let i = 0; i < numText; i++) {
      skeletonText.push(
        <Typography
          variant="body2"
          key={`pagebuilder_typography${i}`}
        >
          <Skeleton key={`pagebuilder_typography${i}_skeleton`} />
        </Typography>
      );
    }
    
    return (
      <Grid container direction="row" spacing={2}>
        <Grid item md={7}>
          <Typography variant="h5" gutterBottom>
            <Skeleton/>
          </Typography>
          {skeletonText}
        </Grid>
        <Grid item md={5}>
          <Skeleton variant="rectangular" height="50vh" />
        </Grid>
      </Grid>
    );
  }
}

export {
  fetchSanityPage,
  pageBuilder as PageBuilder,
  PageHeader,
  PageBuilderSkeleton,
  PageHeaderSkeleton,
};