"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RepositoriesProvider } from "@/lib/contexts/repositories-context";
import { useAuth } from "@/lib/contexts/auth-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <RepositoriesProvider>{children}</RepositoriesProvider>;
}
