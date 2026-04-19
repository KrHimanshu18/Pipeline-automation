"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AddRepository } from "@/components/dashboard/add-repository";
import { ViewRepositories } from "@/components/dashboard/view-repositories";
import { Profile } from "@/components/dashboard/profile";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<
    "add-repo" | "view-repos" | "profile"
  >("view-repos");

  const renderContent = () => {
    switch (activeTab) {
      case "add-repo":
        return <AddRepository />;
      case "view-repos":
        return <ViewRepositories />;
      case "profile":
        return <Profile />;
      default:
        return <ViewRepositories />;
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl">{renderContent()}</div>
      </main>
    </div>
  );
}
