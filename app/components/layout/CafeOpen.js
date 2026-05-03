"use client"

import { createSvgIcon, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function CafeOpen() {
    const [cafeOpen, setCafeOpen] = useState(false);
    const OpenIndicator = createSvgIcon(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={cafeOpen ? "lime" : "red"}
        viewBox="0 0 46 46"
        className="h-6 w-6"
      >
        <circle cx="21" cy="21" r="20"/>
      </svg>,
      'Plus',
    );
      
    useEffect(() => {
        fetch("/api/v2/cafe/isOpen").then(async (res) => {
            if (res.status == 200) setCafeOpen((await res.json()).isOpen);
        }

        )
    }, [])

    return (
        <>
        <OpenIndicator/>
        <Typography pl={1}>Cafè {cafeOpen ? "open" : "closed"}</Typography>
        </>
    )
}