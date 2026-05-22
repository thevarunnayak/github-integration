"use client";

import {
  BarChart3,
  FolderGit2,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    icon: FolderGit2,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "AI Insights",
    icon: Sparkles,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-black lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-white" />

          <div>
            <p className="font-heading text-lg font-semibold">
              Engineering IQ
            </p>

            <p className="text-xs text-zinc-500">
              GitHub Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="border-b border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Workspace
          </p>

          <h2 className="mt-2 font-medium">
            Varun Engineering
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />

              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}