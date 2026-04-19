"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useRepositories } from "@/lib/contexts/repositories-context";
import { WorkflowsViewer } from "@/components/dashboard/workflows-viewer";

export default function RepositoryPage() {
  const router = useRouter();
  const params = useParams();
  const { repositories } = useRepositories();

  const repoId = parseInt(params.id as string, 10);
  const repository = repositories.find((r) => r.id === repoId);

  if (!repository) {
    return (
      <div className="min-h-screen bg-black p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="text-center space-y-4 mt-12">
          <h1 className="text-2xl font-bold text-white">
            Repository not found
          </h1>
          <p className="text-gray-400">
            The requested repository could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Repositories
        </button>

        <WorkflowsViewer
          repositoryId={repository.id}
          repositoryName={repository.name}
        />
      </div>
    </div>
  );
}
