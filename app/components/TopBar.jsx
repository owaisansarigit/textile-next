"use client";

import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useApp } from "../providers/AppProvider";

export default function TopBar() {
  const { toggleMobile } = useApp();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleMobile}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap>
          My Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
