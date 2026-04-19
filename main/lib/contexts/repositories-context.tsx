"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type RepositoryRecord = {
  id: number;
  name: string;
  url: string;
  provider: string;
  branch: string;
  status: string;
  description: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type RepositoriesContextValue = {
  repositories: RepositoryRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const RepositoriesContext = createContext<RepositoriesContextValue | null>(
  null,
);

export function RepositoriesProvider({ children }: { children: ReactNode }) {
  const [repositories, setRepositories] = useState<RepositoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/repositories", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Failed to load repositories",
        );
        setRepositories([]);
        return;
      }
      setRepositories(data.repositories ?? []);
    } catch {
      setError("Failed to load repositories");
      setRepositories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const value: RepositoriesContextValue = {
    repositories,
    isLoading,
    error,
    refetch,
  };

  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
}

export function useRepositories() {
  const ctx = useContext(RepositoriesContext);
  if (!ctx) {
    throw new Error("useRepositories must be used within RepositoriesProvider");
  }
  return ctx;
}
