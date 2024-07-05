
"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";

async function sanityFetch(setPage) {
  const query = `*[_type == "page" && title == "About Escape"] {
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

  const page = await sanityClient.fetch(query);

  setPage(page);
}

export default function AboutCYBPage() {

  const [page, setPage] = useState(null);

  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  return page?.pageBuilder ? PageBuilder(page) : <></>;
}