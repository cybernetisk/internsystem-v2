"use client";

import { useSession } from "next-auth/react";
import { Typography } from "@mui/material";

export default function Home() {
  const session = useSession();

  const name = session.data ? session.data.user.name : "";

  return (
    <Typography variant="h3">
      Welcome {name ? "," : ""} {name}
    </Typography>
  );
}
