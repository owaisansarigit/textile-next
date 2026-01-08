"use client";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const drawerWidth = 240;
const topbarHeight = 64;
export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: `${topbarHeight}px`,
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
