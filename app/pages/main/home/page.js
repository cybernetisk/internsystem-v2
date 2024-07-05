
"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";
import { Box } from "@mui/material";

async function sanityFetch(hook) {
  const query = `*[_type == "page" && title == "Home"] {
    pageBuilder[] {
      _type,
      heading,
      _type == "textblock" => {
        body
      },
      _type == "gallery" => {
        images
      }
    }
  }[0]`;

  const pages = await sanityClient.fetch(query);

  hook(pages);
}

export default function HomePage(params) {

  const [page, setPage] = useState([]);
  
  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  return (
    <Box>
      {page?.pageBuilder ? PageBuilder(page, 2) : <></>}
    </Box>
  )
}
