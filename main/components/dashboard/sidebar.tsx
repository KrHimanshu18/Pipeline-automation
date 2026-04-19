"use client";

import { Plus, GitBranch, User, LogOut } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeTab: "add-repo" | "view-repos" | "profile";
  onTabChange: (tab: "add-repo" | "view-repos" | "profile") => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    {
      id: "add-repo" as const,
      label: "Add Repository",
      icon: Plus,
      description: "Connect a new repository",
    },
    {
      id: "view-repos" as const,
      label: "My Repositories",
      icon: GitBranch,
      description: "View all connected repos",
    },
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      description: "Account settings",
    },
  ];

  return (
    <aside className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
          <div>
            <h1 className="text-lg font-bold text-white">PipelineAI</h1>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ?
                  "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                : "text-gray-400 hover:bg-zinc-800 hover:text-gray-300"
              }`}
            >
              <Icon
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isActive ? "text-cyan-400" : ""}`}
              />
              <div className="text-left">
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-zinc-800 space-y-3">
        <div className="px-4 py-3 bg-zinc-800/50 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Logged in as</div>
          <div className="text-sm font-medium text-white truncate">
            john.doe@example.com
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
