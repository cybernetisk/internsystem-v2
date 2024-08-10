"use client";
import React from "react";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  fetchSanityPage,
  PageBuilderSkeleton,
  PageHeader,
  PageHeaderSkeleton,
} from "@/components/sanity/PageBuilder";

interface Page {
  header: string;
  content: React.ReactNode;
}

export default function HomePage() {
  const [page, setPage] = useState<Page | null>(null);
  
  useEffect(() => {
    fetchSanityPage("Home", setPage);
  }, []);
  
  return (
    <Box>
      {page ? <PageHeader text={page.header}/> : <PageHeaderSkeleton/>}
      {page ? page.content : <PageBuilderSkeleton/>}
    </Box>
  );
}
