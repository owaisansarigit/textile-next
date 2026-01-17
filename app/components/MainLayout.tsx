"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 240;
const topbarHeight = 64;

export default function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <Topbar />
      <Sidebar />

      <main
        className="flex-grow-1 p-3"
        style={{
          marginTop: `${topbarHeight}px`,
          marginLeft: window.innerWidth >= 768 ? `${drawerWidth}px` : 0,
          backgroundColor: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
