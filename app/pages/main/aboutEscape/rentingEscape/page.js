
"use client";

import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import {
  fetchSanityPage,
  PageBuilderSkeleton,
  PageHeader,
  PageHeaderSkeleton,
} from "@/components/sanity/PageBuilder";

export default function rentingEscapePage() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetchSanityPage("Renting Escape", setPage);
  }, []);

  return (
    <Box>
      {page != null ? <PageHeader text={page.header}/> : <PageHeaderSkeleton/>}
      {page ? page.content : <PageBuilderSkeleton />}
    </Box>
  );
}