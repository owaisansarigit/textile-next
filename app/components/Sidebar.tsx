"use client";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../providers/AppProvider";

const drawerWidth = 240;

const menu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Add Sets", icon: <ShoppingCartIcon />, path: "/addset" },
  { text: "Pipe Received", icon: <ReceiptIcon />, path: "/addpipe" },
  { text: "Pipe Stock", icon: <InventoryIcon />, path: "/stockpipe" },
  { text: "Masters", icon: <PeopleIcon />, path: "/masters" },
];

export default function Sidebar() {
  const { mobileOpen, toggleMobile } = useApp();
  const pathname = usePathname();

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menu.map((m) => (
          <ListItemButton
            key={m.text}
            component={Link}
            href={m.path}
            selected={pathname === m.path}
            prefetch
            sx={{
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
            }}
          >
            <ListItemIcon>{m.icon}</ListItemIcon>
            <ListItemText primary={m.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobile}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
