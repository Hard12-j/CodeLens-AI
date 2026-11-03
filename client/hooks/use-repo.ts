"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type Repository } from "@/lib/api";
import { QueryKeys } from "@/lib/query-keys";
import { toast } from "@/components/ui/toast";

const INDEXING_POLL_INTERVAL = 2000;

export function getRepoProgress(repo: { filesProcessed: number; filesTotal: number }) {
    if (!repo.filesTotal || repo.filesTotal <= 0) return 0;
    return Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100));
}

function updateRepoInListCache(queryClient: ReturnType<typeof useQueryClient>, updatedRepo: Repository) {
    queryClient.setQueryData<Repository[]>(QueryKeys.repos.list(), (old) =>
        old ? old.map((r) => (r.id === updatedRepo.id ? updatedRepo : r)) : [updatedRepo]
    );
}

function hasIndexingRepos(repos: Repository[] | undefined) {
    return repos?.some((repo) => repo.indexStatus === "INDEXING") ?? false;
}

export function useRepo() {
    return useQuery({
        queryKey: QueryKeys.repos.list(),
        // Always use refresh=false when polling during indexing so the GitHub sync
        // never overwrites the INDEXING status / progress written by indexingService.
        // On the initial load (stale data) we use refresh=true to sync from GitHub.
        queryFn: ({ meta }) => {
            const isPolling = (meta as any)?.polling === true;
            return api.listRepos(!isPolling);
        },
        staleTime: 30_000,
        refetchInterval: (query) => {
            if (hasIndexingRepos(query.state.data)) {
                // tag subsequent fetches as polling so queryFn skips the GitHub sync
                query.options.meta = { ...(query.options.meta ?? {}), polling: true };
                return INDEXING_POLL_INTERVAL;
            }
            query.options.meta = { ...(query.options.meta ?? {}), polling: false };
            return false;
        },
    });
}

export function useStartIndexing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (repoId: string) => api.startIndex(repoId),
        onSuccess: (repo) => {
            queryClient.setQueryData(QueryKeys.repos.details(repo.id), repo);
            updateRepoInListCache(queryClient, repo);
            void queryClient.invalidateQueries({
                queryKey: QueryKeys.repos.list(),
            });
            void queryClient.invalidateQueries({
                queryKey: QueryKeys.repos.status(repo.id),
            });
            toast.add({
                title: "Indexing started",
                description: `Indexing ${repo.fullName}...`,
                type: "loading",
            });
        },
        onError: (error: any) => {
            toast.add({
                title: "Could not start indexing",
                description: error?.message || "Failed to start indexing",
                type: "error",
            });
        },
    });
}

export function useRefreshRepo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.listRepos(true),
        onSuccess: (repos) => {
            queryClient.setQueryData<Repository[]>(QueryKeys.repos.list(), repos);
        },
    });
}
