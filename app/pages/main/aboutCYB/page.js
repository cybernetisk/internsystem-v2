
"use client";

import {
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  fetchSanityPage,
  PageBuilderSkeleton,
  PageHeader,
  PageHeaderSkeleton,
} from "@/app/components/sanity/PageBuilder";
import { useEffect, useState } from "react";
import { imageBuilder, sanityClient } from "@/sanity/client";
import { cybTheme } from "@/app/components/themeCYB";
import Link from "next/link";

async function sanityFetch(setHS, setKS, setPage) {
  const query1 = (name) => `*[_type == "${name}"]|order(orderRank) {
    name,
    duration,
    "title": title->title,
    "email": title->email,
    "description": title->description,
    "portraitURL": portrait.asset->url,
  }`;

  const hs = await sanityClient.fetch(query1("hovedstyret"));
  const ks = await sanityClient.fetch(query1("kjellerstyret"));
  setHS(hs);
  setKS(ks);
}

export default function AboutCYBPage() {
  const [hs, setHS] = useState([]);
  const [ks, setKS] = useState([]);
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetchSanityPage("About CYB", setPage);
    sanityFetch(setHS, setKS);
  }, []);

  return (
    <Box
    >
      {page != null ? <PageHeader text={page.header}/> : <PageHeaderSkeleton/>}
      {page ? page.content : <PageBuilderSkeleton />}

      <Divider sx={{ my: 4 }}/>

      <Stack spacing={2} direction="row">
        <Stack spacing={2} direction="column" sx={{ width: "100%" }}>
          <Typography variant="h6">Hovedstyret</Typography>
          {hs ? card(hs) : <></>}
        </Stack>
        <Stack spacing={2} direction="column" sx={{ width: "100%" }}>
          <Typography variant="h6">Kjellerstyret</Typography>
          {ks ? card(ks) : <></>}
        </Stack>
      </Stack>
    </Box>
  );
}

const card = (list) => {
  return list.map((p,i) => {
    
    return (
      <Stack key={`${i}`} direction="row" spacing={2} alignItems="center">
        <Avatar
          src={p.portraitURL ? imageBuilder.image(p.portraitURL).url() : null}
          alt={p.name}
          sx={{ height: "12vh", width: "12vh" }}
        />
        <Stack direction="column">
          
          <Link href={`mailto:${p.email}`}>
            <Typography
              variant="subtitle1"
              key={"card_content_t1_" + p.title}
              sx={{
                textDecoration: "underline",
                "&:hover": { color: cybTheme.palette.primary.main },
              }}
            >
              {p.title}
            </Typography>
          </Link>
          
          <Typography
            variant="subtitle2"
            key={"card_content_t2_" + p.title}
            color="GrayText"
            gutterBottom
          >
            {p.name ? p.name : ":("}
          </Typography>
        </Stack>
      </Stack>
    );
  });
};
