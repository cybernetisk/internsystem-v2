
"use client";

import { useEffect, useState } from "react";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import { sanityClient } from "@/sanity/client";
import PageBuilder from "@/app/components/sanity/PageBuilder";

async function sanityFetch(setHS, setKS, setPage) {
  const query1 = (name) => `*[_type == "${name}"]|order(orderRank) {
    name,
    duration,
    "title": title->title,
    "email": title->email,
    "description": title->description,
    "portraitURL": portrait.asset->url,
  }`;

  const query2 = `*[_type == "page" && title == "About CYB"] {
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

  const hs = await sanityClient.fetch(query1("hovedstyret"));
  const ks = await sanityClient.fetch(query1("kjellerstyret"));
  const page = await sanityClient.fetch(query2);

  setHS(hs);
  setKS(ks);
  setPage(page);
}


export default function AboutCYBPage() {

    const [hs, setHS] = useState([]);
    const [ks, setKS] = useState([]);
    const [page, setPage] = useState(null);

    useEffect(() => {
      sanityFetch(setHS, setKS, setPage);
    }, []);

    console.log(page);

    const pageContent = page?.pageBuilder ? PageBuilder(page, 2) : <></>;

    return (
      <Stack
        spacing={4}
        direction="column"
        alignContent="center"
        sx={{ height: "100%" }}
      >
        {pageContent}

        <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
          <Stack spacing={1} direction="column" sx={{ width: "100%" }}>
            <Typography variant="h6">Hovedstyret</Typography>
            {hs ? card(hs) : <></>}
          </Stack>
          <Stack spacing={1} direction="column" sx={{ width: "100%" }}>
            <Typography variant="h6">Kjellerstyret</Typography>
            {ks ? card(ks) : <></>}
          </Stack>
        </Stack>
      </Stack>
    );
}


const card = (list) => {
  return list.map((p) => {
    return (
      <Card key={"card_" + p.title} variant="outlined" sx={{ width: "100%" }}>
        <CardContent key={"card_content_" + p.title}>
          <Stack direction="row" sx={{ width: "100%" }}>
            <Stack direction="column" sx={{ width: "100%" }}>
              <Typography
                variant="subtitle1"
                key={"card_content_t1_" + p.title}
              >
                {p.title}
              </Typography>
              <Typography
                variant="subtitle2"
                key={"card_content_t2_" + p.title}
                color="GrayText"
                gutterBottom
              >
                {p.name}
              </Typography>
              <Typography
                variant="body2"
                key={"card_content_t3_" + p.title}
                color="GrayText"
              >
                {p.description}
              </Typography>
            </Stack>

            <Avatar src={null} alt={p.name} />
          </Stack>
        </CardContent>
      </Card>
    );
  });
};