"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NAV = [
  // { label: "Dashboard", 
  //   href: "/", 
  //   icon: "/sidebar-icons/dashboard-panel.png", 
  //   icon_dark: "/sidebar-icons/dashboard-panel-dark.png" 
  // },
  
  { label: "Voter Trends", 
    href: "/voter-trends", 
    icon: "/sidebar-icons/growth.png", 
    icon_dark: "/sidebar-icons/growth-dark.png" 
  },
  
  { label: "Candidate Performance", 
    href: "/candidate-performance", 
    icon: "/sidebar-icons/candidate.png", 
    icon_dark: "/sidebar-icons/candidate-dark.png" 
  },
  
  { label: "Candidate Comparison", 
    href: "/candidate-comparison", 
    icon: "/sidebar-icons/comparison.png", 
    icon_dark: "/sidebar-icons/comparison-dark.png" 
  },
  
  { label: "Data Sources", 
    href: "/data-sources", 
    icon: "/sidebar-icons/data-classification.png", 
    icon_dark: "/sidebar-icons/data-classification-dark.png" 
  }

];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "fixed left-0 top-16 z-40",
        "h-[calc(100vh-64px)]",
        "bg-[#2E3440] text-slate-100",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]"
      ].join(" ")}
    >
      <div className="flex h-[calc(100vh-64px)] flex-col px-3 py-4">
        {/* Collapse button row */}
        <div className="mb-3 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-100 hover:bg-slate-700 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          {NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined} // tooltip when collapsed
                className={[
                  "flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-100 hover:bg-slate-700/70"
                ].join(" ")}
              >
                {
                  <Image 
                    src={isActive ? item.icon_dark : item.icon}
                    width={20}
                    height={20}
                    alt={item.label}
                    className="shrink-0"
                  />
                }
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
