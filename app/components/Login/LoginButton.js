"use client";

import { Button, Container } from "@mui/material";
import { signOut, signIn, useSession } from "next-auth/react";
import { cybTheme } from "../themeCYB";

export default function AccountSignIn() {
  const session = useSession();

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: process.NEXTAUTH_CALLBACK_SIGNOUT,
    });
  };

  const accountAction = () => session.status === "authenticated" ? handleSignOut() : handleSignIn();
  const loginText = session.status === "authenticated" ? "Sign out" : "Sign in";

  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: cybTheme.palette.background.default,
      }}
    >
      <Button variant="contained" onClick={accountAction}>
        {loginText}
      </Button>

      {/* <AccountPopover
              anchorEl={accountPopover.anchorRef.current}
              open={true}
              onClose={accountPopover.handleClose}
            /> */}
    </Container>
  );
}
