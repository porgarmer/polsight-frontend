"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      <main
        className={[
          "pt-25 px-8 py-8", // space for fixed topbar
          "transition-[margin-left] duration-200 ease-in-out",
          collapsed ? "ml-[72px]" : "ml-[240px]"
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}
