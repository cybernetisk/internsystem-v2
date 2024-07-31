
"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  fetchSanityPage,
  PageBuilderSkeleton,
  PageHeader,
  PageHeaderSkeleton,
} from "@/app/components/sanity/PageBuilder";

export default function HomePage() {

  const [page, setPage] = useState(null);
  
  useEffect(() => {
    fetchSanityPage("Home", setPage);
  }, []);
  
  return (
    <Box>
      {page != null ? <PageHeader text={page.header}/> : <PageHeaderSkeleton/>}
      {page ? page.content : <PageBuilderSkeleton/>}
    </Box>
  );
}
