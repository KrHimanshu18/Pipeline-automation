import { DashboardLayout } from "@/components/dashboard";

export const metadata = {
  title: "Dashboard - PipelineAI",
  description: "Manage your CI/CD pipelines and repositories",
};

export default function DashboardPage() {
  return <DashboardLayout />;
}
