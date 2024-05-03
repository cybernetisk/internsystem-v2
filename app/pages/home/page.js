
"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "../../../sanity/client"
import PageBuilder from "../../components/sanity/PageBuilder"

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

export default function Home() {

  const [page, setPage] = useState([]);
  
  useEffect(() => {
    sanityFetch(setPage);
  }, []);
  
  return page?.pageBuilder ? PageBuilder(page, 2) : <></>;
}
