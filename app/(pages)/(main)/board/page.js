"use client";

import { PageHeader } from "@/app/components/sanity/PageBuilder";
import { Box, Link, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Forcegraph from "@/app/components/RecruitmentGraph"

export default function BoardPage() {

    const [data, setData] = useState({nodes: [], edges: []});

    useEffect(() => {
        fetch(`/api/v2/recruitGraph`)
            .then(res => res.json())
            .then(data => {
                setData({nodes: data.nodes, edges: data.edges})
            })

    }, []);

    return (
        <Box>
            <PageHeader text="Board tools"/>

            <Stack spacing={2}>
                <Link href="/board/menu">
                    Menu editor
                </Link>

                <Forcegraph data={ data }/>
            </Stack>
        </Box>
    );
}