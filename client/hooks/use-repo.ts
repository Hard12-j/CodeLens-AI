"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast"
import { api, type Repository } from "@/lib/api"
import { QueryKeys } from "@/lib/query-keys"

const INDEXING_POLL_INTERVAL = 2000

export function getRepoProgress(repo: { filesProcessed: number; filesTotal: number }) {
    if (!repo.filesTotal || repo.filesTotal <= 0) return 0
    return Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100))
}

export function useRepository(repoId: string) {
    return useQuery({
        queryKey: QueryKeys.repos.details(repoId),
        queryFn: () => api.getRepo(repoId),
        enabled: Boolean(repoId),
        staleTime: 30_000,
    })
}

export function useIndexStatus(repoId: string, enabled = false) {
    return useQuery({
        queryKey: QueryKeys.repos.status(repoId),
        queryFn: () => api.indexStatus(repoId),
        enabled: Boolean(repoId) && enabled,
        refetchInterval: (query) => {
            const status = query.state.data?.indexStatus
            if (status === "INDEXING" || status === "PENDING") {
                return INDEXING_POLL_INTERVAL
            }
            return false
        },
    })
}

export function useRepoTree(repoId: string, enabled = true) {
    return useQuery({
        queryKey: ["repos", repoId, "tree"],
        queryFn: () => api.getRepoTree(repoId),
        enabled: Boolean(repoId) && enabled,
        staleTime: 60_000,
    })
}

function updateRepoInListCache(queryClient: ReturnType<typeof useQueryClient>, updatedRepo: Repository) {
    queryClient.setQueryData<Repository[]>(QueryKeys.repos.list(), (old) =>
        old ? old.map((r) => (r.id === updatedRepo.id ? updatedRepo : r)) : [updatedRepo]
    )
}

function hasIndexingRepos(repos: Repository[] | undefined) {
    return repos?.some((repo) => repo.indexStatus === "INDEXING") ?? false
}

export function useRepo() {
    return useQuery({
        queryKey: QueryKeys.repos.list(),
        queryFn: ({ meta }) => {
            const isPolling = (meta as any)?.polling === true
            return api.listRepos(!isPolling)
        },
        staleTime: 30_000,
        refetchInterval: (query) => {
            if (hasIndexingRepos(query.state.data)) {
                query.options.meta = { ...(query.options.meta ?? {}), polling: true }
                return INDEXING_POLL_INTERVAL
            }
            query.options.meta = { ...(query.options.meta ?? {}), polling: false }
            return false
        },
    })
}

export function useStartIndexing() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (repoId: string) => api.startIndex(repoId),
        onSuccess: (repo) => {
            queryClient.setQueryData(QueryKeys.repos.details(repo.id), repo)
            updateRepoInListCache(queryClient, repo)
            void queryClient.invalidateQueries({
                queryKey: QueryKeys.repos.list(),
            })
            void queryClient.invalidateQueries({
                queryKey: QueryKeys.repos.status(repo.id),
            })
            toast.add({
                title: "Indexing started",
                description: `Indexing ${repo.fullName}...`,
                type: "loading",
            })
        },
        onError: (error: any) => {
            toast.add({
                title: "Could not start indexing",
                description: error?.message || "Failed to start indexing",
                type: "error",
            })
        },
    })
}

export function useRefreshRepo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => api.listRepos(true),
        onSuccess: (repos) => {
            queryClient.setQueryData<Repository[]>(QueryKeys.repos.list(), repos)
        },
    })
}
