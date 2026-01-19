"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <TopBar />
      <Sidebar />
      <main
        className="flex-grow-1 p-3"
        style={{
          marginTop: "64px",
          marginLeft: "240px",
          backgroundColor: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
