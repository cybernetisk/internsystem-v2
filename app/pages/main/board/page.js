
"use client"

import { PageHeader } from "@/app/components/sanity/PageBuilder";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Forcegraph from "@/app/components/RecruitmentGraph"

export default function BoardPage() {

  const [data, setData] = useState({ nodes: [], links: [] });
  
  useEffect(() => {
    prismaRequest({
      model: "User",
      method: "find",
      request: {
        include: {
          recruitedByUser: true,
          recruitedUsers: true,
        },
        where: {
          OR: [
            { recruitedById: { not: null } },
            { recruitedUsers: { some: {} } }
          ]
        },
      },
      callback: (data) => {
        
        const links = data.data
        .filter((element) => element.recruitedByUser)
        .map((element) => ({
          source: element,
          target: element.recruitedByUser,
        }));
        
        const connectedNodes = new Set(
          links.flatMap((link) => [link.source.id, link.target.id])
        );
        const filteredNodes = data.data.filter((node) =>
          connectedNodes.has(node.id) || connectedNodes.has(node.recruitedById)
        );
        const filteredLinks = links.filter((link) =>
          connectedNodes.has(link.source.id) && connectedNodes.has(link.target.id)
        );
        
        const newData = { nodes: filteredNodes, links: filteredLinks };
        
        setData(newData);
      },
    });
  }, []);

  return (
    <Box>
      <PageHeader text="Board tools" />
      
      <Forcegraph data={data}/>
    </Box>
  );
}